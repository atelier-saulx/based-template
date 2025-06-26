import { HTMLTemplate, textTemplate } from './template.js'
import { setTimeout } from 'node:timers/promises'
import { sign } from '@saulx/crypto'
import { isWsContext, type BasedFunction } from '@based/functions'
import type { DbClient } from '@based/db'

const EMAIL_TOKEN_EXPIRY = 60e3 * 5
const USER_TOKEN_EXPIRY = 604_800_000

const generateEmailToken = (
  privateKey: string,
  emailExpiresIn: number,
  ip?: string,
): string =>
  sign(
    {
      exp: Date.now() + emailExpiresIn,
      ip,
    },
    privateKey,
  )

const login: BasedFunction = async (based, payload, ctx) => {
  const db = based.db.v2 as DbClient
  let { email, displayCode, origin } = payload || {}

  if (
    typeof email !== 'string' ||
    typeof displayCode !== 'string' ||
    typeof origin !== 'string'
  ) {
    throw new Error('Invalid payload')
  }

  email = email.trim().toLowerCase()

  if (!email || !displayCode || !origin) {
    throw new Error('Invalid payload')
  }

  const { USER_PRIVATE_KEY, POSTMARK_KEY } = process.env
  const [privateKey, userPostmarkKey, user] = await Promise.all([
    USER_PRIVATE_KEY || getSecret(based, 'userPrivateKey'),
    POSTMARK_KEY || getSecret(based, 'postmarkKey'),
    db
      .query('user', { email })
      .include('status', 'currentToken', 'inactive')
      .get()
      .toObject(),
  ])

  if (!privateKey) {
    throw 'Missing privateKey'
  }

  if (!user?.id || user.inactive) {
    console.info(`User ${email} is inactive or non existant, cannot login`)
    throw new Error('Not allowed')
  }

  let ip: string | undefined
  if (
    !process.env.BASED_DEV_SERVER_LOCAL_URL &&
    isWsContext(ctx) &&
    ctx.session?.ip
  ) {
    ip = ctx.session?.ip
  }
  const emailToken = generateEmailToken(privateKey, EMAIL_TOKEN_EXPIRY, ip)
  const callToAction = `${origin}/validate-login?token=${encodeURIComponent(
    emailToken,
  )}`

  await db.update('user', user.id, {
    currentToken: emailToken,
    status: 'login',
  })

  // postMarkClient ??= new PostmarkClient(postmarkKey)
  //
  // await postMarkClient.sendEmail({
  //   From: 'esc.vote CMS <no-reply@once.net>',
  //   To: email,
  //   Subject: 'esc.vote CMS login',
  //   TextBody: textTemplate(callToAction, displayCode, email),
  //   HtmlBody: HTMLTemplate(callToAction, displayCode, email),
  // })

  await based.call('based:login', { email, displayCode, callToAction })

  let unsub: any
  const loggedIn = await Promise.race([
    setTimeout(EMAIL_TOKEN_EXPIRY),
    new Promise((resolve) => {
      unsub = db
        .query('user', user.id)
        .include('status', 'currentToken')
        .subscribe((res) => {
          const user = res.toObject()
          if (
            user &&
            user.status === 'clear' &&
            user.currentToken === emailToken
          ) {
            resolve(user)
          }
        })
    }),
  ])

  unsub()

  if (!loggedIn) {
    throw new Error('email token exceeded')
  }

  await based.renewAuthState(ctx, {
    persistent: true,
    userId: user.id,
    token: sign(
      { userId: user.id, expiresAt: Date.now() + USER_TOKEN_EXPIRY },
      privateKey,
    ),
  })
}

export default login
