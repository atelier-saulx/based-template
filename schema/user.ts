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

export const userStatuses = {
  Active: 'active',
  Onboarding: 'onboarding',
  Pending: 'pending',
  Inactive: 'inactive',
} as const

export const userRoles = {
  Admin: 'admin',
  Viewer: 'viewer',
} as const

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
  status: Object.values(userStatuses),
  picture: {
    type: 'string',
    mime: 'image/*',
    compression: 'none',
  },
  followMe: 'json',
  role: Object.values(userRoles),
  sessions: {
    readOnly: true,
    items: {
      ref: 'userSession',
      prop: 'user',
    },
  },
  passkeyChallenges: {
    readOnly: true,
    items: {
      ref: 'passkeyChallenge',
      prop: 'user',
    },
  },
  passkeys: {
    readOnly: true,
    items: {
      ref: 'passkey',
      prop: 'user',
    },
  },
  createdAt: { type: 'timestamp', on: 'create' },
  updatedAt: { type: 'timestamp', on: 'update' },
}
