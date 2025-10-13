import { BasedFunctionClient } from '@based/functions'

export const getIdTokenSecret = async (based: BasedFunctionClient) => {
  const idTokenSecret =
    process.env.ID_TOKEN_SECRET ||
    (await based.query('based:secret', 'ID_TOKEN_SECRET').get())
  if (!idTokenSecret) {
    throw new Error('ID_TOKEN_SECRET not set')
  }
  return idTokenSecret
}
