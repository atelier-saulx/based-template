import type { Authorize } from '@based/functions'
import { viewerValidators } from './viewerValidators'
import { DbClient } from '@based/db'
import { hashSessionToken, USER_TOKEN_EXPIRY } from '../cms/ui/auth'

export type Validators = Record<
  string,
  (user: any, payload: any) => boolean | undefined
>

const authorize: Authorize = async (based, ctx, name, payload) => {
  const db = based.db.v2 as DbClient
  const authState = ctx.session?.authState
  const token = authState?.token

  if (!token) {
    return false
  }

  try {
    const hashedToken = hashSessionToken(token)
    const userSession = await db
      .query('userSession', { token: hashedToken })
      .include('user.role')
      .get()
      .toObject()
    const user = userSession?.user

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

    db.expire(
      'userSession',
      userSession.id,
      Math.floor(USER_TOKEN_EXPIRY / 1000),
    )
    return true
  } catch (error) {
    based.renewAuthState(ctx, {})
    console.error('authorize_err::', error)
  }

  return false
}

export default authorize
