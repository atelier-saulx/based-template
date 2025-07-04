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
import { styled } from 'inlines'

const App = () => {
  return (
    <styled.div
      style={{
        background: '#131313',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Logo />
      <Voting />
    </styled.div>
  )
}

root.render(
  <BasedClientProvider client={based}>
    <App />
  </BasedClientProvider>,
)
