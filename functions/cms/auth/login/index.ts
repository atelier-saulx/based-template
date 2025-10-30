import { type } from 'arktype'
import { isWsContext, type BasedFunction } from '@based/sdk/functions'
import { getIdTokenSecret } from '../utils/getIdTokenSecret'
import { getIpInfo } from '../utils/getIpInfo'
import { signIdToken } from '../utils/idToken'
import { hashPassword } from 'schema/user'

export const USER_TOKEN_EXPIRY = 604_800_000

const loginPayload = type({
  email: 'string.email',
  password: 'string < 250',
})

const fn: BasedFunction = async (based, payload, ctx) => {
  if (!isWsContext(ctx)) {
    return null
  }
  const db = based.db

  const validate = loginPayload(payload)
  if (validate instanceof type.errors) {
    console.error(validate.summary) // remove in production
    throw new Error('Invalid payload')
  }

  let { email, password } = payload

  email = email.trim().toLowerCase()

  const user = await db
    .query('user', { email })
    .include('password')
    .get()
    .toObject()

  if (!user?.id) {
    console.info(`User ${email} is inactive or non existant, cannot login`)
    throw new Error('Not allowed')
  }

  const salt = user.password.split(':')[0]
  const digest = salt + ':' + hashPassword(password, salt)

  if (user.password === digest) {
    const idTokenSecret = await getIdTokenSecret(based)
    const { ip, userAgent, geo } = getIpInfo(based, ctx)
    const userSession = await db.create('userSession', {
      sessionType: 'userSession',
      user,
      ip,
      userAgent,
      geo,
    })
    const sessionToken = signIdToken({ id: userSession }, idTokenSecret)
    await based.renewAuthState(ctx, {
      persistent: true,
      userId: user.id,
      token: sessionToken,
    })
    if (ctx.session) {
      ctx.session.state ??= {}
      ctx.session.state.sessionTokenId = userSession
      ctx.session.state.lastHandledExpire = Date.now()
      db.expire('userSession', userSession, USER_TOKEN_EXPIRY / 1000)
    }
  } else {
    throw new Error('Not allowed')
  }
}

export default fn
