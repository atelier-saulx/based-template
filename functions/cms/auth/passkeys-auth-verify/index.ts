import { isWsContext, type BasedFunction } from '@based/sdk/functions'
import { type } from 'arktype'
import { decodeAuthenticatorData } from '../utils/passkeys'
import { createHash, createVerify } from 'node:crypto'
import { jwkToPem } from '../utils/jwkToPem'
import { getIpInfo } from '../utils/getIpInfo'
import { signIdToken } from '../utils/idToken'
import { USER_TOKEN_EXPIRY } from '../login-magiclink'
import { getIdTokenSecret } from '../utils/getIdTokenSecret'

const passkeysAuthPayload = type({
  id: 'string < 250',
  type: 'string < 50',
  authenticatorData: 'string < 1024',
  clientDataJSON: 'string < 1024',
  signature: 'string < 1024',
  userHandle: 'string < 512',
})

const fn: BasedFunction<typeof passkeysAuthPayload.infer> = async (
  based,
  payload,
  ctx,
) => {
  if (!isWsContext(ctx)) {
    return null
  }

  const db = based.db

  const validate = passkeysAuthPayload(payload)
  if (validate instanceof type.errors) {
    console.error(validate.summary) // remove in production
    throw new Error('Invalid payload')
  }

  try {
    const clientDataJSON = Buffer.from(payload.clientDataJSON, 'base64')
    const clientData = JSON.parse(clientDataJSON.toString())

    const authenticatorData = Buffer.from(payload.authenticatorData, 'base64')
    const decodedAuthenticatorData = decodeAuthenticatorData(authenticatorData)

    const signature = Buffer.from(payload.signature, 'base64')

    const userHandle = Buffer.from(payload.userHandle, 'base64').toString(
      'utf8',
    )

    if (payload.type !== 'public-key') throw new Error('Wrong assertion type')

    const storedChallenge = await db
      .query('passkeyChallenge', {
        challenge: clientData.challenge,
      })
      .get()
      .toObject()

    if (!storedChallenge) {
      throw new Error('Challenge not found or expired')
    }
    db.delete('passkeyChallenge', storedChallenge.id)

    const userId = Number(userHandle)

    if (clientData.type !== 'webauthn.get') {
      throw new Error('Wrong operation type')
    }

    const domain =
      process.env.DOMAIN ||
      process.env.BASED_DEV_SERVER_LOCAL_URL?.split('//')[1].split(':')[0]
    if (!domain) throw new Error('Invalid domain configuration')

    let [protocol, clientDomain] = clientData.origin.split('://')
    clientDomain = clientDomain.split(':')[0]

    if (clientDomain !== domain)
      throw new Error('Invalid origin:', clientData.origin)
    if (domain !== 'localhost' && protocol === 'http')
      throw new Error('Invalid protocol:', clientData.origin)

    const expectedRpIdHash = createHash('sha256').update(domain).digest('hex')
    if (decodedAuthenticatorData.rpIdHash !== expectedRpIdHash) {
      throw new Error('RP ID hash mismatch')
    }
    if (!decodedAuthenticatorData.flags.userPresent)
      throw new Error('User not present')
    if (!decodedAuthenticatorData.flags.userVerified)
      throw new Error('User not verified')

    const credentialId = payload.id
    const user = await db
      .query('user', userId)
      .include((f) => {
        f('passkeys')
          .include('signCount', 'publicKey')
          .filter('credentialId', '=', credentialId)
      })
      .get()
      .toObject()
    if (!user.id) {
      throw new Error('User does not exist')
    }
    if (!user.passkeys.length) {
      throw new Error('Passkey not registered')
    }
    const passkey = user.passkeys[0]
    // 1Password and probably other software based
    // authenticators don't increment the signCount reliably.
    // So we can't use it.
    // if (decodedAuthenticatorData.signCount <= passkey.signCount) {
    //   throw new Error('signCount error')
    // }
    // db.update('passkeys', passkey.id, {
    //   signCount: decodedAuthenticatorData.signCount,
    // })

    const clientDataHash = createHash('sha256').update(clientDataJSON).digest()
    const signedData = Buffer.concat([authenticatorData, clientDataHash])

    const publicKeyPem = jwkToPem(passkey.publicKey)
    const verify = createVerify('sha256')
    verify.update(signedData)
    verify.end()
    const verified = verify.verify(publicKeyPem, signature)

    if (!verified) {
      throw new Error('Signature verification failed')
    }

    const { ip, userAgent, geo } = getIpInfo(based, ctx)

    const userSession = await db.create('userSession', {
      sessionType: 'userSession',
      user,
      ip,
      userAgent,
      geo,
    })
    const idTokenSecret = await getIdTokenSecret(based)
    const sessionToken = signIdToken({ id: userSession }, idTokenSecret)
    if (ctx.session) {
      ctx.session.state ??= {}
      ctx.session.state.sessionTokenId = userSession
      ctx.session.state.lastHandledExpire = Date.now()
      db.expire('userSession', userSession, USER_TOKEN_EXPIRY / 1000)
    }

    await based.renewAuthState(ctx, {
      persistent: true,
      userId: user.id,
      token: sessionToken,
    })
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'Verification failed' }
  }

  return { ok: true }
}
export default fn
