import type { BasedQueryFunction } from '@based/sdk'

const fn: BasedQueryFunction = async (based, payload = {}, update) => {
  const db = based.db
  return db.query('vote').subscribe(update)
}

export default fn
