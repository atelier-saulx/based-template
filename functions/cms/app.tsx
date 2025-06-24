import client, { type BasedClient } from '@based/client'
import { Provider as BasedClientProvider } from '@based/react'
import { createRoot } from 'react-dom/client'
import { Cms } from '@based/ui'

import basedConfig from '../../based'

export const based: BasedClient = client(basedConfig)

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
    <App />
  </BasedClientProvider>,
)
