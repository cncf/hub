import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mocked } from 'ts-jest/utils';

import API from '../../../../api';
import { AppCtx } from '../../../../context/AppCtx';
import { ErrorKind, SearchResults, Webhook } from '../../../../types';
import WebhookForm from './Form';
jest.mock('../../../../api');
jest.mock('../../../common/Alert', () => (props: any) => <div>{props.message}</div>);

const getMockWebhook = (fixtureId: string): Webhook => {
  return require(`./__fixtures__/Form/${fixtureId}.json`) as Webhook;
};

const getMockSearch = (fixtureId: string): SearchResults => {
  return require(`./__fixtures__/Form/${fixtureId}s.json`) as SearchResults;
};

const mockOnSuccess = jest.fn();
const mockOnClose = jest.fn();
const mockOnAuthError = jest.fn();

const defaultProps = {
  onSuccess: mockOnSuccess,
  onClose: mockOnClose,
  onAuthError: mockOnAuthError,
};

const mockUserCtx = {
  user: { alias: 'userAlias', email: 'jsmith@email.com', passwordSet: true },
  prefs: {
    controlPanel: {},
    search: { limit: 60 },
    theme: {
      configured: 'light',
      effective: 'light',
    },
    notifications: {
      lastDisplayedTime: null,
      enabled: true,
      displayed: [],
    },
  },
};

const mockOrgCtx = {
  user: { alias: 'userAlias', email: 'jsmith@email.com', passwordSet: true },
  prefs: {
    controlPanel: { selectedOrg: 'test' },
    search: { limit: 60 },
    theme: {
      configured: 'light',
      effective: 'light',
    },
    notifications: {
      lastDisplayedTime: null,
      enabled: true,
      displayed: [],
    },
  },
};

describe('WebhookForm', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates snapshot', () => {
    const mockWebhook = getMockWebhook('1');
    const { asFragment } = render(
      <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
        <Router>
          <WebhookForm {...defaultProps} webhook={mockWebhook} />
        </Router>
      </AppCtx.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  describe('Render', () => {
    it('when webhook edition', () => {
      const mockWebhook = getMockWebhook('2');

      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} webhook={mockWebhook} />
          </Router>
        </AppCtx.Provider>
      );

      expect(screen.getByRole('button', { name: 'Back to webhooks list' })).toBeInTheDocument();
      expect(screen.getByText('Back to webhooks list')).toBeInTheDocument();
      expect(screen.getByTestId('webhookForm')).toBeInTheDocument();

      expect(screen.getByRole('textbox', { name: /Name/ })).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Name/ })).toHaveValue(mockWebhook.name);

      expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(mockWebhook.description!);

      expect(
        screen.getByText(
          'A POST request will be sent to the provided URL when any of the events selected in the triggers section happens.'
        )
      ).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Url/ })).toBeInTheDocument();
      expect(screen.getByText('Url')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Url/ })).toHaveValue(mockWebhook.url);

      expect(screen.getByText(/X-ArtifactHub-Secret/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Secret' })).toBeInTheDocument();
      expect(screen.getByText('Secret')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Secret' })).toHaveValue(mockWebhook.secret!);

      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(
        screen.getByText(
          'This flag indicates if the webhook is active or not. Inactive webhooks will not receive notifications.'
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Triggers')).toBeInTheDocument();

      expect(screen.getByText('Events')).toBeInTheDocument();
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();

      expect(screen.getByText('Packages')).toBeInTheDocument();
      expect(
        screen.getByText(
          "When the events selected happen for any of the packages you've chosen, a notification will be triggered and the configured url will be called. At least one package must be selected."
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Package')).toBeInTheDocument();
      expect(screen.getByText('Publisher')).toBeInTheDocument();
      expect(screen.getAllByTestId('packageTableCell')).toHaveLength(1);

      expect(screen.getByText('Payload')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Default payload' })).not.toBeChecked();
      expect(screen.getByRole('radio', { name: 'Custom payload' })).toBeChecked();
      expect(screen.getByText('Default payload')).toBeInTheDocument();
      expect(screen.getByText('Custom payload')).toBeInTheDocument();
      expect(
        screen.getByText(
          "It's possible to customize the payload used to notify your service. This may help integrating ArtifactHub webhooks with other services without requiring you to write any code. To integrate ArtifactHub webhooks with Slack, for example, you could use a custom payload using the following template:"
        )
      ).toBeInTheDocument();

      expect(screen.getByRole('textbox', { name: /Content-Type/ })).toBeInTheDocument();
      expect(screen.getByText('Request Content-Type')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Content-Type/ })).toHaveValue(mockWebhook.contentType!);

      expect(screen.getByText('Template')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Template Variables reference/ })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Template Variables reference/ })).toHaveValue(mockWebhook.template!);

      expect(screen.getByText('Variables reference')).toBeInTheDocument();
      expect(screen.getByText(`{{ .Event.Kind }}`)).toBeInTheDocument();
      expect(screen.getByText('Version of the new release.')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Test webhook' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Test webhook' })).toBeEnabled();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add webhook' })).toBeInTheDocument();
    });

    it('when webhook addition', () => {
      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      expect(screen.getByRole('button', { name: 'Back to webhooks list' })).toBeInTheDocument();
      expect(screen.getByText('Back to webhooks list')).toBeInTheDocument();
      expect(screen.getByTestId('webhookForm')).toBeInTheDocument();

      expect(screen.getByRole('textbox', { name: /Name/ })).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Name/ })).toHaveValue('');

      expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue('');

      expect(
        screen.getByText(
          'A POST request will be sent to the provided URL when any of the events selected in the triggers section happens.'
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId('urlInput')).toBeInTheDocument();
      expect(screen.getByText('Url')).toBeInTheDocument();
      expect(screen.getByTestId('urlInput')).toHaveValue('');

      expect(screen.getByText(/X-ArtifactHub-Secret/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Secret' })).toBeInTheDocument();
      expect(screen.getByText('Secret')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Secret' })).toHaveValue('');

      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(
        screen.getByText(
          'This flag indicates if the webhook is active or not. Inactive webhooks will not receive notifications.'
        )
      ).toBeInTheDocument();

      expect(screen.getByText('Triggers')).toBeInTheDocument();

      expect(screen.getByText('Events')).toBeInTheDocument();

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();

      expect(screen.getByText('Packages')).toBeInTheDocument();
      expect(
        screen.getByText(
          "When the events selected happen for any of the packages you've chosen, a notification will be triggered and the configured url will be called. At least one package must be selected."
        )
      ).toBeInTheDocument();
      expect(screen.queryByText('Package')).toBeNull();
      expect(screen.queryByText('Publisher')).toBeNull();

      expect(screen.getByText('Payload')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Default payload' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Custom payload' })).not.toBeChecked();
      expect(screen.getByText('Default payload')).toBeInTheDocument();
      expect(screen.getByText('Custom payload')).toBeInTheDocument();
      expect(
        screen.queryByText(
          "It's possible to customize the payload used to notify your service. This may help integrating ArtifactHub webhooks with other services without requiring you to write any code. To integrate ArtifactHub webhooks with Slack, for example, you could use a custom payload using the following template:"
        )
      ).toBeNull();

      expect(screen.getByRole('textbox', { name: /Content-Type/ })).toBeInTheDocument();
      expect(screen.getByText('Request Content-Type')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Content-Type/ })).toHaveValue('');
      expect(screen.getByPlaceholderText('application/cloudevents+json')).toBeInTheDocument();

      expect(screen.getByText('Template')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Template Variables reference/ })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Template Variables reference/ })).toBeDisabled();
      expect(screen.getByRole('textbox', { name: /Template Variables reference/ })).toHaveValue(`{
    "specversion" : "1.0",
    "id" : "{{ .Event.ID }}",
    "source" : "{{ .BaseURL }}",
    "type" : "io.artifacthub.{{ .Event.Kind }}",
    "datacontenttype" : "application/json",
    "data" : {
        "package": {
            "name": "{{ .Package.Name }}",
            "version": "{{ .Package.Version }}",
            "url": "{{ .Package.URL }}",
            "changes": [{{range $i, $e := .Package.Changes}}{{if $i}}, {{end}}"{{.Description}}"{{end}}],
            "containsSecurityUpdates": {{ .Package.ContainsSecurityUpdates }},
            "prerelease": {{ .Package.Prerelease }},
            "repository": {
                "kind": "{{ .Package.Repository.Kind }}",
                "name": "{{ .Package.Repository.Name }}",
                "publisher": "{{ .Package.Repository.Publisher }}"
            }
        }
    }
}`);

      expect(screen.getByText('Variables reference')).toBeInTheDocument();
      expect(screen.getByText(`{{ .Event.Kind }}`)).toBeInTheDocument();
      expect(screen.getByText('Version of the new release.')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Test webhook' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Test webhook' })).toBeDisabled();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Add')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add webhook' })).toBeInTheDocument();
    });

    it('closes form on back button click', () => {
      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      const btn = screen.getByRole('button', { name: 'Back to webhooks list' });
      userEvent.click(btn);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('closes form on Cancel button click', () => {
      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      const btn = screen.getByText('Cancel');
      userEvent.click(btn);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form submission', () => {
    it('when incomplete form', () => {
      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      const btn = screen.getByRole('button', { name: 'Add webhook' });
      userEvent.click(btn);

      expect(screen.getAllByText('This field is required')).toHaveLength(4);
      expect(screen.getByText('At least one package has to be selected')).toBeInTheDocument();
    });

    it('calls updateWebhook', async () => {
      mocked(API).updateWebhook.mockResolvedValue(null);
      const mockWebhook = getMockWebhook('3');

      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
          </Router>
        </AppCtx.Provider>
      );

      const input = screen.getByRole('textbox', { name: /Name/ });
      userEvent.clear(input);
      userEvent.type(input, 'test');

      const btn = screen.getByRole('button', { name: 'Add webhook' });
      userEvent.click(btn);

      await waitFor(() => {
        expect(API.updateWebhook).toHaveBeenCalledTimes(1);
        expect(API.updateWebhook).toHaveBeenCalledWith(
          {
            ...mockWebhook,
            name: 'test',
          },
          undefined
        );
      });

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls updateWebhook with selected org context', async () => {
      mocked(API).updateWebhook.mockResolvedValue(null);
      const mockWebhook = getMockWebhook('4');

      render(
        <AppCtx.Provider value={{ ctx: mockOrgCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
          </Router>
        </AppCtx.Provider>
      );

      const input = screen.getByRole('textbox', { name: /Name/ });
      userEvent.clear(input);
      userEvent.type(input, 'test');

      const btn = screen.getByRole('button', { name: 'Add webhook' });
      userEvent.click(btn);

      await waitFor(() => {
        expect(API.updateWebhook).toHaveBeenCalledTimes(1);
        expect(API.updateWebhook).toHaveBeenCalledWith(
          {
            ...mockWebhook,
            name: 'test',
          },
          'test'
        );
      });

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls updateWebhook with securityAlert event selected', async () => {
      mocked(API).updateWebhook.mockResolvedValue(null);
      const mockWebhook = getMockWebhook('14');

      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
          </Router>
        </AppCtx.Provider>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
      expect(checkboxes[2]).not.toBeChecked();
      userEvent.click(checkboxes[2]);
      expect(checkboxes[2]).toBeChecked();

      const btn = screen.getByRole('button', { name: 'Add webhook' });
      userEvent.click(btn);

      await waitFor(() => {
        expect(API.updateWebhook).toHaveBeenCalledTimes(1);
        expect(API.updateWebhook).toHaveBeenCalledWith(
          {
            ...mockWebhook,
            eventKinds: [0, 1],
          },
          undefined
        );
      });

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls addWebhook', async () => {
      mocked(API).addWebhook.mockResolvedValue(null);
      const mockSearch = getMockSearch('1');
      mocked(API).searchPackages.mockResolvedValue(mockSearch);

      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      const nameInput = screen.getByRole('textbox', { name: /Name/ });
      userEvent.type(nameInput, 'test');

      const urlInput = screen.getByRole('textbox', { name: /Url/ });
      userEvent.type(urlInput, 'http://url.com');

      const input = screen.getByRole('textbox', { name: 'Search packages' });
      userEvent.type(input, 'testing');

      await waitFor(() => {
        expect(API.searchPackages).toHaveBeenCalledTimes(1);
      });

      const packages = screen.getAllByTestId('packageItem');
      userEvent.click(packages[0]);

      const btn = screen.getByRole('button', { name: 'Add webhook' });
      userEvent.click(btn);

      await waitFor(() => {
        expect(API.addWebhook).toHaveBeenCalledTimes(1);
        expect(API.addWebhook).toHaveBeenCalledWith(
          {
            name: 'test',
            url: 'http://url.com',
            active: true,
            description: '',
            secret: '',
            eventKinds: [0],
            packages: [mockSearch.packages![0]],
          },
          undefined
        );
      });

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    describe('when fails', () => {
      it('UnauthorizedError', async () => {
        mocked(API).updateWebhook.mockRejectedValue({
          kind: ErrorKind.Unauthorized,
        });
        const mockWebhook = getMockWebhook('5');

        render(
          <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
            <Router>
              <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
            </Router>
          </AppCtx.Provider>
        );

        const input = screen.getByRole('textbox', { name: /Name/ });
        userEvent.clear(input);
        userEvent.type(input, 'test');

        const btn = screen.getByRole('button', { name: 'Add webhook' });
        userEvent.click(btn);

        await waitFor(() => {
          expect(API.updateWebhook).toHaveBeenCalledTimes(1);
          expect(API.updateWebhook).toHaveBeenCalledWith(
            {
              ...mockWebhook,
              name: 'test',
            },
            undefined
          );
        });

        expect(mockOnAuthError).toHaveBeenCalledTimes(1);
      });

      it('with error message', async () => {
        mocked(API).updateWebhook.mockRejectedValue({
          kind: ErrorKind.Other,
          message: 'message error',
        });
        const mockWebhook = getMockWebhook('6');

        render(
          <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
            <Router>
              <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
            </Router>
          </AppCtx.Provider>
        );

        const input = screen.getByRole('textbox', { name: /Name/ });
        userEvent.clear(input);
        userEvent.type(input, 'test');

        const btn = screen.getByRole('button', { name: 'Add webhook' });
        userEvent.click(btn);

        await waitFor(() => {
          expect(API.updateWebhook).toHaveBeenCalledTimes(1);
          expect(API.updateWebhook).toHaveBeenCalledWith(
            {
              ...mockWebhook,
              name: 'test',
            },
            undefined
          );
        });

        await waitFor(() => {
          expect(screen.getByText('An error occurred updating the webhook: message error')).toBeInTheDocument();
        });
      });

      it('without error message', async () => {
        mocked(API).updateWebhook.mockRejectedValue({ kind: ErrorKind.Other });
        const mockWebhook = getMockWebhook('7');

        const component = (
          <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
            <Router>
              <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
            </Router>
          </AppCtx.Provider>
        );
        const { rerender } = render(component);

        const input = screen.getByRole('textbox', { name: /Name/ });
        userEvent.clear(input);
        userEvent.type(input, 'test');

        const btn = screen.getByRole('button', { name: 'Add webhook' });
        userEvent.click(btn);

        await waitFor(() => {
          expect(API.updateWebhook).toHaveBeenCalledTimes(1);
          expect(API.updateWebhook).toHaveBeenCalledWith(
            {
              ...mockWebhook,
              name: 'test',
            },
            undefined
          );
        });

        rerender(component);

        expect(
          await screen.findByText('An error occurred updating the webhook, please try again later.')
        ).toBeInTheDocument();
      });
    });

    it('removes package from list to update webhook', async () => {
      mocked(API).updateWebhook.mockResolvedValue(null);
      const mockWebhook = getMockWebhook('8');
      const newPackagesList = [...mockWebhook.packages];
      newPackagesList.shift();

      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
          </Router>
        </AppCtx.Provider>
      );

      const btns = screen.getAllByRole('button', { name: 'Delete package from webhook' });
      expect(btns).toHaveLength(mockWebhook.packages.length);
      userEvent.click(btns[0]);

      const btn = screen.getByRole('button', { name: 'Add webhook' });
      userEvent.click(btn);

      await waitFor(() => {
        expect(API.updateWebhook).toHaveBeenCalledTimes(1);
        expect(API.updateWebhook).toHaveBeenCalledWith(
          {
            ...mockWebhook,
            packages: newPackagesList,
          },
          undefined
        );
      });
    });
  });

  describe('testing webhook', () => {
    it('triggers test on webhook edition', async () => {
      mocked(API).triggerWebhookTest.mockResolvedValue(null);
      const mockWebhook = getMockWebhook('9');

      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
          </Router>
        </AppCtx.Provider>
      );

      const btn = screen.getByRole('button', { name: 'Test webhook' });
      expect(btn).toBeInTheDocument();
      expect(btn).toBeEnabled();
      userEvent.click(btn);

      await waitFor(() => {
        expect(API.triggerWebhookTest).toHaveBeenCalledTimes(1);
        expect(API.triggerWebhookTest).toHaveBeenCalledWith({
          url: mockWebhook.url,
          eventKinds: mockWebhook.eventKinds,
        });
      });

      expect(screen.getByTestId('testWebhookTick')).toBeInTheDocument();
    });

    it('triggers test on webhook addition', async () => {
      mocked(API).triggerWebhookTest.mockResolvedValue(null);

      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} />
          </Router>
        </AppCtx.Provider>
      );

      const btn = screen.getByRole('button', { name: 'Test webhook' });
      expect(btn).toBeInTheDocument();
      expect(btn).toBeDisabled();

      const urlInput = screen.getByRole('textbox', { name: /Url/ });
      userEvent.type(urlInput, 'http://url.com');

      expect(btn).toBeEnabled();
      userEvent.click(btn);

      await waitFor(() => {
        expect(API.triggerWebhookTest).toHaveBeenCalledTimes(1);
        expect(API.triggerWebhookTest).toHaveBeenCalledWith({
          url: 'http://url.com',
          eventKinds: [0],
        });
      });

      expect(screen.getByTestId('testWebhookTick')).toBeInTheDocument();
    });

    it('disables test btn when webhook for testing is not valid', () => {
      const mockWebhook = getMockWebhook('10');

      render(
        <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
          <Router>
            <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
          </Router>
        </AppCtx.Provider>
      );

      const btn = screen.getByRole('button', { name: 'Test webhook' });
      expect(btn).toBeInTheDocument();
      expect(btn).toBeEnabled();

      const urlInput = screen.getByRole('textbox', { name: /Url/ });
      userEvent.clear(urlInput);
      userEvent.type(urlInput, 'wrongUrl');

      expect(btn).toBeDisabled();
    });

    describe('when fails', () => {
      it('UnauthorizedError', async () => {
        mocked(API).triggerWebhookTest.mockRejectedValue({
          kind: ErrorKind.Unauthorized,
        });
        const mockWebhook = getMockWebhook('11');

        render(
          <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
            <Router>
              <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
            </Router>
          </AppCtx.Provider>
        );

        const btn = screen.getByRole('button', { name: 'Test webhook' });
        userEvent.click(btn);

        await waitFor(() => {
          expect(API.triggerWebhookTest).toHaveBeenCalledTimes(1);
          expect(API.triggerWebhookTest).toHaveBeenCalledWith({
            url: mockWebhook.url,
            eventKinds: mockWebhook.eventKinds,
          });
        });

        expect(mockOnAuthError).toHaveBeenCalledTimes(1);
      });

      it('with custom error', async () => {
        mocked(API).triggerWebhookTest.mockRejectedValue({
          kind: ErrorKind.Other,
          message: 'custom error',
        });
        const mockWebhook = getMockWebhook('12');

        const component = (
          <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
            <Router>
              <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
            </Router>
          </AppCtx.Provider>
        );
        const { rerender } = render(component);

        const btn = screen.getByRole('button', { name: 'Test webhook' });
        userEvent.click(btn);

        await waitFor(() => {
          expect(API.triggerWebhookTest).toHaveBeenCalledTimes(1);
          expect(API.triggerWebhookTest).toHaveBeenCalledWith({
            url: mockWebhook.url,
            eventKinds: mockWebhook.eventKinds,
          });
        });

        rerender(component);

        expect(await screen.findByText('An error occurred testing the webhook: custom error')).toBeInTheDocument();
      });

      it('default error', async () => {
        mocked(API).triggerWebhookTest.mockRejectedValue({
          kind: ErrorKind.Other,
        });
        const mockWebhook = getMockWebhook('13');

        const component = (
          <AppCtx.Provider value={{ ctx: mockUserCtx, dispatch: jest.fn() }}>
            <Router>
              <WebhookForm {...defaultProps} webhook={{ ...mockWebhook, contentType: null, template: null }} />
            </Router>
          </AppCtx.Provider>
        );
        const { rerender } = render(component);

        const btn = screen.getByRole('button', { name: 'Test webhook' });
        userEvent.click(btn);

        await waitFor(() => {
          expect(API.triggerWebhookTest).toHaveBeenCalledTimes(1);
          expect(API.triggerWebhookTest).toHaveBeenCalledWith({
            url: mockWebhook.url,
            eventKinds: mockWebhook.eventKinds,
          });
        });

        rerender(component);

        // await waitFor(() => {
        expect(
          await screen.findByText('An error occurred testing the webhook, please try again later.')
        ).toBeInTheDocument();
        // });
      });
    });
  });
});
