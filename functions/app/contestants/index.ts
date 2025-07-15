import type { BasedQueryFunction } from '@based/functions'

const fn: BasedQueryFunction = (based, _payload, update) => {
  return based.query('ui-query', { type: 'contestant' }).subscribe(update)
}
export default fn
