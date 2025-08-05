import React from 'react'
import client, { type BasedClient } from '@based/client'
import { Provider as BasedClientProvider } from '@based/react'
import { createRoot } from 'react-dom/client'
import { Cms, useBasedSchema } from '@based/ui'

import basedConfig from '../../based'
import { Auth } from './components/Auth'
import { Connections } from './components/Connections'

// FIX: Revert back of make dynamic
// export const based: BasedClient = client(basedConfig)

export const based: BasedClient = client({
  cluster: 'local',
  org: 'saulx',
  project: 'template',
  env: 'production',
  discoveryUrls: ['http://localhost:25006'],
})

// TODO:
// - add custom page to show how to escape CMS component
// - add topbar and scrollbar to frontend app
// - show some data on the frontend app, use a query
// - add pages folder to frontend app
// - add routing in the frontend app
// - add SSR (later)

const App = () => {
  const { data: schema } = useBasedSchema()
  return (
    <Cms client={based} base="/cms" name="Based Template CMS">
      <Cms.Tab name="Content">
        {Object.keys(schema?.types ?? {}).map((type) => {
          return (
            <Cms.Finder
              section={type.charAt(0).toUpperCase() + type.slice(1)}
              type={type}
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
    </Cms>
  )
}

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)
root.render(
  <BasedClientProvider client={based}>
    {/* <App /> */}
    <Auth>
      <App />
    </Auth>
  </BasedClientProvider>,
)
