import type { BasedQueryFunction } from '@based/sdk/functions'

export default (async (based, _payload, update) => {
  const db = based.db

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
