import React from 'react'
import { Contestants } from './pages/Contestants'
import { Landing } from './pages/Landing'
import { createRoot } from 'react-dom/client'
import { Provider as BasedClientProvider } from '@based/react'
import { Route, Switch } from 'wouter'
import { styled } from 'inlines'
import basedConfig from '../../based'
import client, { type BasedClient } from '@based/client'
import './index.css'

export const based: BasedClient = client(basedConfig)

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

const App = () => {
  return (
    <styled.div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/vote" component={Landing} />
        <Route path="/contestant-cards" component={Contestants} />
      </Switch>
    </styled.div>
  )
}

root.render(
  <BasedClientProvider client={based}>
    <App />
  </BasedClientProvider>,
)
