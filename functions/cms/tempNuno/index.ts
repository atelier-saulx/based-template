import { type BasedFunction } from '@based/sdk/functions'

const fn: BasedFunction = async (based, payload, ctx) => {
  const db = based.db

  const users = await db.query('user').include('id').get().toObject()
  for (const user of users) {
    db.delete('user', user.id)
  }
  return 'Deleted users'
  // return db.query('user').get()
}

export default fn
