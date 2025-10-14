import client, { type BasedClient } from '@based/client'
import { Provider as BasedClientProvider } from '@based/react'
import { createRoot } from 'react-dom/client'
import {
  AccountSettings,
  BasedUiProvider,
  Cms,
  useBasedSchema,
} from '@based/ui'

import basedConfig from '../../based'
import { Auth } from './components/Auth'
import { Connections } from './components/Connections'

export const based: BasedClient = client(basedConfig)

// TODO:
// - add custom page to show how to escape CMS component
// - add topbar and scrollbar to frontend app
// - show some data on the frontend app, use a query
// - add pages folder to frontend app
// - add routing in the frontend app
// - add SSR (later)

const appName = 'Based Template CMS'

const App = () => {
  const { data: schema } = useBasedSchema()
  return (
    <Cms.Body name={appName} hideWorkspaceSettings followMe={false}>
      <Cms.Auth mode="email-password" appName={appName} loginEndpoint="login" />
      <Cms.Tab name="Content">
        {Object.keys(schema?.types ?? {}).map((type) => {
          return (
            <Cms.Finder
              section={type.charAt(0).toUpperCase() + type.slice(1)}
              schemaType={type}
              key={type}
            />
          )
        })}
      </Cms.Tab>
      <Cms.Tab name="Custom">
        <Cms.Section section="Connections">
          <Connections />
        </Cms.Section>
      </Cms.Tab>
      <Cms.Tab hidden name="Account Settings" icon="user-setting">
        <Cms.Section section="account-settings">
          <AccountSettings />
        </Cms.Section>
      </Cms.Tab>
    </Cms.Body>
  )
}

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)
root.render(
  <BasedUiProvider client={based}>
    <Cms.Provider base="/cms">
      <App />
    </Cms.Provider>
  </BasedUiProvider>,
)
