import client, { type BasedClient } from '@based/client'
import { docs } from '@based/docs'
import basedConfig from '../../based.js'

export const based: BasedClient = client(basedConfig)
const rootElement = document.getElementById('root')!

docs.render({
  rootElement,
  based,
  debug: false,
  languages: {
    default: 'en',
    languages: {
      en: {
        appName: 'based/template',
        home: {
          title: 'Based template',
          description: 'An example app for the Based platform',
          CTA: 'Get Started',
          alt: '',
        },
        theme: {
          tooltip: {
            light: 'Switch to light mode',
            dark: 'Switch to dark mode',
          },
        },
        navbar: {
          sections: {
            components: 'Components',
            colors: 'Colors',
            typography: 'Typography',
          },
        },
        sidebar: {
          searchInput: {
            placeholder: 'Find anything...',
          },
          prioritizedGroups: ['Based'],
        },
        content: {
          header: {
            buttons: {
              openFile: {
                label: 'Open file',
                icon: 'code-on',
              },
            },
          },
          blocks: {
            loading: 'Loading...',
            loadingError: 'Error loading the preview.',
            components: {
              tabs: {
                preview: 'Preview',
                code: 'Code',
              },
            },
            icons: {
              copy: {
                button: {
                  copy: 'Copy',
                  copied: 'Copied',
                },
                tooltip: {
                  code: 'Copy code',
                },
              },
              fullscreen: {
                tooltip: {
                  on: 'Full screen',
                  off: 'Exit full screen',
                },
              },
            },
          },
          about: 'About',
          install: 'Install',
          importTitle: 'Import',
          api: {
            title: 'Api Reference',
            description: 'How to use the component.',
            table: {
              name: 'Name',
              type: 'Type',
              default: 'Default',
              description: 'Description',
              required: 'Required',
            },
          },
        },
      },
    },
  },
})
