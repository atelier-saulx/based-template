import type { SchemaType } from '@based/schema'

export type JWK = {
  kty: string
  crv?: string
  x?: string
  y?: string
  n?: string
  e?: string
}

export type Passkey = {
  credentialId: string
  publicKey: JWK
  signCount: number
  aaguid: string
  backupEligible?: boolean
  backupState?: boolean
  user: any
  createdAt: number
}

export const passkey: SchemaType = {
  credentialId: 'string',
  publicKey: {
    // JWK format
    props: {
      kty: 'string',
      crv: 'string',
      x: 'string',
      y: 'string',
      n: 'string',
      e: 'string',
    },
  },
  signCount: 'uint32',
  aaguid: 'string',
  backupEligible: 'boolean',
  backupState: 'boolean',
  user: {
    ref: 'user',
    prop: 'passkeys',
  },
  createdAt: { type: 'timestamp', on: 'create' },
}
