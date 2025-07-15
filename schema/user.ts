import type { SchemaType } from '@based/schema'

// TODO: Add ENV variables
const PEPPER = process.env.PEPPER || 'f5471afa8793530ea72de995d54451b2a6235713'
const HMAC_SECRET =
  process.env.HMAC_SECRET || 'b330eff681f5d38cdb98eca44d00d9e5cfde6b8d'

export const user: SchemaType = {
  name: 'string',
  email: { type: 'alias', format: 'email' },
  password: {
    type: 'string',
    format: 'password',
    transform: (type, value) => {
      if (type === 'create' || type === 'filter' || type === 'update') {
        // TODO: this can be optimized
        const crypto = require('crypto')
        const hmac1 = crypto.createHmac('sha512', HMAC_SECRET)
        hmac1.update(value + PEPPER)
        const digest1 = hmac1.digest('hex')
        const hmac2 = crypto.createHmac('sha512', HMAC_SECRET)
        hmac2.update(digest1 + PEPPER)
        const digest2 = hmac2.digest('hex')
        return digest2
      }
      return value
    },
  },
  role: ['admin', 'viewer'],
  createdAt: { type: 'timestamp', on: 'create' },
  updatedAt: { type: 'timestamp', on: 'update' },
}
