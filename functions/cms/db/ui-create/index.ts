import type { BasedFunction } from '@based/functions'
import type { DbClient } from '@based/db'

export default (async (based, payload = {}) => {
  const db = based.db.v2 as DbClient
  const { type, id, $$lang, ...set } = payload
  const options = $$lang ? { locale: $$lang } : undefined

  if (!type || type === '_root') {
    throw new Error('Cannot `create` with type _root')
  }

  const res = await db.create(type, set, options)
  return res
}) as BasedFunction
