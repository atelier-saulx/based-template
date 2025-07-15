import type { BasedQueryFunction } from '@based/functions'

export default (async (based, _payload, update) => {
  return based.query('based:connections').subscribe(update)
}) as BasedQueryFunction
