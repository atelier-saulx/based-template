import type { SchemaType } from '@based/schema'

export const userSession: SchemaType = {
  sessionType: ['magicLink', 'userSession'],
  // TODO: save the hash of the token and not the token itself
  token: 'alias',
  user: {
    ref: 'user',
    prop: 'sessions',
  },
  ip: 'string',
  used: 'boolean',
  createdAt: { type: 'timestamp', on: 'create' },
  updatedAt: { type: 'timestamp', on: 'update' },
}
