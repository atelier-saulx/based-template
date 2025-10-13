import type { Authorize } from '@based/sdk'
import { handleSession } from './handleSession'

export type Validators = Record<
  string,
  (user: any, payload: any) => boolean | undefined
>

const authorize: Authorize = async (based, ctx, name, payload) => {
  const authState = ctx.session?.authState
  const token = authState?.token
  if (!token) {
    return false
  }

  try {
    const user = await handleSession(based, ctx)

    if (user.role === 'viewer') {
      if (name === 'active-users' || name === 'contestants') {
        return true
      }
    } else if (user.role === 'admin') {
      // Admins have full access by default. If not, further validation can be done here
      return true
    } else {
      return false
    }
  } catch (error) {
    based.renewAuthState(ctx, {})
    console.error('authorize_err::', error)
  }

  return false
}

export default authorize
