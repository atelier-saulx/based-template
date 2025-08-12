import type { BasedFunction } from '@based/functions'
import type { DbClient } from '@based/db'

export default (async (based, payload) => {
  let { type = '_root', id, $$lang, ...set } = payload || {}
  const db = based.db.v2 as DbClient

  id = Number(id)

  if (!id) {
    if (type !== '_root') {
      throw Error('Invalid id')
    }
    id = 1
  } else if (type === '_root' && id !== 1) {
    throw Error('Invalid _root id')
  }

  if ($$lang) {
    return await db.update(type, id, set, { locale: $$lang })
  }

  return await db.update(type, id, set)
}) as BasedFunction
