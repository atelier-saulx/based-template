import { type BasedFunction } from '@based/sdk/functions'

const fn: BasedFunction = async (based, _payload, ctx) => {
  const db = based.db
  return db
    .query('user')
    .include('*', 'passkeyChallenges', 'passkeys')
    .get()
    .toObject()
}
export default fn
