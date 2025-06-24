import client, { type BasedClient } from '@based/client'
import { Provider as BasedClientProvider } from '@based/react'
import { createRoot } from 'react-dom/client'
import { Logo } from './components/Logo'
import { Voting } from './components/Voting'
import basedConfig from '../../based'
export const based: BasedClient = client(basedConfig)
const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)
import './index.css'

const App = () => {
  return (
    <div>
      <Logo />
      <Voting />
    </div>
  )
}

root.render(
  <BasedClientProvider client={based}>
    <App />
  </BasedClientProvider>,
)
