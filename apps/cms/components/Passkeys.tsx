import { useClient } from '@based/sdk'
import { useToast } from '@based/ui'
import { useEffect } from 'react'

const toArrayBuffer = (value: string | number): ArrayBuffer => {
  const str = typeof value === 'number' ? String(value) : value
  const bytes = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i)
  }
  return bytes.buffer
}

const base64urlToArrayBuffer = (base64url: string): ArrayBuffer => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '=',
  )
  const binary = atob(padded)
  return toArrayBuffer(binary)
}

const arrayBufferToBase64url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export const Passkeys = () => {
  const client = useClient()
  const toast = useToast()

  useEffect(() => {
    console.log('running passkeys test')
  }, [])
  return (
    <div
      onClick={async () => {
        if (window.PublicKeyCredential) {
          try {
            console.log('getting config')
            const config = await client.call('passkeys-register')

            console.log({ config })
            config.user.id = toArrayBuffer(config.user.id)
            config.challenge = base64urlToArrayBuffer(config.challenge)
            const credential = (await navigator.credentials.create({
              publicKey: config,
            })) as PublicKeyCredential | null
            console.log({ credential })
            const response =
              credential?.response as AuthenticatorAttestationResponse
            if (!credential?.response) throw new Error('No credential response')

            const res = await client.call('passkeys-register-verify', {
              id: credential?.id,
              rawId: arrayBufferToBase64url(credential.rawId),
              type: credential.type,
              attestationObject: arrayBufferToBase64url(
                response.attestationObject,
              ),
              clientDataJSON: arrayBufferToBase64url(response.clientDataJSON),
            })
            console.log({ res })
          } catch (error) {
            toast('Error registering passkey', {
              description:
                error instanceof Error ? error.message : String(error),
              icon: 'error-filled',
              color: 'red',
            })
            return
          }
        }
      }}
    >
      register
    </div>
  )
}
