import { BasedFunctionClient } from '@based/functions'
import { createHmac } from 'crypto'

export const getSecret = (based: BasedFunctionClient, key: string) =>
  based.query('based:secret', key).get()

const PEPPER = process.env.PEPPER || 'f5471afa8793530ea72de995d54451b2a6235713'
const HMAC_SECRET =
  process.env.HMAC_SECRET || 'b330eff681f5d38cdb98eca44d00d9e5cfde6b8d'

export const hashPassword = (value: string) => {
  const hmac1 = createHmac('sha512', HMAC_SECRET)
  hmac1.update(value + PEPPER)
  const digest1 = hmac1.digest('hex')
  const hmac2 = createHmac('sha512', HMAC_SECRET)
  hmac2.update(digest1 + PEPPER)
  const digest2 = hmac2.digest('hex')
  return digest2
}
