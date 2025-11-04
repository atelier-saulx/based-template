import {
  BasedFunctionClient,
  Context,
  HttpSession,
  WebSocketSession,
} from '@based/sdk'
import { USER_TOKEN_EXPIRY } from 'functions/cms/auth/login-password'
import { getIdTokenSecret } from 'functions/cms/auth/utils/getIdTokenSecret'
import { verifyIdToken } from 'functions/cms/auth/utils/idToken'

/**
 * Handles checking the token against a valid userSession
 * in an optimized way.
 */
export const handleSession = async (
  based: BasedFunctionClient,
  ctx: Context<WebSocketSession | HttpSession>,
) => {
  const db = based.db
  const authState = ctx.session?.authState
  const token = authState?.token
  if (!token) {
    return
  }

  if (ctx.session?.state?.firstLoad) {
    await ctx.session.state.firstLoad
  }

  if (ctx.session && !ctx.session?.state?.handled) {
    ctx.session.state ??= {}
    ctx.session.state.handled = true

    ctx.session.state.firstLoad = new Promise(async (resolve) => {
      let isResolved = false

      const idTokenSecret = await getIdTokenSecret(based)
      try {
        const { id: userSessionId } = verifyIdToken(token, idTokenSecret)
        if (ctx.session) {
          const close = db
            .query('userSession', userSessionId)
            .include('user.role')
            .subscribe((res) => {
              if (ctx.session) {
                const userSession = res.toObject()
                ctx.session.state ??= {}

                if (!isResolved) {
                  ctx.session.state.userSession = userSession
                  ctx.session.state.firstLoad = false
                  isResolved = true
                  resolve(true)
                } else {
                  if (!userSession?.user?.role) {
                    ctx.session.state.userSession = null
                    based.renewAuthState(ctx, { token: '', persistent: true })
                    ctx.session.state.handled = false
                    close()
                  }
                }
              }
            })
          ctx.session.onClose = close
        }
      } catch (error) {
        console.error(error)
        ctx.session!.state.userSession = null
        ctx.session!.state.handled = false
        based.renewAuthState(ctx, { token: '', persistent: true })
      }
    })
    await ctx.session.state.firstLoad
  }

  const now = Date.now()
  if (
    ctx.session &&
    ctx.session.state?.userSession?.id &&
    (!ctx.session.state.lastHandledExpire ||
      ctx.session.state.lastHandledExpire + 60_000 < now)
  ) {
    ctx.session.state.lastHandledExpire = now
    db.expire(
      'userSession',
      ctx.session?.state?.userSession.id,
      Math.floor(USER_TOKEN_EXPIRY / 1000),
    )
  }
  return ctx.session?.state?.userSession?.user
}
