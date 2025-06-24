import type { SchemaType } from '@based/schema'

export const vote: SchemaType = {
  createdAt: {
    type: 'timestamp',
    on: 'create',
  },
  email: { type: 'string', format: 'email' },
  choice: {
    ref: 'contestant',
    prop: 'votes',
  },
}
