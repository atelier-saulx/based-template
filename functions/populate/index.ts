import { DbClient } from '@based/db'
import { type BasedFunction } from '@based/functions'
import { hashPassword } from '../utils'

// const DEFAULT_USERS = ['admin@once.net']
// const DEFAULT_PASSWORD = 'admin'
// TODO: We need to make password by default, and be able to configure
// magic link on first run or on the workspace settings.
const DEFAULT_USERS = [
  {
    email: 'nuno@saulx.com',
    name: 'Nuno Frade',
    role: 'admin',
  },
]

const fn: BasedFunction = async (based, payload, ctx) => {
  const db = based.db.v2 as DbClient

  // http://localhost:1234/populate

  const users = await db.query('user').include('id').get().toObject()
  if (users.length > 0) {
    return 'ALREADY_POPULATED'
  }

  for (const user of DEFAULT_USERS) {
    db.create('user', user)
  }

  await db.drain()
  return 'POPULATED'
}

export default fn
