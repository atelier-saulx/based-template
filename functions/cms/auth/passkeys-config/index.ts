import { isWsContext, type BasedFunction } from '@based/sdk/functions'
import { randomBytes } from 'node:crypto'

const fn: BasedFunction = async (based, _payload, ctx) => {
  if (!isWsContext(ctx)) {
    return null
  }

  const db = based.db

  console.log('===', ctx.session?.authState)
  const userId = ctx.session?.authState?.userId
  if (!userId) {
    throw new Error('no user')
  }

  const user = await db
    .query('user', Number(userId))
    .include('name', 'email')
    .get()
    .toObject()

  const publicKeyCredentialCreationOptions = {
    challenge: randomBytes(32).toString('base64url'),
    rp: {
      name: 'Based template',
      id: 'template.based.dev',
    },
    user: {
      id: user.id,
      name: user.email,
      displayName: user.name,
    },
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
    authenticatorSelection: {
      authenticatorAttachment: 'cross-platform',
    },
    timeout: 60000,
    attestation: 'direct',
  }
  return publicKeyCredentialCreationOptions
}
export default fn
