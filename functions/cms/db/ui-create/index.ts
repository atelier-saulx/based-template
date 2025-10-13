import type { BasedFunction } from '@based/sdk/functions'

export default (async (based, payload = {}) => {
  const db = based.db
  const { type, id, $$lang, ...set } = payload
  const options = $$lang ? { locale: $$lang } : undefined

  if (!type || type === '_root') {
    throw new Error('Cannot `create` with type _root')
  }

  const res = await db.create(type, set, options)
  return res
}) as BasedFunction
