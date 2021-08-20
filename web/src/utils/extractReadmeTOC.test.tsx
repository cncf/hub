import { transformer } from './extractReadmeTOC';

const tests = [
  { input: { children: [], type: 'root' }, output: [] },
  {
    input: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'These ',
            },
            {
              type: 'inlineCode',
              value: 'Tasks',
            },
            {
              type: 'text',
              value: ' are for copying to and from GCS buckets from Pipelines.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'These ',
            },
            {
              type: 'inlineCode',
              value: 'Tasks',
            },
            {
              type: 'text',
              value: ' do a similar job to the ',
            },
            {
              type: 'inlineCode',
              value: 'GCS',
            },
            {
              type: 'text',
              value: ' ',
            },
            {
              type: 'inlineCode',
              value: 'PipelineResource',
            },
            {
              type: 'text',
              value: ' and\nare intended as its replacement. This is part of our plan to ',
            },
            {
              type: 'text',
              value: 'offer replacement\n',
            },
            {
              type: 'inlineCode',
              value: 'Tasks',
            },
            {
              type: 'text',
              value: ' for Pipeline Resources',
            },
            {
              type: 'text',
              value: '\nas well as\n',
            },
            {
              type: 'text',
              value: 'document those replacements',
            },
            {
              type: 'text',
              value: '.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'inlineCode',
              value: 'gcs-upload',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'A ',
            },
            {
              type: 'inlineCode',
              value: 'Task',
            },
            {
              type: 'text',
              value: ' that uploads files or directories from a Workspace to a GCS bucket.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Workspaces',
            },
          ],
        },
        {
          type: 'list',
          ordered: false,
          start: null,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value:
                        'credentials: A workspace that contains a service account key as a JSON file.\nThis workspace should be populated from a Secret in your TaskRuns and PipelineRuns.',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'source: A workspace where files will be uploaded from.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Parameters',
            },
          ],
        },
        {
          type: 'list',
          ordered: false,
          start: null,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value:
                        "path: The path to files or directories relative to the source workspace that you'd like to upload. (",
                    },
                    {
                      type: 'emphasis',
                      children: [
                        {
                          type: 'text',
                          value: 'required',
                        },
                      ],
                    },
                    {
                      type: 'text',
                      value: ')',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'location: The address (including "gs://") where you\'d like to upload files to. (',
                    },
                    {
                      type: 'emphasis',
                      children: [
                        {
                          type: 'text',
                          value: 'required',
                        },
                      ],
                    },
                    {
                      type: 'text',
                      value: ')',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value:
                        'serviceAccountPath: The path to the service account credential file in your credentials workspace. (',
                    },
                    {
                      type: 'emphasis',
                      children: [
                        {
                          type: 'text',
                          value: 'default',
                        },
                      ],
                    },
                    {
                      type: 'text',
                      value: ': "service_account.json")',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Usage',
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'inlineCode',
              value: 'gcs-upload',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'This TaskRun uses the gcs-upload Task to upload a file from a ConfigMap.',
            },
          ],
        },
        {
          type: 'code',
          lang: 'yaml',
          meta: null,
          value:
            'kind: ConfigMap\napiVersion: v1\nmetadata:\n  name: test-input-data\ndata:\n  test_file.txt: "Hello, world!"\n---\napiVersion: tekton.dev/v1beta1\nkind: TaskRun\nmetadata:\n  name: upload-configmap-file-to-gcs\nspec:\n  taskRef:\n    name: gcs-upload\n  workspaces:\n  - name: credentials\n    secret:\n      secretName: my-gcs-credentials\n      defaultMode: 0400\n  - name: source\n    configMap:\n      name: test-input-data',
        },
      ],
    },
    output: [
      {
        children: [
          {
            children: [],
            depth: 3,
            value: 'Workspaces',
          },
          {
            children: [],
            depth: 3,
            value: 'Parameters',
          },
        ],
        depth: 2,
        value: 'gcs-upload',
      },
      {
        children: [
          {
            children: [],
            depth: 3,
            value: 'gcs-upload',
          },
        ],
        depth: 2,
        value: 'Usage',
      },
    ],
  },
  {
    input: {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Chart Details',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'New Relic offers a ',
            },
            {
              type: 'text',
              value: 'Fluent Bit',
            },
            {
              type: 'text',
              value: ' output ',
            },
            {
              type: 'text',
              value: 'plugin',
            },
            {
              type: 'text',
              value: ' to easily forward your logs to ',
            },
            {
              type: 'text',
              value: 'New Relic Logs',
            },
            {
              type: 'text',
              value: '. This plugin is also provided in a standalone Docker image that can be installed in a ',
            },
            {
              type: 'text',
              value: 'Kubernetes',
            },
            {
              type: 'text',
              value: ' cluster in the form of a ',
            },
            {
              type: 'text',
              value: 'DaemonSet',
            },
            {
              type: 'text',
              value: ', which we refer as the Kubernetes plugin.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'This document explains how to install it in your cluster, either using a ',
            },
            {
              type: 'text',
              value: 'Helm',
            },
            {
              type: 'text',
              value: ' chart (recommended), or manually by applying Kubernetes manifests.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Installation',
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Install using the Helm chart (recommended)',
            },
          ],
        },
        {
          type: 'list',
          ordered: true,
          start: 1,
          spread: true,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Install Helm following the ',
                    },
                    {
                      type: 'text',
                      value: 'official instructions',
                    },
                    {
                      type: 'text',
                      value: '.',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Add the New Relic official Helm chart repository following ',
                    },
                    {
                      type: 'text',
                      value: 'these instructions',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value:
                        'Run the following command to install the New Relic Logging Kubernetes plugin via Helm, replacing the placeholder value ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'YOUR_LICENSE_KEY',
                    },
                    {
                      type: 'text',
                      value: ' with your ',
                    },
                    {
                      type: 'text',
                      value: 'New Relic license key',
                    },
                    {
                      type: 'text',
                      value: ':',
                    },
                  ],
                },
                {
                  type: 'list',
                  ordered: false,
                  start: null,
                  spread: false,
                  children: [
                    {
                      type: 'listItem',
                      spread: false,
                      checked: null,
                      children: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              value: 'Helm 3',
                            },
                          ],
                        },
                        {
                          type: 'code',
                          lang: 'sh',
                          meta: null,
                          value:
                            'helm install newrelic-logging newrelic/newrelic-logging --set licenseKey=YOUR_LICENSE_KEY',
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      spread: false,
                      checked: null,
                      children: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              value: 'Helm 2',
                            },
                          ],
                        },
                        {
                          type: 'code',
                          lang: 'sh',
                          meta: null,
                          value:
                            'helm install newrelic/newrelic-logging --name newrelic-logging --set licenseKey=YOUR_LICENSE_KEY',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'blockquote',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value:
                    'For EU users, add `--set endpoint=https://log-api.eu.newrelic.com/log/v1 to any of the helm install commands above.',
                },
              ],
            },
          ],
        },
        {
          type: 'blockquote',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'By default, tailing is set to ',
                },
                {
                  type: 'inlineCode',
                  value: '/var/log/containers/*.log',
                },
                {
                  type: 'text',
                  value: '. To change this setting, provide your preferred path by adding ',
                },
                {
                  type: 'inlineCode',
                  value: '--set fluentBit.path=DESIRED_PATH',
                },
                {
                  type: 'text',
                  value: ' to any of the helm install commands above.',
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Install the Kubernetes manifests manually',
            },
          ],
        },
        {
          type: 'list',
          ordered: true,
          start: 1,
          spread: true,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Download the following 3 manifest files into your current working directory:',
                    },
                  ],
                },
                {
                  type: 'code',
                  lang: 'sh',
                  meta: null,
                  value:
                    'curl https://raw.githubusercontent.com/newrelic/helm-charts/master/charts/newrelic-logging/k8s/fluent-conf.yml > fluent-conf.yml\ncurl https://raw.githubusercontent.com/newrelic/helm-charts/master/charts/newrelic-logging/k8s/new-relic-fluent-plugin.yml > new-relic-fluent-plugin.yml\ncurl https://raw.githubusercontent.com/newrelic/helm-charts/master/charts/newrelic-logging/k8s/rbac.yml > rbac.yml',
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'In the downloaded ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'new-relic-fluent-plugin.yml',
                    },
                    {
                      type: 'text',
                      value: ' file, replace the placeholder value ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'LICENSE_KEY',
                    },
                    {
                      type: 'text',
                      value: ' with your ',
                    },
                    {
                      type: 'text',
                      value: 'New Relic license key',
                    },
                    {
                      type: 'text',
                      value: '.',
                    },
                  ],
                },
                {
                  type: 'blockquote',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          value:
                            'For EU users, replace the ENDPOINT environment variable to https://log-api.eu.newrelic.com/log/v1.',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value:
                        'Once the License key has been added, run the following command in your terminal or command-line interface:',
                    },
                  ],
                },
                {
                  type: 'code',
                  lang: 'sh',
                  meta: null,
                  value: 'kubectl apply -f .',
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: '[OPTIONAL] You can configure how the plugin parses the data by editing the ',
                    },
                    {
                      type: 'text',
                      value: 'parsers.conf section in the fluent-conf.yml file',
                    },
                    {
                      type: 'text',
                      value: ". For more information, see Fluent Bit's documentation on ",
                    },
                    {
                      type: 'text',
                      value: 'Parsers configuration',
                    },
                    {
                      type: 'text',
                      value: '.',
                    },
                  ],
                },
                {
                  type: 'blockquote',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          value: 'By default, tailing is set to ',
                        },
                        {
                          type: 'inlineCode',
                          value: '/var/log/containers/*.log',
                        },
                        {
                          type: 'text',
                          value: '. To change this setting, replace the default path with your preferred path in the ',
                        },
                        {
                          type: 'text',
                          value: 'new-relic-fluent-plugin.yml file',
                        },
                        {
                          type: 'text',
                          value: '.',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          depth: 4,
          children: [
            {
              type: 'text',
              value: 'Proxy support',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Since Fluent Bit Kubernetes plugin is using ',
            },
            {
              type: 'text',
              value: 'newrelic-fluent-bit-output',
            },
            {
              type: 'text',
              value: ' we can configure the ',
            },
            {
              type: 'text',
              value: 'proxy support',
            },
            {
              type: 'text',
              value: ' in order to set up the proxy configuration.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 5,
          children: [
            {
              type: 'text',
              value: 'As environment variables',
            },
          ],
        },
        {
          type: 'list',
          ordered: true,
          start: 1,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Complete the step 1 in ',
                    },
                    {
                      type: 'text',
                      value: 'Install the Kubernetes manifests manually',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Modify the ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'new-relic-fluent-plugin.yml',
                    },
                    {
                      type: 'text',
                      value: ' file. Add ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'HTTP_PROXY',
                    },
                    {
                      type: 'text',
                      value: ' or ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'HTTPS_PROXY',
                    },
                    {
                      type: 'text',
                      value: ' as environment variables:',
                    },
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  meta: null,
                  value:
                    '   ...\n    containers:\n      - name: newrelic-logging\n        env:\n          - name: ENDPOINT\n            value : "https://log-api.newrelic.com/log/v1"\n          - name: HTTP_PROXY\n            value : "http://http-proxy-hostname:PORT" # We must always specify the protocol (either http:// or https://)\n   ...',
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Continue to the next steps',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          depth: 5,
          children: [
            {
              type: 'text',
              value: 'Custom proxy',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'If you want to set up a custom proxy (eg. using self-signed certificate):',
            },
          ],
        },
        {
          type: 'list',
          ordered: true,
          start: 1,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Complete the step 1 in ',
                    },
                    {
                      type: 'text',
                      value: 'Install the Kubernetes manifests manually',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Modify the ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'fluent-conf.yml',
                    },
                    {
                      type: 'text',
                      value: ' and define in the ConfigMap a ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'caBundle.pem',
                    },
                    {
                      type: 'text',
                      value: ' file with the self-signed certificate:',
                    },
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  meta: null,
                  value: '...',
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Modify ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'new-relic-fluent-plugin.yml',
                    },
                    {
                      type: 'text',
                      value: ' and define the ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'CA_BUNDLE_FILE',
                    },
                    {
                      type: 'text',
                      value: ' environment variable pointing to the created ConfigMap file:',
                    },
                  ],
                },
                {
                  type: 'code',
                  lang: 'yaml',
                  meta: null,
                  value:
                    '   ...\n    containers:\n      - name: newrelic-logging\n        env:\n          - name: ENDPOINT\n            value : "https://log-api.newrelic.com/log/v1"\n          - name: CA_BUNDLE_FILE\n            value: /fluent-bit/etc/caBundle.pem\n   ...',
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Continue to the next steps',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Configuration',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'See ',
            },
            {
              type: 'text',
              value: 'values.yaml',
            },
            {
              type: 'text',
              value: ' for the default values',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                '| Parameter                                                  | Description                                                                                                                                                                                                                                                                  | Default                              |\n| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |\n| ',
            },
            {
              type: 'inlineCode',
              value: 'global.licenseKey',
            },
            {
              type: 'text',
              value: ' - ',
            },
            {
              type: 'inlineCode',
              value: 'licenseKey',
            },
            {
              type: 'text',
              value: '                         | The ',
            },
            {
              type: 'text',
              value: 'license key',
            },
            {
              type: 'text',
              value: ' for your New Relic Account. This will be the preferred configuration option if both ',
            },
            {
              type: 'inlineCode',
              value: 'licenseKey',
            },
            {
              type: 'text',
              value: ' and ',
            },
            {
              type: 'inlineCode',
              value: 'customSecret*',
            },
            {
              type: 'text',
              value: ' values are specified.                            |                                      |\n| ',
            },
            {
              type: 'inlineCode',
              value: 'global.customSecretName',
            },
            {
              type: 'text',
              value: ' - ',
            },
            {
              type: 'inlineCode',
              value: 'customSecretName',
            },
            {
              type: 'text',
              value:
                '             | Name of the Secret object where the license key is stored                                                                                                                                                                                                                    |                                      |\n| ',
            },
            {
              type: 'inlineCode',
              value: 'global.customSecretLicenseKey',
            },
            {
              type: 'text',
              value: ' - ',
            },
            {
              type: 'inlineCode',
              value: 'customSecretLicenseKey',
            },
            {
              type: 'text',
              value:
                ' | Key in the Secret object where the license key is stored.                                                                                                                                                                                                                    |                                      |\n| ',
            },
            {
              type: 'inlineCode',
              value: 'global.fargate',
            },
            {
              type: 'text',
              value: '                                           | Must be set to ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value:
                ' when deploying in an EKS Fargate environment. Prevents DaemonSet pods from being scheduled in Fargate nodes.  |                                 |\n| ',
            },
            {
              type: 'inlineCode',
              value: 'rbac.create',
            },
            {
              type: 'text',
              value:
                '                                              | Enable Role-based authentication                                                                                                                                                                                                                                             | ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: '                               |\n| ',
            },
            {
              type: 'inlineCode',
              value: 'rbac.pspEnabled',
            },
            {
              type: 'text',
              value:
                '                                          | Enable pod security policy support                                                                                                                                                                                                                                           | ',
            },
            {
              type: 'inlineCode',
              value: 'false',
            },
            {
              type: 'text',
              value: '                              |\n| ',
            },
            {
              type: 'inlineCode',
              value: 'image.repository',
            },
            {
              type: 'text',
              value:
                '                                         | The container to pull.                                                                                                                                                                                                                                                       | ',
            },
            {
              type: 'inlineCode',
              value: 'newrelic/newrelic-fluentbit-output',
            },
            {
              type: 'text',
              value: ' |\n| ',
            },
            {
              type: 'inlineCode',
              value: 'image.pullPolicy',
            },
            {
              type: 'text',
              value:
                '                                         | The pull policy.                                                                                                                                                                                                                                                             | ',
            },
            {
              type: 'inlineCode',
              value: 'IfNotPresent',
            },
            {
              type: 'text',
              value: '                       |\n| ',
            },
            {
              type: 'inlineCode',
              value: 'image.pullSecrets',
            },
            {
              type: 'text',
              value:
                '                                        | Image pull secrets.                                                                                                                                                                                                                                                          | ',
            },
            {
              type: 'inlineCode',
              value: 'nil',
            },
            {
              type: 'text',
              value: '                                |\n| ',
            },
            {
              type: 'inlineCode',
              value: 'image.tag',
            },
            {
              type: 'text',
              value:
                '                                                | The version of the container to pull.                                                                                                                                                                                                                                        | See value in [values.yaml]',
            },
            {
              type: 'inlineCode',
              value: '         |\n|',
            },
            {
              type: 'text',
              value: 'resources',
            },
            {
              type: 'inlineCode',
              value:
                '                                               | Any resources you wish to assign to the pod.                                                                                                                                                                                                                                 | See Resources below                  |\n|',
            },
            {
              type: 'text',
              value: 'priorityClassName',
            },
            {
              type: 'inlineCode',
              value:
                '                                       | Scheduling priority of the pod                                                                                                                                                                                                                                               |',
            },
            {
              type: 'text',
              value: 'nil',
            },
            {
              type: 'inlineCode',
              value: '                               |\n|',
            },
            {
              type: 'text',
              value: 'nodeSelector',
            },
            {
              type: 'inlineCode',
              value:
                '                                            | Node label to use for scheduling                                                                                                                                                                                                                                             |',
            },
            {
              type: 'text',
              value: 'nil',
            },
            {
              type: 'inlineCode',
              value: '                               |\n|',
            },
            {
              type: 'text',
              value: 'tolerations',
            },
            {
              type: 'inlineCode',
              value:
                '                                             | List of node taints to tolerate (requires Kubernetes >= 1.6)                                                                                                                                                                                                                 | See Tolerations below                |\n|',
            },
            {
              type: 'text',
              value: 'updateStrategy',
            },
            {
              type: 'inlineCode',
              value:
                '                                          | Strategy for DaemonSet updates (requires Kubernetes >= 1.6)                                                                                                                                                                                                                  |',
            },
            {
              type: 'text',
              value: 'RollingUpdate',
            },
            {
              type: 'inlineCode',
              value: '                     |\n|',
            },
            {
              type: 'text',
              value: 'serviceAccount.create',
            },
            {
              type: 'inlineCode',
              value:
                '                                   | If true, a service account would be created and assigned to the deployment                                                                                                                                                                                                   |',
            },
            {
              type: 'text',
              value: 'true',
            },
            {
              type: 'inlineCode',
              value: '                              |\n|',
            },
            {
              type: 'text',
              value: 'serviceAccount.name',
            },
            {
              type: 'inlineCode',
              value: '                                     | The service account to assign to the deployment. If',
            },
            {
              type: 'text',
              value: 'serviceAccount.create',
            },
            {
              type: 'inlineCode',
              value:
                'is true then this name will be used when creating the service account                                                                                                                            |                                      |\n|',
            },
            {
              type: 'text',
              value: 'serviceAccount.annotations',
            },
            {
              type: 'inlineCode',
              value: '  | The annotations to add to the service account if',
            },
            {
              type: 'text',
              value: 'serviceAccount.create',
            },
            {
              type: 'inlineCode',
              value:
                'is set to true.                                                                                                                                                          |                                 |\n|',
            },
            {
              type: 'text',
              value: 'global.nrStaging',
            },
            {
              type: 'inlineCode',
              value: '-',
            },
            {
              type: 'text',
              value: 'nrStaging',
            },
            {
              type: 'inlineCode',
              value:
                '                          | Send data to staging (requires a staging license key)                                                                                                                                                                                                                        |',
            },
            {
              type: 'text',
              value: 'false',
            },
            {
              type: 'inlineCode',
              value: '                             |\n|',
            },
            {
              type: 'text',
              value: 'fluentBit.criEnabled',
            },
            {
              type: 'inlineCode',
              value: '                                    | We assume that',
            },
            {
              type: 'text',
              value: 'kubelet',
            },
            {
              type: 'inlineCode',
              value: 'directly communicates with the Docker container engine. Set this to ',
            },
            {
              type: 'text',
              value: 'true',
            },
            {
              type: 'inlineCode',
              value:
                'if your K8s installation uses [CRI](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) instead, in order to get the logs properly parsed. |',
            },
            {
              type: 'text',
              value: 'false',
            },
            {
              type: 'inlineCode',
              value: '                             |\n|',
            },
            {
              type: 'text',
              value: 'fluentBit.k8sLoggingExclude',
            },
            {
              type: 'inlineCode',
              value: '                             | Set to "On" to allow excluding pods by adding the annotation',
            },
            {
              type: 'text',
              value: 'fluentbit.io/exclude: "true"',
            },
            {
              type: 'inlineCode',
              value:
                'to pods you wish to exclude.                                                                                                                                                     |',
            },
            {
              type: 'text',
              value: 'Off',
            },
            {
              type: 'inlineCode',
              value: '                               |\n|',
            },
            {
              type: 'text',
              value: 'fluentBit.additionalEnvVariables',
            },
            {
              type: 'inlineCode',
              value:
                '                        | Additional environmental variables for fluentbit pods                                                                                                                                                                                                                        |',
            },
            {
              type: 'text',
              value: '[]]',
            },
            {
              type: 'inlineCode',
              value: '                               |\n|',
            },
            {
              type: 'text',
              value: 'daemonSet.annotations',
            },
            {
              type: 'inlineCode',
              value: '  | The annotations to add to the',
            },
            {
              type: 'text',
              value: 'DaemonSet`.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Uninstall the Kubernetes plugin',
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Uninstall via Helm (recommended)',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Run the following command:',
            },
          ],
        },
        {
          type: 'code',
          lang: 'sh',
          meta: null,
          value: 'helm uninstall newrelic-logging',
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Uninstall the Kubernetes manifests manually',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'Run the following command in the directory where you downloaded the Kubernetes manifests during the installation procedure:',
            },
          ],
        },
        {
          type: 'code',
          lang: 'sh',
          meta: null,
          value: 'kubectl delete -f .',
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Resources',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'The default set of resources assigned to the pods is shown below:',
            },
          ],
        },
        {
          type: 'code',
          lang: 'yaml',
          meta: null,
          value:
            'resources:\n  limits:\n    cpu: 500m\n    memory: 128Mi\n  requests:\n    cpu: 250m\n    memory: 64Mi',
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Tolerations',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'The default set of tolerations assigned to our daemonset is shown below:',
            },
          ],
        },
        {
          type: 'code',
          lang: 'yaml',
          meta: null,
          value:
            'tolerations:\n  - operator: "Exists"\n    effect: "NoSchedule"\n  - operator: "Exists"\n    effect: "NoExecute"',
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Troubleshooting',
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'I am receiving "Invalid pattern for given tag"',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'If you are receiving the following error:',
            },
          ],
        },
        {
          type: 'code',
          lang: 'sh',
          meta: null,
          value: '[ warn] [filter_kube] invalid pattern for given tag',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'In the ',
            },
            {
              type: 'text',
              value: 'new-relic-fluent-plugin.yml file',
            },
            {
              type: 'text',
              value: ', replace the default code ',
            },
            {
              type: 'inlineCode',
              value: '/var/log/containers/*.log',
            },
            {
              type: 'text',
              value: ' with the following:',
            },
          ],
        },
        {
          type: 'code',
          lang: 'sh',
          meta: null,
          value: '/var/log/containers/*.{log}',
        },
      ],
    },
    output: [
      {
        children: [],
        depth: 2,
        value: 'Chart Details',
      },
      {
        children: [
          {
            children: [],
            depth: 3,
            value: 'Install using the Helm chart (recommended)',
          },
          {
            children: [
              {
                children: [
                  {
                    children: [],
                    depth: 5,
                    value: 'As environment variables',
                  },
                  {
                    children: [],
                    depth: 5,
                    value: 'Custom proxy',
                  },
                ],
                depth: 4,
                value: 'Proxy support',
              },
            ],
            depth: 3,
            value: 'Install the Kubernetes manifests manually',
          },
        ],
        depth: 2,
        value: 'Installation',
      },
      {
        children: [],
        depth: 2,
        value: 'Configuration',
      },
      {
        children: [
          {
            children: [],
            depth: 3,
            value: 'Uninstall via Helm (recommended)',
          },
          {
            children: [],
            depth: 3,
            value: 'Uninstall the Kubernetes manifests manually',
          },
        ],
        depth: 2,
        value: 'Uninstall the Kubernetes plugin',
      },
      {
        children: [],
        depth: 2,
        value: 'Resources',
      },
      {
        children: [],
        depth: 2,
        value: 'Tolerations',
      },
      {
        children: [
          {
            children: [],
            depth: 3,
            value: 'I am receiving "Invalid pattern for given tag"',
          },
        ],
        depth: 2,
        value: 'Troubleshooting',
      },
    ],
  },
  {
    input: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Artifact Hub',
            },
            {
              type: 'text',
              value:
                ' is a web-based application that enables finding, installing, and publishing Kubernetes packages.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Introduction',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'This chart bootstraps an Artifact Hub deployment on a ',
            },
            {
              type: 'text',
              value: 'Kubernetes',
            },
            {
              type: 'text',
              value: ' cluster using the ',
            },
            {
              type: 'text',
              value: 'Helm',
            },
            {
              type: 'text',
              value: ' package manager.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Installing the Chart',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'Security note: please review carefully all the configuration options available before deploying Artifact Hub in a production environment. The default values are just intended to provide users with a quick and easy way to try the software.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'To install the chart with the release name ',
            },
            {
              type: 'inlineCode',
              value: 'hub',
            },
            {
              type: 'text',
              value: ' run:',
            },
          ],
        },
        {
          type: 'code',
          lang: 'bash',
          meta: null,
          value:
            '$ helm repo add artifact-hub https://artifacthub.github.io/helm-charts\n$ helm install hub artifact-hub/artifact-hub',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'The command deploys Artifact Hub on the Kubernetes cluster using the default configuration. The ',
            },
            {
              type: 'text',
              value: 'configuration',
            },
            {
              type: 'text',
              value: ' section lists the parameters that can be configured during installation.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'As soon as all pods are up and running, you can access the Artifact Hub by visiting the address specified in your Ingress object in your browser (',
            },
            {
              type: 'inlineCode',
              value: 'http://192.168.64.18',
            },
            {
              type: 'text',
              value: ' in the case shown below).',
            },
          ],
        },
        {
          type: 'code',
          lang: 'bash',
          meta: null,
          value:
            '$ kubectl get ingress\nNAME   HOSTS   ADDRESS         PORTS   AGE\nhub    *       192.168.64.18   80      6s',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'When the parameter ',
            },
            {
              type: 'inlineCode',
              value: 'dbMigrator.loadSampleData',
            },
            {
              type: 'text',
              value:
                ' is set to true (default) a demo user and a couple of sample repositories are registered automatically. The credentials for the demo user are: ',
            },
            {
              type: 'inlineCode',
              value: 'demo@artifacthub.io',
            },
            {
              type: 'text',
              value: ' / ',
            },
            {
              type: 'inlineCode',
              value: 'changeme',
            },
            {
              type: 'text',
              value: '. You can change the password from the control panel once you log in.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Populating packages',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'The chart installs one ',
            },
            {
              type: 'inlineCode',
              value: 'cronjob',
            },
            {
              type: 'text',
              value:
                ' in charge of launching periodically (every 30m) the tracker, which indexes packages from the registered repositories. Some sample repositories are added by default when ',
            },
            {
              type: 'inlineCode',
              value: 'dbMigrator.loadSampleData',
            },
            {
              type: 'text',
              value:
                " is set to true. If you don't want to wait until the job is triggered by the cronjob, you can create one manually using the following command:",
            },
          ],
        },
        {
          type: 'code',
          lang: 'bash',
          meta: null,
          value: '$ kubectl create job initial-tracker-job --from=cronjob/tracker',
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Packages security reports',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'The chart installs another ',
            },
            {
              type: 'inlineCode',
              value: 'cronjob',
            },
            {
              type: 'text',
              value:
                " in charge of launching periodically (every hour) the scanner, which scans packages' images for security vulnerabilities, generating security reports for them. If you don't want to wait until the job is triggered by the cronjob, you can create one manually using the following command:",
            },
          ],
        },
        {
          type: 'code',
          lang: 'bash',
          meta: null,
          value: '$ kubectl create job initial-scanner-job --from=cronjob/scanner',
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Uninstalling the Chart',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'To uninstall the ',
            },
            {
              type: 'inlineCode',
              value: 'hub',
            },
            {
              type: 'text',
              value: ' deployment run:',
            },
          ],
        },
        {
          type: 'code',
          lang: 'bash',
          meta: null,
          value: '$ helm uninstall hub',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'The command removes all the Kubernetes components associated with the chart and deletes the release.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Configuration',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Please see the ',
            },
            {
              type: 'text',
              value: 'values schema reference documentation in Artifact Hub',
            },
            {
              type: 'text',
              value: ' for a list of the configurable parameters of the chart and their default values.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Specify each parameter using the ',
            },
            {
              type: 'inlineCode',
              value: '--set key=value[,key=value]',
            },
            {
              type: 'text',
              value: ' argument to ',
            },
            {
              type: 'inlineCode',
              value: 'helm install',
            },
            {
              type: 'text',
              value: '. For example,',
            },
          ],
        },
        {
          type: 'code',
          lang: 'bash',
          meta: null,
          value: '$ helm install hub \\\n  --set dbMigrator.loadSampleData=false \\\n  artifact-hub/artifact-hub',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,',
            },
          ],
        },
        {
          type: 'code',
          lang: 'bash',
          meta: null,
          value: '$ helm install hub -f values.yaml artifact-hub/artifact-hub',
        },
      ],
    },
    output: [
      {
        children: [],
        depth: 2,
        value: 'Introduction',
      },
      {
        children: [],
        depth: 2,
        value: 'Installing the Chart',
      },
      {
        children: [],
        depth: 2,
        value: 'Populating packages',
      },
      {
        children: [],
        depth: 2,
        value: 'Packages security reports',
      },
      {
        children: [],
        depth: 2,
        value: 'Uninstalling the Chart',
      },
      {
        children: [],
        depth: 2,
        value: 'Configuration',
      },
    ],
  },
  {
    input: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'emphasis',
              children: [
                {
                  type: 'text',
                  value: 'Short video of logging into Kubernetes and using kubectl using Active Directory',
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'Orchestra Login Portal provides a login portal for Kubernetes that allows you to authenticate with your Active Directory credentials, use Active Directory groups for RBAC authorizations and provides integration for both ',
            },
            {
              type: 'inlineCode',
              value: 'kubectl',
            },
            {
              type: 'text',
              value:
                ' and the Kubernetes Dashboard (https://github.com/kubernetes/dashboard).  The portal runs inside of Kubernetes, leveraging Kubernetes for scalability, secret management and deployment.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "When a user accesses Kubernetes using Orchestra, they'll access both the login portal and the dashboard through OpenUnison (instead of directly via an ingress).  OpenUnison will inject the user's identity into each request, allowing the dashboard to act on their behalf.  The login portal has no external dependencies outside of Active Directory and Kubernetes.  All objects for session state are stored as CRDs.",
            },
          ],
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Deployment',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Watch a Video',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'This 11 minute video shows the entire deployment and user onboarding process',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'What You Need To Start',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Prior to deploying Orchestra you will need:',
            },
          ],
        },
        {
          type: 'list',
          ordered: true,
          start: 1,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Kubernetes 1.10 or higher',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value:
                        'The Nginx Ingress Controller deployed (https://kubernetes.github.io/ingress-nginx/deploy/)',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'The certificate authority certificate for your Active Directory forest',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Deploy the dashboard to your cluster',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'helm 3.0+',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'The deployment is a four step process:',
            },
          ],
        },
        {
          type: 'list',
          ordered: true,
          start: 1,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: "Add Tremolo Security's Helm repo to your own",
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Deploy the OpenUnison Operator',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Create a secret for your Active Directory password',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Deploy OpenUnison',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: "Add Tremolo Security's Helm Repo",
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value: 'helm repo add tremolo https://nexus.tremolo.io/repository/helm/\nhelm repo update',
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Deploy The OpenUnison Operator',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Create your namespace',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value: 'kubectl create ns openunison',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Deploy the operator',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value: 'helm install openunison tremolo/openunison-operator --namespace openunison',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Wait for the operator pod to be available',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value: 'watch kubectl get pods -n openunison',
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Create A Secret For Your Active Directory Password',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Create a secret in the ',
            },
            {
              type: 'inlineCode',
              value: 'openunison',
            },
            {
              type: 'text',
              value: ' namespace:',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value:
            'apiVersion: v1\ntype: Opaque\nmetadata:\n  name: orchestra-secrets-source\n  namespace: openunison\ndata:\n  AD_BIND_PASSWORD: aW0gYSBzZWNyZXQ=\n  K8S_DB_SECRET: aW0gYSBzZWNyZXQ=\n  unisonKeystorePassword: aW0gYSBzZWNyZXQ=\nkind: Secret',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "| Property | Description |\n| -------- | ----------- |\n| AD_BIND_PASSWORD | The password for the ldap service account used to communicate with Active Directory/LDAP |\n| unisonKeystorePassword | The password for OpenUnison's keystore, should NOT contain an ampersand (",
            },
            {
              type: 'inlineCode',
              value: '&',
            },
            {
              type: 'text',
              value:
                ') |\n| K8S_DB_SECRET | A random string of characters used to secure the SSO process with the dashboard.  This should be long and random, with no ampersands (',
            },
            {
              type: 'inlineCode',
              value: '&',
            },
            {
              type: 'text',
              value: ') |',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Deploy OpenUnison',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Copy ',
            },
            {
              type: 'inlineCode',
              value: 'values.yaml',
            },
            {
              type: 'text',
              value:
                ' (https://raw.githubusercontent.com/OpenUnison/helm-charts/master/openunison-k8s-login-activedirectory/values.yaml) and update as appropriate:',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "| Property | Description |\n| -------- | ----------- |\n| network.openunison_host | The host name for OpenUnison.  This is what user's will put into their browser to login to Kubernetes |\n| network.dashboard_host | The host name for the dashboard.  This is what users will put into the browser to access to the dashboard. NOTE: ",
            },
            {
              type: 'inlineCode',
              value: 'network.openunison_host',
            },
            {
              type: 'text',
              value: ' and ',
            },
            {
              type: 'inlineCode',
              value: 'network.dashboard_host',
            },
            {
              type: 'text',
              value: ' Both ',
            },
            {
              type: 'inlineCode',
              value: 'network.openunison_host',
            },
            {
              type: 'text',
              value: ' and ',
            },
            {
              type: 'inlineCode',
              value: 'network.dashboard_host',
            },
            {
              type: 'text',
              value:
                ' MUST point to OpenUnison |\n| network.api_server_host | The host name to use for the api server reverse proxy.  This is what ',
            },
            {
              type: 'inlineCode',
              value: 'kubectl',
            },
            {
              type: 'text',
              value: ' will interact with to access your cluster. NOTE: ',
            },
            {
              type: 'inlineCode',
              value: 'network.openunison_host',
            },
            {
              type: 'text',
              value: ' and ',
            },
            {
              type: 'inlineCode',
              value: 'network.dashboard_host',
            },
            {
              type: 'text',
              value:
                " |\n| network.k8s_url | The URL for the Kubernetes API server |\n| network.session_inactivity_timeout_seconds | The number of seconds of inactivity before the session is terminated, also the length of the refresh token's session |\n| network.createIngressCertificate | If true (default), the operator will create a self signed Ingress certificate.  Set to false if using an existing certificate or LetsEncrypt |\n| network.force_redirect_to_tls | If ",
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ', all traffic that reaches OpenUnison over http will be redirected to https.  Defaults to ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: '.  Set to ',
            },
            {
              type: 'inlineCode',
              value: 'false',
            },
            {
              type: 'text',
              value:
                ' when using an external TLS termination point, such as an istio sidecar proxy |\n| network.ingress_type | The type of ',
            },
            {
              type: 'inlineCode',
              value: 'Ingress',
            },
            {
              type: 'text',
              value: ' object to create.  ',
            },
            {
              type: 'inlineCode',
              value: 'nginx',
            },
            {
              type: 'text',
              value: ' and ',
            },
            {
              type: 'text',
              value: 'istio',
            },
            {
              type: 'text',
              value: ' is supported |\n| network.ingress_annotations | Annotations to add to the ',
            },
            {
              type: 'inlineCode',
              value: 'Ingress',
            },
            {
              type: 'text',
              value: ' object |\n| network.ingress_certificate | The certificate that the ',
            },
            {
              type: 'inlineCode',
              value: 'Ingress',
            },
            {
              type: 'text',
              value: ' object should reference |\n| network.istio.selectors | Labels that the istio ',
            },
            {
              type: 'inlineCode',
              value: 'Gateway',
            },
            {
              type: 'text',
              value: ' object will be applied to.  Default is ',
            },
            {
              type: 'inlineCode',
              value: 'istio: ingressgateway',
            },
            {
              type: 'text',
              value:
                ' |\n| active_directory.base | The search base for Active Directory |\n| active_directory.host | The host name for a domain controller or VIP.  If using SRV records to determine hosts, this should be the fully qualified domain name of the domain |\n| active_directory.port | The port to communicate with Active Directory |\n| active_directory.bind_dn | The full distinguished name (DN) of a read-only service account for working with Active Directory |\n| active_directory.con_type | ',
            },
            {
              type: 'inlineCode',
              value: 'ldaps',
            },
            {
              type: 'text',
              value: ' for secure, ',
            },
            {
              type: 'inlineCode',
              value: 'ldap',
            },
            {
              type: 'text',
              value: ' for plain text |\n| active_directory.srv_dns | If ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value:
                ", OpenUnison will lookup domain controllers by the domain's SRV DNS record |\n| cert_template.ou | The ",
            },
            {
              type: 'inlineCode',
              value: 'OU',
            },
            {
              type: 'text',
              value: ' attribute for the forward facing certificate |\n| cert_template.o | The ',
            },
            {
              type: 'inlineCode',
              value: 'O',
            },
            {
              type: 'text',
              value: ' attribute for the forward facing certificate |\n| cert_template.l | The ',
            },
            {
              type: 'inlineCode',
              value: 'L',
            },
            {
              type: 'text',
              value: ' attribute for the forward facing certificate |\n| cert_template.st | The ',
            },
            {
              type: 'inlineCode',
              value: 'ST',
            },
            {
              type: 'text',
              value: ' attribute for the forward facing certificate |\n| cert_template.c | The ',
            },
            {
              type: 'inlineCode',
              value: 'C',
            },
            {
              type: 'text',
              value:
                " attribute for the forward facing certificate |\n| certs.use_k8s_cm  | Tells the deployment system if you should use k8s' built in certificate manager.  If your distribution doesn't support this (such as Canonical and Rancher), set this to false |\n| myvd_config_path | The path to the MyVD configuration file, unless being customized, use ",
            },
            {
              type: 'inlineCode',
              value: 'WEB-INF/myvd.conf',
            },
            {
              type: 'text',
              value: ' |\n| dashboard.namespace | The namespace for the dashboard.  For the 1.x dashboard this is ',
            },
            {
              type: 'inlineCode',
              value: 'kube-system',
            },
            {
              type: 'text',
              value: ', for the 2.x dashboard this is ',
            },
            {
              type: 'inlineCode',
              value: 'kubernetes-dashboard',
            },
            {
              type: 'text',
              value:
                " |\n| dashboard.cert_name | The name of the secret in the dashboard's namespace that stores the certificate for the dashboard |\n| dashboard.label | The label of the dashboard pod, this is used to delete the pod once new certificates are generated |\n| dashboard.service_name | The name of the service object for the dashboard |\n| k8s_cluster_name | The name of the cluster to use in the ",
            },
            {
              type: 'inlineCode',
              value: './kube-config',
            },
            {
              type: 'text',
              value: '.  Defaults to ',
            },
            {
              type: 'inlineCode',
              value: 'kubernetes',
            },
            {
              type: 'text',
              value: ' |\n| image | The name of the image to use |\n| enable_impersonation | If ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value:
                ', OpenUnison will run in impersonation mode.  Instead of OpenUnison being integrated with Kubernetes via OIDC, OpenUnison will be a reverse proxy and impersonate users.  This is useful with cloud deployments where oidc is not an option |\n| monitoring.prometheus_service_account | The prometheus service account to authorize access to the /monitoring endpoint |\n| network_policies.enabled | If ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value:
                ', creates a deny-all network policy and additional policies based on below configurations |\n| network_policies.ingress.enabled | if ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ', a policy will be created that allows access from the ',
            },
            {
              type: 'inlineCode',
              value: 'Namespace',
            },
            {
              type: 'text',
              value: ' identified by the ',
            },
            {
              type: 'inlineCode',
              value: 'labels',
            },
            {
              type: 'text',
              value: ' |\n| network_policies.ingress.labels | Labels for the ',
            },
            {
              type: 'inlineCode',
              value: 'Namespace',
            },
            {
              type: 'text',
              value: ' hosting the ',
            },
            {
              type: 'inlineCode',
              value: 'Ingress',
            },
            {
              type: 'text',
              value: ' |\n| network_policies.monitoring.enabled | if ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ', a policy will be created that allows access from the ',
            },
            {
              type: 'inlineCode',
              value: 'Namespace',
            },
            {
              type: 'text',
              value: ' identified by the ',
            },
            {
              type: 'inlineCode',
              value: 'labels',
            },
            {
              type: 'text',
              value: ' to support monitoring |\n| network_policies.monitoring.labels | Labels for the ',
            },
            {
              type: 'inlineCode',
              value: 'Namespace',
            },
            {
              type: 'text',
              value: ' hosting monitoring |\n| network_policies.apiserver.enabled | if ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ', a policy will be created that allows access from the ',
            },
            {
              type: 'inlineCode',
              value: 'kube-ns',
            },
            {
              type: 'text',
              value: ' ',
            },
            {
              type: 'inlineCode',
              value: 'Namespace',
            },
            {
              type: 'text',
              value: ' identified by the ',
            },
            {
              type: 'inlineCode',
              value: 'labels',
            },
            {
              type: 'text',
              value: ' |\n| network_policies.apiserver.labels | Labels for the ',
            },
            {
              type: 'inlineCode',
              value: 'Namespace',
            },
            {
              type: 'text',
              value: ' hosting the api server |\n| services.enable_tokenrequest | If ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ', the OpenUnison ',
            },
            {
              type: 'inlineCode',
              value: 'Deployment',
            },
            {
              type: 'text',
              value: ' will use the ',
            },
            {
              type: 'inlineCode',
              value: 'TokenRequest',
            },
            {
              type: 'text',
              value: ' API instead of static ',
            },
            {
              type: 'inlineCode',
              value: 'ServiceAccount',
            },
            {
              type: 'text',
              value:
                ' tokens.  * NOT AVAILABLE UNTIL OPENUNISON 1.0.21 * |\n| services.token_request_audience | The audience expected by the API server * NOT AVAILABLE UNTIL OPENUNISON 1.0.21 * |\n| services.token_request_expiration_seconds | The number of seconds TokenRequest tokens should be valid for, minimum 600 seconds * NOT AVAILABLE UNTIL OPENUNISON 1.0.21 * |\n| services.node_selectors | annotations to use when choosing nodes to run OpenUnison, maps to the ',
            },
            {
              type: 'inlineCode',
              value: 'Deployment',
            },
            {
              type: 'text',
              value: ' ',
            },
            {
              type: 'inlineCode',
              value: 'nodeSelector',
            },
            {
              type: 'text',
              value: ' |\n| services.pullSecret | The name of the ',
            },
            {
              type: 'inlineCode',
              value: 'Secret',
            },
            {
              type: 'text',
              value:
                ' that stores the pull secret for pulling the OpenUnison image |\n| services.resources.requests.memory | Memory requested by OpenUnison |\n| services.resources.requests.cpu | CPU requested by OpenUnison |\n| services.resources.limits.memory | Maximum memory allocated to OpenUnison |\n| services.resources.limits.cpu | Maximum CPU allocated to OpenUnison |\n| openunison.replicas | The number of OpenUnison replicas to run, defaults to 1 |\n| openunison.non_secret_data | Add additional non-secret configuration options, added to the ',
            },
            {
              type: 'inlineCode',
              value: 'non_secret_data',
            },
            {
              type: 'text',
              value: ' secrtion of the ',
            },
            {
              type: 'inlineCode',
              value: 'OpenUnison',
            },
            {
              type: 'text',
              value: ' object |\n| openunison.secrets | Add additional keys from the ',
            },
            {
              type: 'inlineCode',
              value: 'orchestra-secrets-source',
            },
            {
              type: 'text',
              value: ' ',
            },
            {
              type: 'inlineCode',
              value: 'Secret',
            },
            {
              type: 'text',
              value: ' |\n| impersonation.use_jetstack | if ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value:
                ", the operator will deploy an instance of JetStack's OIDC Proxy (https://github.com/jetstack/kube-oidc-proxy).  Default is ",
            },
            {
              type: 'inlineCode',
              value: 'false',
            },
            {
              type: 'text',
              value:
                ' |\n| impersonation.jetstack_oidc_proxy_image | The name of the image to use |\n| impersonation.explicit_certificate_trust | If ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ', oidc-proxy will explicitly trust the ',
            },
            {
              type: 'inlineCode',
              value: 'tls.crt',
            },
            {
              type: 'text',
              value: ' key of the ',
            },
            {
              type: 'inlineCode',
              value: 'Secret',
            },
            {
              type: 'text',
              value: ' named in ',
            },
            {
              type: 'inlineCode',
              value: 'impersonation.ca_secret_name',
            },
            {
              type: 'text',
              value: '.  Defaults to ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ' |\n| impersonation.ca_secret_name | If ',
            },
            {
              type: 'inlineCode',
              value: 'impersonation.explicit_certificate_trust',
            },
            {
              type: 'text',
              value: ' is ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ', the name of the tls ',
            },
            {
              type: 'inlineCode',
              value: 'Secret',
            },
            {
              type: 'text',
              value: ' that stores the certificate for OpenUnison that the oidc proxy needs to trust.  Defaults to ',
            },
            {
              type: 'inlineCode',
              value: 'ou-tls-secret',
            },
            {
              type: 'text',
              value:
                ' |\n| impersonation.resources.requests.memory | Memory requested by oidc proxy |\n| impersonation.resources.requests.cpu | CPU requested by oidc proxy |\n| impersonation.resources.limits.memory | Maximum memory allocated to oidc proxy |\n| impersonation.resources.limits.cpu | Maximum CPU allocated to oidc proxy |\n| myvd_configmap | The name of a ',
            },
            {
              type: 'inlineCode',
              value: 'ConfigMap',
            },
            {
              type: 'text',
              value: ' with a key called ',
            },
            {
              type: 'inlineCode',
              value: 'myvd.conf',
            },
            {
              type: 'text',
              value: ' that will override the MyVD configuration |',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Additionally, add a base 64 encoded PEM certificate to your values under ',
            },
            {
              type: 'inlineCode',
              value: 'trusted_certs',
            },
            {
              type: 'text',
              value: ' for ',
            },
            {
              type: 'inlineCode',
              value: 'pem_b64',
            },
            {
              type: 'text',
              value: '.  This will allow OpenUnison to talk to Active Directory using TLS.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Finally, run the helm chart:',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'inlineCode',
              value:
                'helm install orchestra tremolo/openunison-k8s-login-activedirectory --namespace openunison -f /path/to/values.yaml',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Complete SSO Integration with Kubernetes',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'If using impersonation, you can skip this section.  Run ',
            },
            {
              type: 'inlineCode',
              value: 'kubectl describe configmap api-server-config -n openunison',
            },
            {
              type: 'text',
              value:
                ' to get the SSO integration artifacts.  The output will give you both the API server flags that need to be configured on your API servers.  The certificate that needs to be trusted is in the ',
            },
            {
              type: 'inlineCode',
              value: 'ou-tls-certificate',
            },
            {
              type: 'text',
              value: ' secret in the ',
            },
            {
              type: 'inlineCode',
              value: 'openunison',
            },
            {
              type: 'text',
              value: ' namespace.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'First Login',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'To login, open your browser and go to the host you specified for ',
            },
            {
              type: 'inlineCode',
              value: 'network.openunison_host',
            },
            {
              type: 'text',
              value: ' in your ',
            },
            {
              type: 'inlineCode',
              value: 'values.yaml',
            },
            {
              type: 'text',
              value: '.  For instance if ',
            },
            {
              type: 'inlineCode',
              value: 'network.openunison_host',
            },
            {
              type: 'text',
              value: ' is ',
            },
            {
              type: 'inlineCode',
              value: 'k8sou.tremolo.lan',
            },
            {
              type: 'text',
              value:
                " then navigate to https://k8sou.tremolo.lan.  You'll be prompted for your Active Directory username and password.  Once authenticated you'll be able login to the portal and generate your ",
            },
            {
              type: 'inlineCode',
              value: '.kube/config',
            },
            {
              type: 'text',
              value: ' from the Tokens screen.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'CLI Login',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'You can bypass manually launching a browser with the ',
            },
            {
              type: 'inlineCode',
              value: 'oulogin',
            },
            {
              type: 'text',
              value:
                ' kubectl plugin - https://github.com/TremoloSecurity/kubectl-login.  This plugin will launch a browser for you, authenticate you then configure your kubectl configuration without any pre-configuration on your clients.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Enabling JetStack OIDC Proxy for Impersonation',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "OpenUnison's built in reverse proxy doesn't support the SPDY protocol which kubectl, and the client-go sdk, uses for ",
            },
            {
              type: 'inlineCode',
              value: 'exec',
            },
            {
              type: 'text',
              value: ', ',
            },
            {
              type: 'inlineCode',
              value: 'cp',
            },
            {
              type: 'text',
              value: ', and ',
            },
            {
              type: 'inlineCode',
              value: 'port-forward',
            },
            {
              type: 'text',
              value:
                ".  If you require these options, and are using impersonation, you can now enable the JetStack OIDC proxy (https://github.com/jetstack/kube-oidc-proxy) instead of using OpenUnison's built in reverse proxy.  To enable it, add the ",
            },
            {
              type: 'inlineCode',
              value: 'impersonation',
            },
            {
              type: 'text',
              value: ' options from the helm chart configuration to your chart.  NOTE when using the oidc-proxy ',
            },
            {
              type: 'inlineCode',
              value: 'services.enable_tokenrequest',
            },
            {
              type: 'text',
              value: ' must be ',
            },
            {
              type: 'inlineCode',
              value: 'false',
            },
            {
              type: 'text',
              value: '.  The ',
            },
            {
              type: 'inlineCode',
              value: 'Deployment',
            },
            {
              type: 'text',
              value: ' created for the oidc proxy will inherrit the ',
            },
            {
              type: 'inlineCode',
              value: 'ServiceAccount',
            },
            {
              type: 'text',
              value: ' from OpenUnison, as well as the ',
            },
            {
              type: 'inlineCode',
              value: 'services.pullSecret',
            },
            {
              type: 'text',
              value: ' and ',
            },
            {
              type: 'inlineCode',
              value: 'services.node_selectors',
            },
            {
              type: 'text',
              value:
                ' configuration in your helm chart.  Resource requests and limits should be set specifically for the OIDC proxy under the ',
            },
            {
              type: 'inlineCode',
              value: 'impersonation',
            },
            {
              type: 'text',
              value:
                " section.  The proxy is run as a non-privileged unix user as well.  An example configuration when deploying with Let's Encrypt:",
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value:
            'impersonation:\n  use_jetstack: true\n  jetstack_oidc_proxy_image: quay.io/jetstack/kube-oidc-proxy:v0.3.0\n  explicit_certificate_trust: false',
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Authorizing Access via RBAC',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "On first login, if you haven't authorized access to any Kubernetes roles you won't be able to do anything.  There are two approaches you can take:",
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Group Driven Membership',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "If you can populate groups in Active Directory for Kubernetes, you can use those groups for authorization via OpenUnison.  OpenUnison will provide all of a user's groups via the ",
            },
            {
              type: 'inlineCode',
              value: 'id_token',
            },
            {
              type: 'text',
              value: ' supplied to Kubernetes.  The ',
            },
            {
              type: 'inlineCode',
              value: 'groups',
            },
            {
              type: 'text',
              value:
                " claim is a list of values, in this case the Distinguished Names of the user's groups.  As an example, I created a group in AD called ",
            },
            {
              type: 'inlineCode',
              value: 'k8s_login_ckuster_admins',
            },
            {
              type: 'text',
              value: ' in the ',
            },
            {
              type: 'inlineCode',
              value: 'Users',
            },
            {
              type: 'text',
              value: ' container of my ',
            },
            {
              type: 'inlineCode',
              value: 'ent2k12.domain.com',
            },
            {
              type: 'text',
              value: ' domain.  This means the group will be ',
            },
            {
              type: 'inlineCode',
              value: 'CN=k8s_login_ckuster_admins,CN=Users,DC=ent2k12,DC=domain,DC=com',
            },
            {
              type: 'text',
              value: ' (you can get the exact name of the group from the ',
            },
            {
              type: 'inlineCode',
              value: 'distinguishedName',
            },
            {
              type: 'text',
              value:
                ' attribute of the group in Active Directory).  To authorize members of this group to be cluster administrators, we create a ',
            },
            {
              type: 'inlineCode',
              value: 'ClusterRoleBinding',
            },
            {
              type: 'text',
              value: ':',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value:
            'kind: ClusterRoleBinding\napiVersion: rbac.authorization.k8s.io/v1\nmetadata:\n  name: activedirectory-cluster-admins\nsubjects:\n- kind: Group\n  name: CN=k8s_login_ckuster_admins,CN=Users,DC=ent2k12,DC=domain,DC=com\nroleRef:\n  kind: ClusterRole\n  name: cluster-admin\n  apiGroup: rbac.authorization.k8s.io',
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'User Driven Membership',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'If you are not able to create groups in Active Directory, you can directly add users to role bindings.  Kubernetes requires that you identify openid connect users with the prefix of the url of the identity provider.  So if your ',
            },
            {
              type: 'inlineCode',
              value: 'OU_HOST',
            },
            {
              type: 'text',
              value: ' is ',
            },
            {
              type: 'inlineCode',
              value: 'k8sou.tremolo.lan',
            },
            {
              type: 'text',
              value: " and your user's login is ",
            },
            {
              type: 'inlineCode',
              value: 'mmosley',
            },
            {
              type: 'text',
              value: ' your username to Kubernetes would be ',
            },
            {
              type: 'inlineCode',
              value: 'https://k8sou.tremolo.lan/auth/idp/k8sIdp#mmosley',
            },
            {
              type: 'text',
              value: '.  To create a cluster role binding to give cluster-admin access to a specific user:',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value:
            'kind: ClusterRoleBinding\napiVersion: rbac.authorization.k8s.io/v1\nmetadata:\n  name: activedirectory-cluster-admins\nsubjects:\n- kind: User\n  name: https://k8sou.tremolo.lan/auth/idp/k8sIdp#mmosley\nroleRef:\n  kind: ClusterRole\n  name: cluster-admin\n  apiGroup: rbac.authorization.k8s.io',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'emphasis',
              children: [
                {
                  type: 'text',
                  value: 'NOTE',
                },
              ],
            },
            {
              type: 'text',
              value: ': There are multiple reasons this is a bad idea:',
            },
          ],
        },
        {
          type: 'list',
          ordered: true,
          start: 1,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Hard to audit - There is no easy way to say "what role bindings is ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'mmosley',
                    },
                    {
                      type: 'text',
                      value: ' a member of?',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value:
                        'Difficult to remove access - Same reason as #1, you need to figure out every role binding a user is a member of to remove',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: "Easy to get wrong - If you mistype a user's login id Kubernetes won't tell you",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "If you can't use Active Directory groups, take a look at the OpenUnison Identity Manager for Kubernetes - https://github.com/TremoloSecurity/openunison-qs-kubernetes/tree/activedirectory.  This tool adds on to the login capabilities with the ability to manage access to the cluster and namespaces, along with providing a self service way for users to request new namespaces and manage access.",
            },
          ],
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Adding Applications and Clusters for Authentication',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'OpenUnison can support more applications for SSO then just Kubernetes and the dashboard.  You can add other clusters and applications that support OpenID Connect by adding some custom resources to your ',
            },
            {
              type: 'inlineCode',
              value: 'openunison',
            },
            {
              type: 'text',
              value: ' namespace.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Add a Trust',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'The ',
            },
            {
              type: 'inlineCode',
              value: 'Trust',
            },
            {
              type: 'text',
              value:
                " tells your OpenID Connect enabled application it can trust authentication requests from your OpenUnison.  To start you'll need:",
            },
          ],
        },
        {
          type: 'list',
          ordered: true,
          start: 1,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Callback URL - This URL is where OpenUnison redirects the user after authenticating.',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value:
                        "Client Secret - Web applications, like GitLab, will need a secret that is shared between the two systems.  Applications with CLI components, like ArgoCD, don't need a client secret.",
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Client ID - This is how you identify your application to OpenUnison.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'OpenUnison will provide the following claims for your application to consume:',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "| Claim | Description |\n| ----- | ----------- |\n| sub   | Unique identifier as supplied from authentication |\n| name  | Combination of first name and last name |\n| preferred_username | A username supplied from authentication |\n| email | The user's email address |\n| groups | The list of groups provided by the authentication source |",
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Once you have everything you need to get started, create the ',
            },
            {
              type: 'inlineCode',
              value: 'Trust',
            },
            {
              type: 'text',
              value: ' object.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Create a Secret',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: "If you're application is using a client secret, a ",
            },
            {
              type: 'inlineCode',
              value: 'Secret',
            },
            {
              type: 'text',
              value: ' needs to be created to hold it.  This can either be a new ',
            },
            {
              type: 'inlineCode',
              value: 'Secret',
            },
            {
              type: 'text',
              value: ' or it can be a new one.  Which ever ',
            },
            {
              type: 'inlineCode',
              value: 'Secret',
            },
            {
              type: 'text',
              value: ' you add it to, keep a note of the name of the ',
            },
            {
              type: 'inlineCode',
              value: 'Secret',
            },
            {
              type: 'text',
              value: ' and the key in the ',
            },
            {
              type: 'inlineCode',
              value: 'data',
            },
            {
              type: 'text',
              value: ' section used to store it.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: "If your application doesn't have a client secret, skip this step.",
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Create the ',
            },
            {
              type: 'inlineCode',
              value: 'Trust',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Create a ',
            },
            {
              type: 'inlineCode',
              value: 'Trust',
            },
            {
              type: 'text',
              value: ' object in the ',
            },
            {
              type: 'inlineCode',
              value: 'openunison',
            },
            {
              type: 'text',
              value: " namespace.  Here's one for GitLab you can use as an example:",
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value:
            'apiVersion: openunison.tremolo.io/v1\nkind: Trust\nmetadata:\n  name: gitlab\n  namespace: openunison\nspec:\n  accessTokenSkewMillis: 120000\n  accessTokenTimeToLive: 60000\n  authChainName: LoginService\n  clientId: gitlab\n  clientSecret:\n    keyName: gitlab\n    secretName: orchestra-secrets-source\n  codeLastMileKeyName: lastmile-oidc\n  codeTokenSkewMilis: 60000\n  publicEndpoint: false\n  redirectURI:\n  - https://gitlab.local.tremolo.dev/users/auth/openid_connect/callback\n  signedUserInfo: false\n  verifyRedirect: true',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Here are the details for each option:',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                '| Option | Desription |\n| ------ | ---------- |\n| accessTokenSkewMillis | Milliseconds milliseconds added to account for clock skew |\n| accessTokenTimeToLive | Time an access token should live in milliseconds |\n| authChainName | The authentication chain to use for login, do not change |\n| clientId | The client id shared by your application |\n| clientSecret.scretName | If using a client secret, the name of the ',
            },
            {
              type: 'inlineCode',
              value: 'Secret',
            },
            {
              type: 'text',
              value: ' storing the client secret |\n| clientSecret.keyName | The key in the ',
            },
            {
              type: 'inlineCode',
              value: 'data',
            },
            {
              type: 'text',
              value: ' section of the ',
            },
            {
              type: 'inlineCode',
              value: 'Secret',
            },
            {
              type: 'text',
              value:
                ' storing the client secret |\n| codeLastMileKeyName | The name of the key used to encrypt the code token, do not change |\n| codeTokenSkewMilis | Milliseconds to add to code token lifetime to account for clock skew |\n| publicEndpoint | If ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ', a client secret is required.  If ',
            },
            {
              type: 'inlineCode',
              value: 'false',
            },
            {
              type: 'text',
              value:
                ", no client secret is needed |\n| redirectURI | List of URLs that are authorized for callback.  If a URL is provided by your application that isn't in this list SSO will fail |\n| signedUserInfo | if ",
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ', the userinfo endpoint will return a signed JSON Web Token.  If ',
            },
            {
              type: 'inlineCode',
              value: 'false',
            },
            {
              type: 'text',
              value: ' it will return plain JSON |\n| verifyRedirect | If ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ', the redirect URL provided by the client MUST be listed in the ',
            },
            {
              type: 'inlineCode',
              value: 'redirectURI',
            },
            {
              type: 'text',
              value: ' section.  Should ALLWAYS be ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value: ' if not in a development environment |',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Once the ',
            },
            {
              type: 'inlineCode',
              value: 'Trust',
            },
            {
              type: 'text',
              value:
                ' is added to the namespace, OpenUnison will pick it up automatically.  You can test by trying to login to your application.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Add a "Badge" to Your Portal',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "When you login to the Orchestra portal, there are badges for your tokens and for the dashboard.  You can dynamically add a badge for your application too.  Here's an example ",
            },
            {
              type: 'inlineCode',
              value: 'PortalUrl',
            },
            {
              type: 'text',
              value: ' object for ArgoCD:',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value:
            'apiVersion: openunison.tremolo.io/v1\nkind: PortalUrl\nmetadata:\n  name: argocs\n  namespace: openunison\nspec:\n  label: ArgoCD\n  org: B158BD40-0C1B-11E3-8FFD-0800200C9A66\n  url: https://ArgoCD.apps.192-168-2-140.nip.io\n  icon: iVBORw0KGgoAAAANSUhEUgAAANIAAADwCAYAAAB1/Tp/AAAfQ3pUWHRSYXcgcHJvZ...\n  azRules:\n  - constraint: o=Tremolo\n    scope: dn',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                '| Option | Descriptoin |\n| ------ | ----------- |\n| label  | The label shown on badge in the portal |\n| org    | If using orgnaizations to organize badges, the uuid of the org.  If not using organizations, leave as is |\n| url    | The URL the badge should send the user to |\n| icon   | A base64 encoded icon with a width of 210 pixels and a height of 240 pixels |\n| azRules | Who is authorized to see this badge?  See https://portal.apps.tremolo.io/docs/tremolosecurity-docs/1.0.19/openunison/openunison-manual.html#_applications_applications for an explination of the authorization rules |',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Once created, the badge will appear in the Orchestra portal!  No need to restart the containers.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 2,
          children: [
            {
              type: 'text',
              value: 'Organizing Badges',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "If you're adding multiple badges or clusters, you may find that the number of badges on your front page become difficult to manage.  In that case you can enable orgnaizations in OpenUnison and organize your badges using an orgnaization tree.",
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Enable Organizations on your Portal Page',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Edit the ',
            },
            {
              type: 'inlineCode',
              value: 'orchestra',
            },
            {
              type: 'text',
              value: ' object in the ',
            },
            {
              type: 'inlineCode',
              value: 'openunison',
            },
            {
              type: 'text',
              value: ' namespace (',
            },
            {
              type: 'inlineCode',
              value: 'kubectl edit openunison orchestra -n openunison',
            },
            {
              type: 'text',
              value: ').  Look for the ',
            },
            {
              type: 'inlineCode',
              value: 'non_secret_data',
            },
            {
              type: 'text',
              value: ' section and add the following:',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value: '- name: SHOW_PORTAL_ORGS\n  value: "true"',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'Once you save, OpenUnison will restart and when you login there will now be a tree that describes your organizations.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Creating Organizations',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Add an ',
            },
            {
              type: 'inlineCode',
              value: 'Org',
            },
            {
              type: 'text',
              value: ' object to the ',
            },
            {
              type: 'inlineCode',
              value: 'openunison',
            },
            {
              type: 'text',
              value: " namespace.  Here's an example ",
            },
            {
              type: 'inlineCode',
              value: 'Org',
            },
            {
              type: 'text',
              value: ':',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value:
            'apiVersion: openunison.tremolo.io/v1\nkind: Org\nmetadata:\n  name: cluster2\n  namespace: openunison\nspec:\n  description: "My second cluster"\n  uuid: 04901973-5f4c-46d9-9e22-55e88e168776\n  parent: B158BD40-0C1B-11E3-8FFD-0800200C9A66\n  showInPortal: true\n  showInRequestAccess: false\n  showInReports: false\n  azRules:\n  - scope: dn\n    constraint: o=Tremolo',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                '| Option | Description |\n| ------ | ----------- |\n| description | What appears in the blue box describing the organization |\n| uuid | A unique ID, recommend using Type 4 UUIDs |\n| parent | The unique id of the parent.  ',
            },
            {
              type: 'inlineCode',
              value: 'B158BD40-0C1B-11E3-8FFD-0800200C9A66',
            },
            {
              type: 'text',
              value: ' is the root organization |\n| showInPortal | Should be ',
            },
            {
              type: 'inlineCode',
              value: 'true',
            },
            {
              type: 'text',
              value:
                ' |\n| showInRequestAccess | N/A |\n| showInReports | N/A |\n| azRules | Who is authorized to see this badge?  See https://portal.apps.tremolo.io/docs/tremolosecurity-docs/1.0.19/openunison/openunison-manual.html#_applications_applications for an explination of the authorization rules |',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Once added, the new organizations will be loaded dynamiclly by OpenUnison.  Change the ',
            },
            {
              type: 'inlineCode',
              value: 'org',
            },
            {
              type: 'text',
              value: ' in your ',
            },
            {
              type: 'inlineCode',
              value: 'PortalUrl',
            },
            {
              type: 'text',
              value: ' object to match the ',
            },
            {
              type: 'inlineCode',
              value: 'uuid',
            },
            {
              type: 'text',
              value: ' of the ',
            },
            {
              type: 'inlineCode',
              value: 'Org',
            },
            {
              type: 'text',
              value: ' you want it to appear in.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Using Your Own Certificates',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'If you want to integrate your own certificates see our wiki entry - https://github.com/TremoloSecurity/OpenUnison/wiki/troubleshooting#how-do-i-change-openunisons-certificates',
            },
          ],
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Monitoring OpenUnison',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'This deployment comes with a ',
            },
            {
              type: 'inlineCode',
              value: '/metrics',
            },
            {
              type: 'text',
              value:
                ' endpoint for monitoring.  For details on how to integrate it into a Prometheus stack - https://github.com/TremoloSecurity/OpenUnison/wiki/troubleshooting#how-do-i-monitor-openunison-with-prometheus.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Trouble Shooting Help',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "Please take a look at https://github.com/TremoloSecurity/OpenUnison/wiki/troubleshooting if you're running into issues.  If there isn't an entry there that takes care of your issue, please open an issue on this repo.",
            },
          ],
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Whats next?',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "Now you can begin mapping OpenUnison's capabilities to your business and compliance needs.  For instance you can add multi-factor authentication with TOTP or U2F, Create privileged workflows for onboarding, scheduled workflows that will deprovision users, etc.",
            },
          ],
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Customizing Directory Connections',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                "If you're running multiple directories, or need to connect to a generic LDAP directory isntead of Active Directory you can provide a custom MyVirtualDirectory configuration file without a re-build of your containers.  Start with the myvd.conf file at https://github.com/OpenUnison/openunison-k8s-login-activedirectory/blob/master/src/main/webapp/WEB-INF/myvd.conf.  ONLY edit the section that begins with ",
            },
            {
              type: 'inlineCode',
              value: 'server.activedirectory',
            },
            {
              type: 'text',
              value: '.  As an example, the below configuration works against a generic LDAPv3 directory with the ',
            },
            {
              type: 'inlineCode',
              value: 'VirtualMemberOf',
            },
            {
              type: 'text',
              value: ' insert configured to create a ',
            },
            {
              type: 'inlineCode',
              value: 'memeberOf',
            },
            {
              type: 'text',
              value: ' attribute on users so we can supply groups to Kubernetes:',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value:
            '#Global AuthMechConfig\nserver.globalChain=accesslog\n\nserver.globalChain.accesslog.className=com.tremolosecurity.proxy.myvd.log.AccessLog\n\nserver.nameSpaces=rootdse,myvdroot,shadowUsers,activedirectory\nserver.rootdse.chain=dse\nserver.rootdse.nameSpace=\nserver.rootdse.weight=0\nserver.rootdse.dse.className=net.sourceforge.myvd.inserts.RootDSE\nserver.rootdse.dse.config.namingContexts=o=Tremolo\nserver.myvdroot.chain=root\nserver.myvdroot.nameSpace=o=Tremolo\nserver.myvdroot.weight=0\nserver.myvdroot.root.className=net.sourceforge.myvd.inserts.RootObject\n\nserver.shadowUsers.chain=debug,mapping,api\nserver.shadowUsers.nameSpace=ou=shadow,o=Tremolo\nserver.shadowUsers.weight=0\nserver.shadowUsers.enabled=true\nserver.shadowUsers.debug.className=net.sourceforge.myvd.inserts.DumpTransaction\nserver.shadowUsers.debug.config.logLevel=info\nserver.shadowUsers.debug.config.label=k8s\nserver.shadowUsers.mapping.className=net.sourceforge.myvd.inserts.mapping.AttributeMapper\nserver.shadowUsers.mapping.config.mapping=mail=email,givenName=first_name,sn=last_name\nserver.shadowUsers.api.className=com.tremolosecurity.myvd.K8sCrdInsert\nserver.shadowUsers.api.config.nameSpace=openunison\nserver.shadowUsers.api.config.k8sTargetName=k8s\n\nserver.activedirectory.chain=objectguid2text,dnmapper,memberof,objmap,membertrans,ldap\nserver.activedirectory.nameSpace=ou=activedirectory,o=Data\nserver.activedirectory.weight=0\nserver.activedirectory.enabled=true\nserver.activedirectory.objectguid2text.className=com.tremolosecurity.proxy.myvd.inserts.util.UUIDtoText\nserver.activedirectory.objectguid2text.config.attributeName=objectGUID\nserver.activedirectory.dnmapper.className=net.sourceforge.myvd.inserts.mapping.DNAttributeMapper\nserver.activedirectory.dnmapper.config.dnAttribs=member,owner,member,distinguishedName,manager\nserver.activedirectory.dnmapper.config.localBase=ou=activedirectory,o=Data\nserver.activedirectory.dnmapper.config.urlAttribs=\nserver.activedirectory.dnmapper.config.remoteBase=#[AD_BASE_DN]\nserver.activedirectory.memberof.className=net.sourceforge.myvd.inserts.mapping.VirtualMemberOf\nserver.activedirectory.memberof.config.searchBase=ou=activedirectory,o=Data\nserver.activedirectory.memberof.config.applyToObjectClass=inetOrgPerson\nserver.activedirectory.memberof.config.attributeName=memberOf\nserver.activedirectory.memberof.config.searchObjectClass=groupOfNames\nserver.activedirectory.memberof.config.searchAttribute=member\nserver.activedirectory.memberof.config.replace=false\nserver.activedirectory.objmap.className=net.sourceforge.myvd.inserts.mapping.AttributeValueMapper\nserver.activedirectory.objmap.config.mapping=objectClass.inetOrgPerson=inetOrgPerson,objectClass.groupofnames=groupOfNames\nserver.activedirectory.membertrans.className=net.sourceforge.myvd.inserts.mapping.AttributeMapper\nserver.activedirectory.membertrans.config.mapping=member=member,uid=uid\nserver.activedirectory.ldap.className=com.tremolosecurity.proxy.myvd.inserts.ad.ADLdapInsert\nserver.activedirectory.ldap.config.host=#[AD_HOST]\nserver.activedirectory.ldap.config.port=#[AD_PORT]\nserver.activedirectory.ldap.config.remoteBase=#[AD_BASE_DN]\nserver.activedirectory.ldap.config.proxyDN=#[AD_BIND_DN]\nserver.activedirectory.ldap.config.proxyPass=#[AD_BIND_PASSWORD]\nserver.activedirectory.ldap.config.useSrvDNS=#[SRV_DNS]\nserver.activedirectory.ldap.config.ignoreRefs=true\nserver.activedirectory.ldap.config.passBindOnly=true\nserver.activedirectory.ldap.config.maxIdle=90000\nserver.activedirectory.ldap.config.maxMillis=90000\nserver.activedirectory.ldap.config.maxStaleTimeMillis=90000\nserver.activedirectory.ldap.config.minimumConnections=10\nserver.activedirectory.ldap.config.maximumConnections=10\nserver.activedirectory.ldap.config.usePaging=false\nserver.activedirectory.ldap.config.pageSize=0\nserver.activedirectory.ldap.config.heartbeatIntervalMillis=60000\nserver.activedirectory.ldap.config.type=#[AD_CON_TYPE]\nserver.activedirectory.ldap.config.sslSocketFactory=com.tremolosecurity.proxy.ssl.TremoloSSLSocketFactory',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Create a directory with your ',
            },
            {
              type: 'inlineCode',
              value: 'myvd.conf',
            },
            {
              type: 'text',
              value: ' file in it and deploy it as a ',
            },
            {
              type: 'inlineCode',
              value: 'ConfigMap',
            },
            {
              type: 'text',
              value: ':',
            },
          ],
        },
        {
          type: 'code',
          lang: null,
          meta: null,
          value: 'kubectl create configmap myvd --from-file . -n openunison',
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Finally, set ',
            },
            {
              type: 'inlineCode',
              value: 'myvd_configmap',
            },
            {
              type: 'text',
              value: ' to the name of your ',
            },
            {
              type: 'inlineCode',
              value: 'ConfigMap',
            },
            {
              type: 'text',
              value: ' in your ',
            },
            {
              type: 'inlineCode',
              value: 'values.yaml',
            },
            {
              type: 'text',
              value: ' and update your helm deployment.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Updating Secrets and Certificates',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'To update any of the secrets in the source secret:',
            },
          ],
        },
        {
          type: 'list',
          ordered: true,
          start: 1,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Update the ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'orchestra-secrets-source',
                    },
                    {
                      type: 'text',
                      value: ' secret in the ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'openunison',
                    },
                    {
                      type: 'text',
                      value: ' namespace as appropriate',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Add an annotation (or edit an existing one) on the ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'orchestra',
                    },
                    {
                      type: 'text',
                      value: ' ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'openunison',
                    },
                    {
                      type: 'text',
                      value: ' object in the ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'openunison',
                    },
                    {
                      type: 'text',
                      value: ' namespace',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'This will trigger the operator to update your OpenUnison pods.  To update certificates or non-secret data, just update it in the ',
            },
            {
              type: 'inlineCode',
              value: 'orchestra',
            },
            {
              type: 'text',
              value: ' ',
            },
            {
              type: 'inlineCode',
              value: 'openunison',
            },
            {
              type: 'text',
              value: ' object.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Customizing Orchestra',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'To customize Orchestra - https://github.com/TremoloSecurity/OpenUnison/wiki/troubleshooting#customizing-orchestra',
            },
          ],
        },
        {
          type: 'heading',
          depth: 1,
          children: [
            {
              type: 'text',
              value: 'Example Implementations',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'Amazon EKS - https://www.tremolosecurity.com/post/multi-tenant-amazon-eks-the-easy-way-part-i-authentication\nMulti-Cluster Portal - https://www.tremolosecurity.com/post/building-a-multi-cluster-authentication-portal',
            },
          ],
        },
      ],
    },
    output: [
      {
        children: [
          {
            children: [],
            depth: 2,
            value: 'Watch a Video',
          },
          {
            children: [],
            depth: 2,
            value: 'What You Need To Start',
          },
          {
            children: [],
            depth: 2,
            value: "Add Tremolo Security's Helm Repo",
          },
          {
            children: [],
            depth: 2,
            value: 'Deploy The OpenUnison Operator',
          },
          {
            children: [],
            depth: 2,
            value: 'Create A Secret For Your Active Directory Password',
          },
          {
            children: [],
            depth: 2,
            value: 'Deploy OpenUnison',
          },
          {
            children: [],
            depth: 2,
            value: 'Complete SSO Integration with Kubernetes',
          },
          {
            children: [],
            depth: 2,
            value: 'First Login',
          },
          {
            children: [],
            depth: 2,
            value: 'CLI Login',
          },
          {
            children: [],
            depth: 2,
            value: 'Enabling JetStack OIDC Proxy for Impersonation',
          },
          {
            children: [
              {
                children: [],
                depth: 3,
                value: 'Group Driven Membership',
              },
              {
                children: [],
                depth: 3,
                value: 'User Driven Membership',
              },
            ],
            depth: 2,
            value: 'Authorizing Access via RBAC',
          },
        ],
        depth: 1,
        value: 'Deployment',
      },
      {
        children: [
          {
            children: [
              {
                children: [],
                depth: 3,
                value: 'Create a Secret',
              },
              {
                children: [],
                depth: 3,
                value: 'Create the Trust',
              },
            ],
            depth: 2,
            value: 'Add a Trust',
          },
          {
            children: [],
            depth: 2,
            value: 'Add a "Badge" to Your Portal',
          },
          {
            children: [
              {
                children: [],
                depth: 3,
                value: 'Enable Organizations on your Portal Page',
              },
              {
                children: [],
                depth: 3,
                value: 'Creating Organizations',
              },
            ],
            depth: 2,
            value: 'Organizing Badges',
          },
        ],
        depth: 1,
        value: 'Adding Applications and Clusters for Authentication',
      },
      {
        children: [],
        depth: 1,
        value: 'Using Your Own Certificates',
      },
      {
        children: [],
        depth: 1,
        value: 'Monitoring OpenUnison',
      },
      {
        children: [],
        depth: 1,
        value: 'Trouble Shooting Help',
      },
      {
        children: [],
        depth: 1,
        value: 'Whats next?',
      },
      {
        children: [],
        depth: 1,
        value: 'Customizing Directory Connections',
      },
      {
        children: [],
        depth: 1,
        value: 'Updating Secrets and Certificates',
      },
      {
        children: [],
        depth: 1,
        value: 'Customizing Orchestra',
      },
      {
        children: [],
        depth: 1,
        value: 'Example Implementations',
      },
    ],
  },
  {
    input: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'The Hedvig Distributed Storage Platform is a software-defined, scale-out storage solution. It distributes data simultaneously across multiple locations – from on-premises data centers to the cloud – and scales capacity on-demand by leveraging the storage of commodity x86/ARM servers. The distributed write maximizes availability and protects data from hardware failures ranging from a single disk to an entire site, improving disaster recovery planning.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'Hedvig provides a CSI Driver for accelerating your journey into the container ecosystem. CSI Driver enables containerized applications to maintain state by dynamically provisioning and consuming Hedvig virtual disks as persistent volumes.',
            },
          ],
        },
        {
          type: 'heading',
          depth: 3,
          children: [],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value:
                'Hedvig Operator deploys the Hedvig Storage Proxy and the Hedvig CSI Driver to manage the life cycle of persistent storage in Kubernetes and Openshift.',
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Supported Container Orchestrators:',
            },
          ],
        },
        {
          type: 'list',
          ordered: false,
          start: null,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Kubernetes 1.13 to 1.20',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Red Hat OpenShift 4.1 to 4.7',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Supported Hedvig Releases:',
            },
          ],
        },
        {
          type: 'list',
          ordered: false,
          start: null,
          spread: false,
          children: [
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Hedvig 4.0',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Hedvig 4.1',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Hedvig 4.2',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              spread: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Hedvig 4.3',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Please refer to the ',
            },
            {
              type: 'text',
              value: 'documentation',
            },
            {
              type: 'text',
              value: ' for steps to install and use the operator.',
            },
          ],
        },
      ],
    },
    output: [],
  },
  {
    input: {
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 2,
          children: [],
        },
        {
          type: 'heading',
          depth: 3,
          children: [
            {
              type: 'text',
              value: 'Title',
            },
          ],
        },
      ],
    },
    output: [
      {
        children: [],
        depth: 3,
        value: 'Title',
      },
    ],
  },
];

describe('extractReadmeTOC', () => {
  for (let i = 0; i < tests.length; i++) {
    it('returns proper entries list', () => {
      const actual = transformer(tests[i].input);
      expect(actual).toEqual(tests[i].output);
    });
  }
});
