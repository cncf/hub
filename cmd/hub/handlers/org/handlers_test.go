package org

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/artifacthub/hub/cmd/hub/handlers/helpers"
	"github.com/artifacthub/hub/internal/hub"
	"github.com/artifacthub/hub/internal/org"
	"github.com/artifacthub/hub/internal/tests"
	"github.com/go-chi/chi"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestMain(m *testing.M) {
	zerolog.SetGlobalLevel(zerolog.Disabled)
	os.Exit(m.Run())
}

func TestAdd(t *testing.T) {
	t.Run("invalid organization provided", func(t *testing.T) {
		testCases := []struct {
			description string
			repoJSON    string
		}{
			{
				"no organization provided",
				"",
			},
			{
				"invalid json",
				"-",
			},
			{
				"missing name",
				`{"display_name": "Display Name"}`,
			},
			{
				"invalid name",
				`{"name": "_org"}`,
			},
			{
				"invalid name",
				`{"name": " org"}`,
			},
			{
				"invalid name",
				`{"name": "ORG"}`,
			},
		}
		for _, tc := range testCases {
			tc := tc
			t.Run(tc.description, func(t *testing.T) {
				hw := newHandlersWrapper()

				w := httptest.NewRecorder()
				r, _ := http.NewRequest("POST", "/", strings.NewReader(tc.repoJSON))
				r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
				hw.h.Add(w, r)
				resp := w.Result()
				defer resp.Body.Close()

				assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
			})
		}
	})

	t.Run("valid organization provided", func(t *testing.T) {
		orgJSON := `
		{
			"name": "org1",
			"display_name": "Organization 1",
			"description": "description"
		}
		`
		testCases := []struct {
			description        string
			err                error
			expectedStatusCode int
		}{
			{
				"add organization succeeded",
				nil,
				http.StatusOK,
			},
			{
				"error adding organization",
				tests.ErrFakeDatabaseFailure,
				http.StatusInternalServerError,
			},
		}
		for _, tc := range testCases {
			tc := tc
			t.Run(tc.description, func(t *testing.T) {
				hw := newHandlersWrapper()
				hw.om.On("Add", mock.Anything, mock.Anything).Return(tc.err)

				w := httptest.NewRecorder()
				r, _ := http.NewRequest("POST", "/", strings.NewReader(orgJSON))
				r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
				hw.h.Add(w, r)
				resp := w.Result()
				defer resp.Body.Close()

				assert.Equal(t, tc.expectedStatusCode, resp.StatusCode)
				hw.om.AssertExpectations(t)
			})
		}
	})
}

func TestAddMember(t *testing.T) {
	t.Run("valid member provided", func(t *testing.T) {
		testCases := []struct {
			description        string
			err                error
			expectedStatusCode int
		}{
			{
				"add member succeeded",
				nil,
				http.StatusOK,
			},
			{
				"error adding member",
				tests.ErrFakeDatabaseFailure,
				http.StatusInternalServerError,
			},
		}
		for _, tc := range testCases {
			tc := tc
			t.Run(tc.description, func(t *testing.T) {
				hw := newHandlersWrapper()
				hw.om.On("AddMember", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
					Return(tc.err)

				w := httptest.NewRecorder()
				r, _ := http.NewRequest("POST", "/", strings.NewReader("member=userAlias"))
				r.Header.Set("Content-Type", "application/x-www-form-urlencoded")
				r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
				hw.h.AddMember(w, r)
				resp := w.Result()
				defer resp.Body.Close()

				assert.Equal(t, tc.expectedStatusCode, resp.StatusCode)
				hw.om.AssertExpectations(t)
			})
		}
	})
}

func TestCheckAvailability(t *testing.T) {
	t.Run("invalid resource kind", func(t *testing.T) {
		hw := newHandlersWrapper()

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("HEAD", "/?v=value", nil)
		rctx := &chi.Context{
			URLParams: chi.RouteParams{
				Keys:   []string{"resourceKind"},
				Values: []string{"invalidKind"},
			},
		}
		r = r.WithContext(context.WithValue(r.Context(), chi.RouteCtxKey, rctx))
		hw.h.CheckAvailability(w, r)
		resp := w.Result()
		defer resp.Body.Close()

		assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
	})

	t.Run("invalid value", func(t *testing.T) {
		hw := newHandlersWrapper()

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("HEAD", "/", nil)
		rctx := &chi.Context{
			URLParams: chi.RouteParams{
				Keys:   []string{"resourceKind"},
				Values: []string{"userAlias"},
			},
		}
		r = r.WithContext(context.WithValue(r.Context(), chi.RouteCtxKey, rctx))
		hw.h.CheckAvailability(w, r)
		resp := w.Result()
		defer resp.Body.Close()

		assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
	})

	t.Run("valid resource kind", func(t *testing.T) {
		t.Run("check availability succeeded", func(t *testing.T) {
			testCases := []struct {
				resourceKind string
				available    bool
			}{
				{
					"organizationName",
					true,
				},
			}
			for _, tc := range testCases {
				tc := tc
				t.Run(fmt.Sprintf("resource kind: %s", tc.resourceKind), func(t *testing.T) {
					hw := newHandlersWrapper()
					hw.om.On("CheckAvailability", mock.Anything, mock.Anything, mock.Anything).
						Return(tc.available, nil)

					w := httptest.NewRecorder()
					r, _ := http.NewRequest("HEAD", "/?v=value", nil)
					rctx := &chi.Context{
						URLParams: chi.RouteParams{
							Keys:   []string{"resourceKind"},
							Values: []string{tc.resourceKind},
						},
					}
					r = r.WithContext(context.WithValue(r.Context(), chi.RouteCtxKey, rctx))
					hw.h.CheckAvailability(w, r)
					resp := w.Result()
					defer resp.Body.Close()
					h := resp.Header

					if tc.available {
						assert.Equal(t, http.StatusNotFound, resp.StatusCode)
					} else {
						assert.Equal(t, http.StatusOK, resp.StatusCode)
					}
					assert.Equal(t, helpers.BuildCacheControlHeader(0), h.Get("Cache-Control"))
					hw.om.AssertExpectations(t)
				})
			}
		})

		t.Run("check availability failed", func(t *testing.T) {
			hw := newHandlersWrapper()
			hw.om.On("CheckAvailability", mock.Anything, mock.Anything, mock.Anything).
				Return(false, tests.ErrFakeDatabaseFailure)

			w := httptest.NewRecorder()
			r, _ := http.NewRequest("HEAD", "/?v=value", nil)
			rctx := &chi.Context{
				URLParams: chi.RouteParams{
					Keys:   []string{"resourceKind"},
					Values: []string{"organizationName"},
				},
			}
			r = r.WithContext(context.WithValue(r.Context(), chi.RouteCtxKey, rctx))
			hw.h.CheckAvailability(w, r)
			resp := w.Result()
			defer resp.Body.Close()

			assert.Equal(t, http.StatusInternalServerError, resp.StatusCode)
			hw.om.AssertExpectations(t)
		})
	})
}

func TestConfirmMembership(t *testing.T) {
	t.Run("confirm membership succeeded", func(t *testing.T) {
		hw := newHandlersWrapper()
		hw.om.On("ConfirmMembership", mock.Anything, mock.Anything).Return(nil)

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("PUT", "/", nil)
		r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
		hw.h.ConfirmMembership(w, r)
		resp := w.Result()
		defer resp.Body.Close()

		assert.Equal(t, http.StatusOK, resp.StatusCode)
		hw.om.AssertExpectations(t)
	})

	t.Run("error confirming membership", func(t *testing.T) {
		hw := newHandlersWrapper()
		hw.om.On("ConfirmMembership", mock.Anything, mock.Anything).Return(tests.ErrFakeDatabaseFailure)

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("PUT", "/", nil)
		r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
		hw.h.ConfirmMembership(w, r)
		resp := w.Result()
		defer resp.Body.Close()

		assert.Equal(t, http.StatusInternalServerError, resp.StatusCode)
		hw.om.AssertExpectations(t)
	})
}

func TestDeleteMember(t *testing.T) {
	t.Run("delete member succeeded", func(t *testing.T) {
		hw := newHandlersWrapper()
		hw.om.On("DeleteMember", mock.Anything, mock.Anything, mock.Anything).Return(nil)

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("DELETE", "/", nil)
		r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
		hw.h.DeleteMember(w, r)
		resp := w.Result()
		defer resp.Body.Close()

		assert.Equal(t, http.StatusOK, resp.StatusCode)
		hw.om.AssertExpectations(t)
	})

	t.Run("error deleting member", func(t *testing.T) {
		hw := newHandlersWrapper()
		hw.om.On("DeleteMember", mock.Anything, mock.Anything, mock.Anything).
			Return(tests.ErrFakeDatabaseFailure)

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("DELETE", "/", nil)
		r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
		hw.h.DeleteMember(w, r)
		resp := w.Result()
		defer resp.Body.Close()

		assert.Equal(t, http.StatusInternalServerError, resp.StatusCode)
		hw.om.AssertExpectations(t)
	})
}

func TestGet(t *testing.T) {
	t.Run("get organization succeeded", func(t *testing.T) {
		hw := newHandlersWrapper()
		hw.om.On("GetJSON", mock.Anything, mock.Anything).Return([]byte("dataJSON"), nil)

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("GET", "/", nil)
		r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
		hw.h.Get(w, r)
		resp := w.Result()
		defer resp.Body.Close()
		h := resp.Header
		data, _ := ioutil.ReadAll(resp.Body)

		assert.Equal(t, http.StatusOK, resp.StatusCode)
		assert.Equal(t, "application/json", h.Get("Content-Type"))
		assert.Equal(t, helpers.BuildCacheControlHeader(0), h.Get("Cache-Control"))
		assert.Equal(t, []byte("dataJSON"), data)
		hw.om.AssertExpectations(t)
	})

	t.Run("error getting organization", func(t *testing.T) {
		hw := newHandlersWrapper()
		hw.om.On("GetJSON", mock.Anything, mock.Anything).Return(nil, tests.ErrFakeDatabaseFailure)

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("GET", "/", nil)
		r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
		hw.h.Get(w, r)
		resp := w.Result()
		defer resp.Body.Close()

		assert.Equal(t, http.StatusInternalServerError, resp.StatusCode)
		hw.om.AssertExpectations(t)
	})
}

func TestGetByUser(t *testing.T) {
	t.Run("get user organizations succeeded", func(t *testing.T) {
		hw := newHandlersWrapper()
		hw.om.On("GetByUserJSON", mock.Anything).Return([]byte("dataJSON"), nil)

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("GET", "/", nil)
		r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
		hw.h.GetByUser(w, r)
		resp := w.Result()
		defer resp.Body.Close()
		h := resp.Header
		data, _ := ioutil.ReadAll(resp.Body)

		assert.Equal(t, http.StatusOK, resp.StatusCode)
		assert.Equal(t, "application/json", h.Get("Content-Type"))
		assert.Equal(t, helpers.BuildCacheControlHeader(0), h.Get("Cache-Control"))
		assert.Equal(t, []byte("dataJSON"), data)
		hw.om.AssertExpectations(t)
	})

	t.Run("error getting user organizations", func(t *testing.T) {
		hw := newHandlersWrapper()
		hw.om.On("GetByUserJSON", mock.Anything).Return(nil, tests.ErrFakeDatabaseFailure)

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("GET", "/", nil)
		r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
		hw.h.GetByUser(w, r)
		resp := w.Result()
		defer resp.Body.Close()

		assert.Equal(t, http.StatusInternalServerError, resp.StatusCode)
		hw.om.AssertExpectations(t)
	})
}

func TestGetMembers(t *testing.T) {
	t.Run("get organization members succeeded", func(t *testing.T) {
		hw := newHandlersWrapper()
		hw.om.On("GetMembersJSON", mock.Anything, mock.Anything).Return([]byte("dataJSON"), nil)

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("GET", "/", nil)
		r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
		hw.h.GetMembers(w, r)
		resp := w.Result()
		defer resp.Body.Close()
		h := resp.Header
		data, _ := ioutil.ReadAll(resp.Body)

		assert.Equal(t, http.StatusOK, resp.StatusCode)
		assert.Equal(t, "application/json", h.Get("Content-Type"))
		assert.Equal(t, helpers.BuildCacheControlHeader(0), h.Get("Cache-Control"))
		assert.Equal(t, []byte("dataJSON"), data)
		hw.om.AssertExpectations(t)
	})

	t.Run("error getting organization members", func(t *testing.T) {
		hw := newHandlersWrapper()
		hw.om.On("GetMembersJSON", mock.Anything, mock.Anything).Return(nil, tests.ErrFakeDatabaseFailure)

		w := httptest.NewRecorder()
		r, _ := http.NewRequest("GET", "/", nil)
		r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
		hw.h.GetMembers(w, r)
		resp := w.Result()
		defer resp.Body.Close()

		assert.Equal(t, http.StatusInternalServerError, resp.StatusCode)
		hw.om.AssertExpectations(t)
	})
}

func TestUpdate(t *testing.T) {
	t.Run("invalid organization provided", func(t *testing.T) {
		testCases := []struct {
			description string
			repoJSON    string
		}{
			{
				"no organization provided",
				"",
			},
			{
				"invalid json",
				"-",
			},
		}
		for _, tc := range testCases {
			tc := tc
			t.Run(tc.description, func(t *testing.T) {
				hw := newHandlersWrapper()

				w := httptest.NewRecorder()
				r, _ := http.NewRequest("PUT", "/", strings.NewReader(tc.repoJSON))
				r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
				hw.h.Update(w, r)
				resp := w.Result()
				defer resp.Body.Close()

				assert.Equal(t, http.StatusBadRequest, resp.StatusCode)
			})
		}
	})

	t.Run("valid organization provided", func(t *testing.T) {
		orgJSON := `
		{
			"name": "org1",
			"display_name": "Organization 1 updated",
			"description": "description updated"
		}
		`
		testCases := []struct {
			description        string
			err                error
			expectedStatusCode int
		}{
			{
				"organization update succeeded",
				nil,
				http.StatusOK,
			},
			{
				"error updating organization",
				tests.ErrFakeDatabaseFailure,
				http.StatusInternalServerError,
			},
		}
		for _, tc := range testCases {
			tc := tc
			t.Run(tc.description, func(t *testing.T) {
				hw := newHandlersWrapper()
				hw.om.On("Update", mock.Anything, mock.Anything).Return(tc.err)

				w := httptest.NewRecorder()
				r, _ := http.NewRequest("PUT", "/", strings.NewReader(orgJSON))
				r = r.WithContext(context.WithValue(r.Context(), hub.UserIDKey, "userID"))
				hw.h.Update(w, r)
				resp := w.Result()
				defer resp.Body.Close()

				assert.Equal(t, tc.expectedStatusCode, resp.StatusCode)
				hw.om.AssertExpectations(t)
			})
		}
	})
}

type handlersWrapper struct {
	om *org.ManagerMock
	h  *Handlers
}

func newHandlersWrapper() *handlersWrapper {
	om := &org.ManagerMock{}

	return &handlersWrapper{
		om: om,
		h:  NewHandlers(om),
	}
}
