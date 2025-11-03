import { isWsContext, type BasedFunction } from '@based/functions'
import { getIdTokenSecret } from '../utils/getIdTokenSecret'
import { signIdToken, verifyIdToken } from '../utils/idToken'
import { getIpInfo } from '../utils/getIpInfo'
import { USER_TOKEN_EXPIRY } from '../login-magiclink/index.js'
import { userStatuses } from 'schema/user'

type Payload = {
  token: string
}

const fn: BasedFunction<Payload> = async (based, payload, ctx) => {
  if (!isWsContext(ctx)) {
    return null
  }
  const db = based.db

  let token = payload?.token

  if (typeof token !== 'string') {
    throw new Error('Invalid token')
  }

  try {
    const idTokenSecret = await getIdTokenSecret(based)
    const { id: inviteSessionId } = verifyIdToken(token, idTokenSecret)

    const inviteSession = await db
      .query('userSession', inviteSessionId)
      .include('sessionType', 'user.id')
      .get()
      .toObject()

    if (!inviteSession?.id || inviteSession.sessionType !== 'invite') {
      throw new Error('Invalid or expired token')
    }

    db.delete('userSession', inviteSession.id)

    const { ip, userAgent, geo } = getIpInfo(based, ctx)

    const userSessionId = await db.create('userSession', {
      sessionType: 'userSession',
      user: inviteSession.user.id,
      ip,
      userAgent,
      geo,
    })
    const sessionToken = signIdToken({ id: userSessionId }, idTokenSecret)
    if (ctx.session) {
      ctx.session.state ??= {}
      ctx.session.state.sessionTokenId = userSessionId
      ctx.session.state.lastHandledExpire = Date.now()
      db.expire('userSession', userSessionId, USER_TOKEN_EXPIRY)
    }

    db.update('user', inviteSession.user.id, {
      status: userStatuses.Onboarding,
    })

    await based.renewAuthState(ctx, {
      persistent: true,
      userId: inviteSession.user.id,
      token: sessionToken,
    })
  } catch (error) {
    console.error({ error })
    return { ok: false }
  }
}

export default fn
