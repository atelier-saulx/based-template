import type { SchemaType } from '@based/schema'

export const passkeyChallenge: SchemaType = {
  challenge: { type: 'alias' },
  user: {
    ref: 'user',
    prop: 'passkeyChallenges',
  },
  createdAt: { type: 'timestamp', on: 'create' },
}
