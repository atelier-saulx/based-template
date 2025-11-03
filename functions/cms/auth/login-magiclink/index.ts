import { type } from 'arktype'
import { isWsContext, type BasedFunction } from '@based/sdk/functions'
import { getIdTokenSecret } from '../utils/getIdTokenSecret'
import { getIpInfo } from '../utils/getIpInfo'
import { signIdToken } from '../utils/idToken'

const EMAIL_TOKEN_EXPIRY = 60e3 * 5 // 5 minutes
export const USER_TOKEN_EXPIRY = 604_800_000 // 7 days

const loginPayload = type({
  email: 'string.email',
  code: 'string < 150',
})

const fn: BasedFunction<typeof loginPayload.infer> = async (
  based,
  payload,
  ctx,
) => {
  if (!isWsContext(ctx)) {
    return null
  }
  const db = based.db

  const validate = loginPayload(payload)
  if (validate instanceof type.errors) {
    console.error(validate.summary) // remove in production
    throw new Error('Invalid payload')
  }

  let { email } = payload
  email = email.trim().toLowerCase()

  const user = await db
    .query('user', { email })
    .include('password', 'status')
    .get()
    .toObject()

  const { ip, userAgent, geo } = getIpInfo(based, ctx)

  const { code } = payload

  if (!user?.id || user.status === 'inactive') {
    console.info(`User ${email} is inactive or non existant, cannot login`)
    throw new Error('Not allowed')
  }
  if (user.status === 'pending') {
    console.info(
      `User ${email} is pending and needs to confirm his email, cannot login`,
    )
    throw new Error('Not allowed')
  }

  const magicLinkSessionId = await db.create('userSession', {
    sessionType: 'magicLink',
    user,
    ip,
    userAgent,
    geo,
  })

  const idTokenSecret = await getIdTokenSecret(based)
  const emailToken = signIdToken({ id: magicLinkSessionId }, idTokenSecret)
  const domain =
    process.env.DOMAIN || process.env.BASED_DEV_SERVER_LOCAL_URL?.split('//')[1]
  const protocol =
    domain?.startsWith('192.168') || domain?.startsWith('localhost')
      ? 'http'
      : 'https'
  const callToAction = `${protocol}://${domain}/validate-email?token=${emailToken}`
  db.expire('userSession', magicLinkSessionId, EMAIL_TOKEN_EXPIRY / 1000)
  await db.drain()
  await based.call('based:auth-email', {
    type: 'magicLink',
    email,
    code,
    appName: 'based-template CMS',
    callToAction,
  })

  let unsub: any
  const loggedIn = await Promise.race([
    new Promise((resolve) => setTimeout(resolve, EMAIL_TOKEN_EXPIRY)),
    new Promise((resolve) => {
      console.log('-- gogo --', magicLinkSessionId)
      unsub = db
        .query('userSession', magicLinkSessionId)
        .include('used')
        .subscribe((res) => {
          const session = res.toObject()

          if (session && session.used) {
            db.delete('userSession', magicLinkSessionId)
            resolve(session)
          }
        })
    }),
  ])

  unsub()

  if (!loggedIn) {
    throw new Error('email token exceeded')
  }

  const userSession = await db.create('userSession', {
    sessionType: 'userSession',
    user,
    ip,
    userAgent,
    geo,
  })
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
}

export default fn
