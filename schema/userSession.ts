import type { SchemaType } from '@based/schema'

export const userSession: SchemaType = {
  sessionType: ['magicLink', 'userSession', 'invite'],
  user: {
    ref: 'user',
    prop: 'sessions',
  },
  ip: {
    type: 'string',
    compression: 'none',
  },
  userAgent: {
    type: 'string',
    compression: 'none',
  },
  geo: {
    type: 'string',
    compression: 'none',
  },
  used: 'boolean',
  createdAt: { type: 'timestamp', on: 'create' },
  updatedAt: { type: 'timestamp', on: 'update' },
}
