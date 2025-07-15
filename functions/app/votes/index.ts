import type { BasedQueryFunction } from '@based/functions'
import type { DbClient } from '@based/db'

const fn: BasedQueryFunction = async (based, payload = {}, update) => {
  const db = based.db.v2 as DbClient
  return db.query('vote').subscribe(update)
}

export default fn
