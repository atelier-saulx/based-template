import type { BasedFunction } from '@based/functions'
// import type { BasedDb } from '@based/db'

const fn: BasedFunction = async (based, payload = {}) => {
  const db = based.db.v2

  const { choice, email } = payload

  if (!email || !choice) {
    throw new Error('bad payload')
  }

  const res = await db.create('vote', { email, choice })
  return res
}

export default fn
