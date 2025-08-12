import type { DbClient } from '@based/db'
import type { BasedQueryFunction } from '@based/functions'

export default (async (based, payload, update) => {
  if (!payload?.type) {
    throw new Error('No type in total payload')
  }
  const db = based.db.v2 as DbClient
  return db
    .query(payload.type)
    .count()
    .subscribe((res) => {
      const cnt = res.toObject().$count
      update({ total: cnt }, cnt)
    })
}) as BasedQueryFunction
