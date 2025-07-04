import type { SchemaType } from '@based/schema'

export const user: SchemaType = {
  name: 'string',
  email: { type: 'alias', format: 'email' },
  password: { type: 'string', format: 'strongPassword' },
  role: ['admin', 'viewer'],
  createdAt: {
    type: 'timestamp',
    on: 'create',
  },
  updatedAt: {
    type: 'timestamp',
    on: 'update',
  },
  inactive: 'boolean',
}
