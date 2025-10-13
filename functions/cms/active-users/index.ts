import type { BasedQueryFunction } from '@based/sdk'

export default (async (based, _payload, update) => {
  return based.query('based:connections').subscribe(update)
}) as BasedQueryFunction
