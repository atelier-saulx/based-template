import { BasedFunctionClient } from '@based/functions'

export const getSecret = (based: BasedFunctionClient, key: string) =>
  based.query('based:secret', key).get()
