import type { SchemaType } from '@based/schema'

// TODO: Add ENV variables
const PEPPER = process.env.PEPPER || 'f5471afa8793530ea72de995d54451b2a6235713'
const HMAC_SECRET =
  process.env.HMAC_SECRET || 'b330eff681f5d38cdb98eca44d00d9e5cfde6b8d'

export const hashPassword = (value: string) => {
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

export const user: SchemaType = {
  name: 'string',
  email: { type: 'alias', format: 'email' },
  password: {
    type: 'string',
    format: 'password',
    hooks: {
      create(value, _payload) {
        return hashPassword(value)
      },
      filter(query, field, operator, value) {
        query.filter(field, operator, hashPassword(value))
      },
      update(value: string, _payload) {
        return hashPassword(value)
      },
    },
  },
  picture: {
    type: 'string',
    mime: 'image/*',
    compression: 'none',
  },
  followMe: 'json',
  role: ['admin', 'viewer'],
  sessions: {
    readOnly: true,
    items: {
      ref: 'userSession',
      prop: 'user',
    },
  },
  createdAt: { type: 'timestamp', on: 'create' },
  updatedAt: { type: 'timestamp', on: 'update' },
}
