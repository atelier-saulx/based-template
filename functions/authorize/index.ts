import type { Authorize } from '@based/sdk'
import { getSecret } from '../utils'
import { sign, verify } from '@saulx/crypto'
import { viewerValidators } from './viewerValidators'

const FULL_EXPIRY = 604_800_000 // week
const REFRESH_EXPIRY = 24 * 60 * 60e3 // day

export type Validators = Record<
  string,
  (user: any, payload: any) => boolean | undefined
>

const authorize: Authorize = async (based, ctx, name, payload) => {
  const db = based.db
  const authState = ctx.session?.authState
  const token = authState?.token

  // TODO: Remove this once local based:secret is implemented
  const {
    USER_PUBLIC_KEY = 'My public key',
    USER_PRIVATE_KEY = 'My secret key',
  } = process.env

  if (!token) {
    return false
  }

  const publicKey = USER_PUBLIC_KEY || (await getSecret(based, 'userPublicKey'))
  const privateKey =
    USER_PRIVATE_KEY || (await getSecret(based, 'userPrivateKey'))

  if (!publicKey || !privateKey) {
    throw 'Missing publicKey or privateKey configuration.'
  }

  try {
    // TODO: uncomment when we have local secrets
    // const tokenBody = verify<{ expiresAt: number; userId: string }>(
    //   token,
    //   publicKey,
    // )

    // TODO: uncomment when we have local secrets
    // const { userId, expiresAt } = tokenBody
    // if (authState.userId !== userId) {
    //   based.renewAuthState(ctx, {})
    //   return false
    // }

    // const now = Date.now()
    // const expired = now - expiresAt
    let newToken: string | undefined

    // TODO: uncomment when we have local secrets
    // if (expired > REFRESH_EXPIRY) {
    //   if (expired > FULL_EXPIRY) {
    //     based.renewAuthState(ctx, {})
    //     return false
    //   }
    //   tokenBody.expiresAt = now + REFRESH_EXPIRY
    //   newToken = sign(tokenBody, privateKey)
    // }

    // TODO: uncomment and remove when we have local secrets
    const user = await db
      .query('user', Number(authState.userId))
      .get()
      .toObject()

    // const user = await based.query('user', { id: userId }).get()
    if (!user?.role) {
      based.renewAuthState(ctx, {})
      return false
    }

    if (user.role === 'viewer') {
      const verify = viewerValidators[name]
      if (!verify?.(user, payload)) {
        return false
      }
    } else if (user.role === 'admin') {
      // Admins have full access by default. If not, further validation can be done here
    } else {
      return false
    }

    if (newToken) {
      based.renewAuthState(ctx, {
        token: newToken,
        persistent: true,
        // TODO: remove when we have local secrets
        // userId: userId,
        userId: user.id,
      })
    }

    return true
  } catch (_e) {
    console.log('authorize_err::', _e)
  }

  return false
}

export default authorize
