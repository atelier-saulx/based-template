import { isWsContext, type BasedFunction } from '@based/sdk/functions'
import { randomBytes } from 'node:crypto'

const CHALLENGE_EXPIRATION_SECONDS = 60 * 5 // 5 minutes

const fn: BasedFunction = async (based, _payload, ctx) => {
  if (!isWsContext(ctx)) {
    return null
  }

  const db = based.db

  const userId = ctx.session?.authState?.userId
  if (!userId) {
    throw new Error('no user')
  }

  const user = await db
    .query('user', Number(userId))
    .include('name', 'email')
    .get()
    .toObject()

  const challenge = randomBytes(32).toString('base64url')

  const challengeId = await db.create('passkeyChallenge', {
    challenge,
    user: userId,
  })
  db.expire('passkeyChallenge', challengeId, CHALLENGE_EXPIRATION_SECONDS)

  const publicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: 'Based template',
      id:
        process.env.DOMAIN ||
        process.env.BASED_DEV_SERVER_LOCAL_URL?.split('//')[1].split(':')[0],
    },
    user: {
      id: user.id,
      name: user.email,
      displayName: user.name,
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 }, // RS256
      { type: 'public-key', alg: -8 }, // Ed25519 (if targeting newer YubiKeys)
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'cross-platform',
      residentKey: 'required',
      requireResidentKey: true,
      userVerification: 'required',
    },
    timeout: 60000,
    attestation: 'direct',
  }
  return publicKeyCredentialCreationOptions
}
export default fn
