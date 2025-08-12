import type { DbClient } from '@based/db'
import type { BasedQueryFunction } from '@based/functions'

export type Session = {
  id: number
}

const fn: BasedQueryFunction<{ id: number }, Session[]> = async (
  based,
  payload,
  update,
) => {
  const { id } = payload
  const db = based.db.v2 as DbClient
  return db
    .query('user', id)
    .include('sessions')
    .subscribe((r) => update(r.toObject()))
}

export default fn
