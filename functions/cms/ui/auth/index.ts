import { DbClient } from '@based/db'
import { isWsContext, type BasedFunction } from '@based/functions'
import { randomBytes, pbkdf2Sync } from 'node:crypto'

const EMAIL_TOKEN_EXPIRY = 60e3 * 5
export const USER_TOKEN_EXPIRY = 604_800_000

export const hashSessionToken = (value: string) => {
  const iterations = 5000
  const keylen = 64
  const digest = 'sha256'
  const derivedKey = pbkdf2Sync(
    value,
    'super strong pepery peper yeye',
    iterations,
    keylen,
    digest,
  )
  return derivedKey.toString('hex')
}

type Payload = {
  email: string
  code: string
  mode?: 'login' | 'logout'
}

const fn: BasedFunction<Payload> = async (based, payload, ctx) => {
  const db = based.db.v2 as DbClient

  let { email, code, mode } = payload || {}

  if (mode === 'logout') {
    const token = ctx.session?.authState?.token

    if (typeof token === 'string') {
      const userSession = await db
        .query('userSession', { token: hashSessionToken(token) })
        .get()
        .toObject()

      db.delete('userSession', userSession.id)
    }

    return
  }

  if (
    !email ||
    typeof email !== 'string' ||
    !code ||
    typeof code !== 'string'
  ) {
    throw new Error('Invalid payload')
  }

  email = email.trim().toLocaleLowerCase()

  const user = await db.query('user', { email }).get().toObject()

  if (!user?.id || user.inactive) {
    console.info(`User ${email} is inactive or non existant, cannot login`)
    throw new Error('Not allowed')
  }

  let ip: string | undefined
  if (isWsContext(ctx) && ctx.session?.ip) {
    ip = ctx.session?.ip
  }

  const emailToken = randomBytes(64).toString('base64url')
  const domain =
    process.env.DOMAIN || process.env.BASED_DEV_SERVER_LOCAL_URL?.split('//')[1]
  const protocol =
    domain?.startsWith('192.168') || domain?.startsWith('localhost')
      ? 'http'
      : 'https'
  const callToAction = `${protocol}://${domain}/validate-login?token=${emailToken}`

  const magicLinkSession = await db.create('userSession', {
    sessionType: 'magicLink',
    token: emailToken,
    user,
    ip,
    used: false,
  })
  db.expire('userSession', magicLinkSession, EMAIL_TOKEN_EXPIRY / 1000)
  await db.drain()

  await based.call('based:auth-email', {
    type: 'magicLink',
    email,
    code,
    appName: 'Winit CMS',
    callToAction,
  })

  let unsub: any
  const loggedIn = await Promise.race([
    new Promise((resolve) => setTimeout(resolve, EMAIL_TOKEN_EXPIRY)),
    new Promise((resolve) => {
      unsub = db
        .query('userSession', magicLinkSession)
        .include('used')
        .subscribe((res) => {
          const session = res.toObject()
          if (session && session.used) {
            db.delete('userSession', magicLinkSession)
            resolve(session)
          }
        })
    }),
  ])

  unsub()

  if (!loggedIn) {
    throw new Error('email token exceeded')
  }

  const sessionToken = randomBytes(64).toString('base64url')

  const userSession = db.create('userSession', {
    sessionType: 'userSession',
    token: hashSessionToken(sessionToken),
    user,
    ip,
  })
  db.expire('userSession', userSession, USER_TOKEN_EXPIRY)
  await db.drain()

  await based.renewAuthState(ctx, {
    persistent: true,
    userId: user.id,
    token: sessionToken,
  })
}

export default fn
