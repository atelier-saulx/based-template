import type { DbClient } from '@based/db'
import type { BasedQueryFunction } from '@based/functions'

export default (async (based, payload, update) => {
  if (!payload?.type) {
    throw new Error('No type in total payload')
  }
  if (payload.type === 'vote' || payload.type === 'payment') {
    throw new Error('Cannot query total for votes and payments')
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
