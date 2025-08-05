import { DbClient } from '@based/db'
import { type BasedFunction } from '@based/functions'
import schema from '../../schema/based.schema.ts'

const fn: BasedFunction = async (based, payload, ctx) => {
  const db = based.db.v2 as DbClient

  await db.setSchema(JSON.parse(JSON.stringify(schema)))

  return 'SCHEMA SET'
}

export default fn
