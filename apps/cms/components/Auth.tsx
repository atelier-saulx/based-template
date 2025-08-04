import React from 'react'
import { useAuthState, useClient } from '@based/react'
import { AuthPage } from '@based/ui'

export const Auth = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthState()
  const client = useClient()

  if (token) {
    return children
  }

  return (
    <div
      style={{
        height: '100svh',
      }}
    >
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
