import { DbClient } from '@based/db'
import { type BasedFunction } from '@based/functions'
import { contestants, votes } from './example-data'

const DEFAULT_USERS = ['admin@once.net']
const DEFAULT_PASSWORD = 'admin'

const fn: BasedFunction = async (based, payload, ctx) => {
  const db = based.db.v2 as DbClient

  // http://localhost:1234/populate
  // OR
  // http://localhost:1234/populate?sample_data=true

  // TODO: remove ability to load sample data
  if (payload.sample_data) {
    for (const contestant of contestants) {
      db.create('contestant', contestant)
    }
    for (const vote of votes) {
      db.create('vote', vote)
    }

    await db.drain()
    return 'POPULATED SAMPLE DATA'
  } else {
    const users = await db.query('user').include('id').get().toObject()
    if (users.length > 0) {
      return 'ALREADY_POPULATED'
    }

    for (const user of DEFAULT_USERS) {
      db.create('user', { email: user, password: DEFAULT_PASSWORD })
    }

    await db.drain()
    return 'POPULATED'
  }
}

export default fn
