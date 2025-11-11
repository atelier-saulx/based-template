import { isWsContext, type BasedFunction } from '@based/sdk/functions'
import { randomBytes } from 'node:crypto'

const CHALLENGE_EXPIRATION_SECONDS = 60 * 5 // 5 minutes

const fn: BasedFunction = async (based, _payload, ctx) => {
  if (!isWsContext(ctx)) {
    return null
  }

  const db = based.db

  const domain =
    process.env.DOMAIN ||
    process.env.BASED_DEV_SERVER_LOCAL_URL?.split('//')[1].split(':')[0]
  if (!domain) throw new Error('Invalid domain configuration')

  const challenge = randomBytes(32).toString('base64url')

  const challengeId = await db.create('passkeyChallenge', {
    challenge,
  })
  db.expire('passkeyChallenge', challengeId, CHALLENGE_EXPIRATION_SECONDS)

  const options = {
    challenge,
    rpId: domain,
    timeout: 60000,
    userVerification: 'required',
  }
  return options
}
export default fn
