import type { SchemaType } from '@based/schema'
import { pbkdf2Sync, randomBytes } from 'node:crypto'

export const hashPassword = (value: string, salt: string) => {
  const iterations = 600_000
  const keylen = 64
  const digest = 'sha256'
  const derivedKey = pbkdf2Sync(value, salt, iterations, keylen, digest)
  return derivedKey.toString('hex')
}

const saltAndHashPassword = (value: string) => {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${hashPassword(value, salt)}`
}

export const user: SchemaType = {
  name: 'string',
  email: { type: 'alias', format: 'email' },
  password: {
    type: 'string',
    format: 'password',
    hooks: {
      create(value, _payload) {
        return saltAndHashPassword(value)
      },
      filter(query, field, operator, value) {
        query.filter(field, operator, value)
      },
      update(value: string, _payload) {
        return saltAndHashPassword(value)
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
