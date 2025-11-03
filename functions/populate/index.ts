import { type BasedFunction } from '@based/sdk/functions'

// password
// const DEFAULT_USERS = ['admin@once.net']

// magic-link
const DEFAULT_USERS = [
  {
    email: 'nuno@saulx.com',
    role: 'admin',
    status: 'active',
    name: 'Nuno Frade',
  },
]
const DEFAULT_PASSWORD = 'admin'

const fn: BasedFunction = async (based, payload, ctx) => {
  const db = based.db

  // http://localhost:1234/populate

  const users = await db.query('user').include('id').get().toObject()
  if (users.length > 0) {
    return 'ALREADY_POPULATED'
  }

  for (const user of DEFAULT_USERS) {
    // password
    // db.create('user', {
    //   email: user,
    //   password: DEFAULT_PASSWORD,
    //   role: 'admin',
    // })

    // magiclink
    db.create('user', {
      ...user,
    })
  }

  await db.drain()
  return 'POPULATED'
}

export default fn
