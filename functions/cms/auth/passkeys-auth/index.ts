import { isWsContext, type BasedFunction } from '@based/sdk/functions'
import { randomBytes } from 'node:crypto'
import { Passkey } from 'schema/passkey'

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
    .include('passkeys')
    .get()
    .toObject()

  const challenge = randomBytes(32).toString('base64url')

  const challengeId = await db.create('passkeyChallenge', {
    challenge,
    user: userId,
  })
  db.expire('passkeyChallenge', challengeId, CHALLENGE_EXPIRATION_SECONDS)

  const options = {
    challenge,
    allowCredentials: user.passkeys?.map((passkey: Passkey) => ({
      id: passkey.credentialId,
      type: 'public-key',
      transports: ['usb', 'ble', 'nfc'],
    })),
    timeout: 60000,
  }
  return options
}
export default fn
