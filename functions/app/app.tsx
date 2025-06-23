import client, { type BasedClient } from '@based/client'
import { Provider as BasedClientProvider } from '@based/react'
import { createRoot } from 'react-dom/client'
import { Counter } from './components/Counter'
import { Greetings } from './components/Greetings'
import { Logo } from './components/Logo'
import basedConfig from '../../based'
export const based: BasedClient = client(basedConfig)
const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

const App = () => {
  return (
    <div>
      <Logo />
      <Counter />
      <Greetings />
    </div>
  )
}

root.render(
  <BasedClientProvider client={based}>
    <App />
  </BasedClientProvider>,
)
