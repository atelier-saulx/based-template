import type { BasedQueryFunction } from '@based/sdk/functions'

export default (async (based, payload, update) => {
  if (!payload?.type) {
    throw new Error('No type in total payload')
  }
  const db = based.db
  return db
    .query(payload.type)
    .count()
    .subscribe((res) => {
      const cnt = res.toObject().$count
      update({ total: cnt }, cnt)
    })
}) as BasedQueryFunction
