package main

import (
	"context"
	"errors"
	"fmt"
	"image"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"
	"runtime/debug"
	"strings"
	"sync"

	"github.com/artifacthub/hub/internal/hub"
	"github.com/artifacthub/hub/internal/img"
	"github.com/artifacthub/hub/internal/license"
	"github.com/artifacthub/hub/internal/tracker"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/vincent-petithory/dataurl"
	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/chart/loader"
)

// HTTPGetter defines the methods an HTTPGetter implementation must provide.
type HTTPGetter interface {
	Get(url string) (*http.Response, error)
}

// Worker is in charge of handling chart releases register and unregister jobs
// generated by the dispatcher.
type Worker struct {
	ctx    context.Context
	id     int
	pm     hub.PackageManager
	is     img.Store
	ec     tracker.ErrorsCollector
	hg     HTTPGetter
	logger zerolog.Logger
}

// NewWorker creates a new worker instance.
func NewWorker(
	ctx context.Context,
	id int,
	pm hub.PackageManager,
	is img.Store,
	ec tracker.ErrorsCollector,
	httpClient HTTPGetter,
) *Worker {
	return &Worker{
		ctx:    ctx,
		id:     id,
		pm:     pm,
		is:     is,
		ec:     ec,
		hg:     httpClient,
		logger: log.With().Int("worker", id).Logger(),
	}
}

// Run instructs the worker to start handling jobs. It will keep running until
// the jobs queue is empty or the context is done.
func (w *Worker) Run(wg *sync.WaitGroup, queue chan *Job) {
	defer wg.Done()
	for {
		select {
		case j, ok := <-queue:
			if !ok {
				return
			}
			md := j.ChartVersion.Metadata
			w.logger.Debug().
				Str("repo", j.Repo.Name).
				Str("chart", md.Name).
				Str("version", md.Version).
				Int("jobKind", int(j.Kind)).
				Msg("handling job")
			var err error
			switch j.Kind {
			case Register:
				err = w.handleRegisterJob(j)
			case Unregister:
				err = w.handleUnregisterJob(j)
			}
			if err != nil {
				w.logger.Error().
					Err(err).
					Str("repo", j.Repo.Name).
					Str("chart", md.Name).
					Str("version", md.Version).
					Int("jobKind", int(j.Kind)).
					Msg("error handling job")
			}
		case <-w.ctx.Done():
			return
		}
	}
}

// getImage gets the image located at the url provided. If it's a data url the
// image is extracted from it. Otherwise it's downloaded using the url.
func (w *Worker) getImage(u string) ([]byte, error) {
	// Image in data url
	if strings.HasPrefix(u, "data:") {
		dataURL, err := dataurl.DecodeString(u)
		if err != nil {
			return nil, err
		}
		return dataURL.Data, nil
	}

	// Download image using url provided
	resp, err := w.hg.Get(u)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusOK {
		return ioutil.ReadAll(resp.Body)
	}
	return nil, fmt.Errorf("unexpected status code received: %d", resp.StatusCode)
}

// handleRegisterJob handles the provided chart release registration job. This
// involves downloading the chart archive, extracting its contents and register
// the corresponding package.
func (w *Worker) handleRegisterJob(j *Job) error {
	defer func() {
		if r := recover(); r != nil {
			w.logger.Error().
				Str("repo", j.Repo.Name).
				Str("chart", j.ChartVersion.Metadata.Name).
				Str("version", j.ChartVersion.Metadata.Version).
				Bytes("stacktrace", debug.Stack()).
				Interface("recover", r).
				Msg("handleJob panic")
		}
	}()

	// Prepare chart archive url
	u := j.ChartVersion.URLs[0]
	if _, err := url.ParseRequestURI(u); err != nil {
		tmp, err := url.Parse(j.Repo.URL)
		if err != nil {
			w.ec.Append(j.Repo.RepositoryID, fmt.Errorf("invalid chart url: %s", u))
			w.logger.Error().Str("url", u).Msg("invalid url")
			return err
		}
		tmp.Path = path.Join(tmp.Path, u)
		u = tmp.String()
	}

	// Load chart from remote archive
	chart, err := w.loadChart(u)
	if err != nil {
		w.ec.Append(j.Repo.RepositoryID, fmt.Errorf("error loading chart %s: %w", u, err))
		w.logger.Warn().
			Str("repo", j.Repo.Name).
			Str("chart", j.ChartVersion.Metadata.Name).
			Str("version", j.ChartVersion.Metadata.Version).
			Str("url", u).
			Msg("chart load failed")
		return nil
	}
	md := chart.Metadata

	// Store logo when available if requested
	var logoURL, logoImageID string
	if j.GetLogo && md.Icon != "" {
		logoURL = md.Icon
		data, err := w.getImage(md.Icon)
		if err != nil {
			w.ec.Append(j.Repo.RepositoryID, fmt.Errorf("error getting logo image %s: %w", md.Icon, err))
			w.logger.Debug().Err(err).Str("url", md.Icon).Msg("get image failed")
		} else {
			logoImageID, err = w.is.SaveImage(w.ctx, data)
			if err != nil && !errors.Is(err, image.ErrFormat) {
				w.logger.Warn().Err(err).Str("url", md.Icon).Msg("save image failed")
			}
		}
	}

	// Prepare hub package to be registered
	p := &hub.Package{
		Name:        md.Name,
		LogoURL:     logoURL,
		LogoImageID: logoImageID,
		Description: md.Description,
		Keywords:    md.Keywords,
		HomeURL:     md.Home,
		Version:     md.Version,
		AppVersion:  md.AppVersion,
		Digest:      j.ChartVersion.Digest,
		Deprecated:  md.Deprecated,
		ContentURL:  u,
		CreatedAt:   j.ChartVersion.Created.Unix(),
		Repository:  j.Repo,
	}
	readme := getFile(chart, "README.md")
	if readme != nil {
		p.Readme = string(readme.Data)
	}
	licenseFile := getFile(chart, "LICENSE")
	if licenseFile != nil {
		p.License = license.Detect(licenseFile.Data)
	}
	hasProvenanceFile, err := w.chartVersionHasProvenanceFile(u)
	if err == nil {
		p.Signed = hasProvenanceFile
	} else {
		w.logger.Warn().Err(err).Msg("error checking provenance file")
	}
	var maintainers []*hub.Maintainer
	for _, entry := range md.Maintainers {
		if entry.Email != "" {
			maintainers = append(maintainers, &hub.Maintainer{
				Name:  entry.Name,
				Email: entry.Email,
			})
		}
	}
	if len(maintainers) > 0 {
		p.Maintainers = maintainers
	}

	// Register package
	err = w.pm.Register(w.ctx, p)
	if err != nil {
		w.ec.Append(
			j.Repo.RepositoryID,
			fmt.Errorf("error registering package %s version %s: %w", p.Name, p.Version, err),
		)
	}
	return err
}

// handleUnregisterJob handles the provided chart release unregistration job.
// This involves deleting the package version corresponding to a given chart
// release.
func (w *Worker) handleUnregisterJob(j *Job) error {
	// Unregister package
	p := &hub.Package{
		Name:       j.ChartVersion.Name,
		Version:    j.ChartVersion.Version,
		Repository: j.Repo,
	}
	err := w.pm.Unregister(w.ctx, p)
	if err != nil {
		w.ec.Append(
			j.Repo.RepositoryID,
			fmt.Errorf("error unregistering package %s version %s: %w", p.Name, p.Version, err),
		)
	}
	return err
}

// loadChart loads a chart from a remote archive located at the url provided.
func (w *Worker) loadChart(u string) (*chart.Chart, error) {
	resp, err := w.hg.Get(u)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusOK {
		chart, err := loader.LoadArchive(resp.Body)
		if err != nil {
			return nil, err
		}
		return chart, nil
	}
	return nil, fmt.Errorf("unexpected status code received: %d", resp.StatusCode)
}

// chartVersionHasProvenanceFile checks if a chart version has a provenance
// file checking if a .prov file exists for the chart version url provided.
func (w *Worker) chartVersionHasProvenanceFile(u string) (bool, error) {
	resp, err := w.hg.Get(u + ".prov")
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusOK {
		return true, nil
	}
	return false, nil
}

// getFile returns the file requested from the provided chart.
func getFile(chart *chart.Chart, name string) *chart.File {
	for _, file := range chart.Files {
		if file.Name == name {
			return file
		}
	}
	return nil
}
