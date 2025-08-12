import type { BasedFunction } from '@based/functions'
import type { DbClient } from '@based/db'

export default (async (based, payload = {}) => {
  const db = based.db.v2 as DbClient
  return db.delete(payload.type, payload.id)
}) as BasedFunction
