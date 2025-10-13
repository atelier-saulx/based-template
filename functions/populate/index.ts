import { type BasedFunction } from '@based/sdk/functions'
import { hashPassword } from '../utils'

const DEFAULT_USERS = ['admin@once.net']
const DEFAULT_PASSWORD = 'admin'

const fn: BasedFunction = async (based, payload, ctx) => {
  const db = based.db

  // http://localhost:1234/populate

  const users = await db.query('user').include('id').get().toObject()
  if (users.length > 0) {
    return 'ALREADY_POPULATED'
  }

  for (const user of DEFAULT_USERS) {
    db.create('user', {
      email: user,
      password: DEFAULT_PASSWORD,
      role: 'admin',
    })
  }

  await db.drain()
  return 'POPULATED'
}

export default fn
