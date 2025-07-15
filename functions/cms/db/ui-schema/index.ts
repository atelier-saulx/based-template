import type { DbClient } from '@based/db'
import type { BasedQueryFunction } from '@based/functions'

export default (async (based, _payload, update) => {
  const db = based.db.v2 as DbClient

  db.on('schema', (schema) => {
    update(schema)
  })

  if (db.schema) {
    update(db.schema)
  }

  return () => {
    db.off('schema', update)
  }
}) as BasedQueryFunction
