import type { SchemaType } from '@based/schema'

export const passkey: SchemaType = {
  credentialId: 'string',
  publicKey: 'json',
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
