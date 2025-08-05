import React from 'react'
import { useAuthState, useClient } from '@based/react'
import { AuthPage } from '@based/ui'

export const Auth = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthState()
  const client = useClient()
  console.log('wawa')
  client.on('connect', () => {
    console.log('connected')
  })

  if (token) {
    return children
  }

  return (
    <div
      style={{
        height: '100svh',
      }}
    >
      <div
        onClick={async () => {
          console.log('calling')
          console.log(client)
          console.log(
            await client.call('based:auth-email', {
              type: 'passwordReset',
              appName: 'test',
              email: 'nuno@saulx.com',
              callToAction: 'https://once.net',
            }),
          )
        }}
      >
        wawa
      </div>
      <AuthPage
        type="email-password"
        title="Template CMS"
        onSubmit={async ({ email, password }) => {
          await client.call('login', {
            email,
            password,
          })
        }}
      />
    </div>
  )
}
