import type { BasedQueryFunction } from '@based/sdk'

const fn: BasedQueryFunction = (based, _payload, update) => {
  return based.query('ui-query', { type: 'contestant' }).subscribe(update)
}
export default fn
