import React from 'react'
import client, { type BasedClient } from '@based/client'
import {
  Provider as BasedClientProvider,
  useAuthState,
  useClient,
} from '@based/react'
import { createRoot } from 'react-dom/client'
import { AuthPage, Cms } from '@based/ui'

import basedConfig from '../../based'

// export const based: BasedClient = client(basedConfig)
export const based: BasedClient = client({
  cluster: 'local',
  org: 'saulx',
  project: 'based-template',
  env: 'production',
  discoveryUrls: ['http://192.168.100.134:25006'],
})

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthState()
  const client = useClient()

  if (token) {
    return children
  }

  return (
    <AuthPage
      title="Based Template"
      onSubmit={async (email, code) => {
        await client.call('login', {
          email,
          displayCode: code,
          origin: location.origin,
        })
      }}
    />
  )
}

const App = () => {
  return (
    <Cms client={based} base="/cms" name="Based Template CMS">
      <Cms.Finder section="Users" type="user" />
      <Cms.Finder section="Contestants" type="contestant" />
      <Cms.Finder section="Votes" type="vote" />
    </Cms>
  )
}

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)
root.render(
  <BasedClientProvider client={based}>
    <Auth>
      <App />
    </Auth>
  </BasedClientProvider>,
)
