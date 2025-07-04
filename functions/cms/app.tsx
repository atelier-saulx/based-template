import client, { type BasedClient } from '@based/client'
import { Provider as BasedClientProvider } from '@based/react'
import { createRoot } from 'react-dom/client'
import { Cms, useBasedSchema } from '@based/ui'

import basedConfig from '../../based'

export const based: BasedClient = client(basedConfig)

const App = () => {
  const { data: schema } = useBasedSchema()
  return (
    <Cms client={based} base="/cms" name="Based Template CMS">
      {Object.keys(schema?.types ?? {}).map((type) => {
        return (
          <Cms.Finder
            section={type.charAt(0).toUpperCase() + type.slice(1)}
            type={type}
            key={type}
          />
        )
      })}
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
