import { type } from 'arktype'
import { isWsContext, type BasedFunction } from '@based/functions'
import { getIdTokenSecret } from '../utils/getIdTokenSecret'
import { signIdToken } from '../utils/idToken'
import { getIpInfo } from '../utils/getIpInfo'
import { userRoles } from 'schema/user'

const INVITE_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 7 // week

const convertEmailToName = (email: string) => {
  if (typeof email !== 'string' || !email.length) {
    return ''
  }
  return email
    .split('@')[0]
    .replace(/[0-9_.-]+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const inviteUserPayload = type({
  email: 'string.email',
  role: type.enumerated(...Object.values(userRoles)),
})

const fn: BasedFunction<typeof inviteUserPayload.infer> = async (
  based,
  payload,
  ctx,
) => {
  if (!isWsContext(ctx)) {
    return null
  }

  const validate = inviteUserPayload(payload)
  if (validate instanceof type.errors) {
    console.error(validate.summary) // remove in production
    throw new Error('Invalid payload')
  }

  const db = based.db

  const { email, role } = payload

  const existingUser = await db
    .query('user', { email })
    .include('sessions.sessionType')
    .get()
    .toObject()
  if (
    existingUser &&
    existingUser.sessions.find(
      (session: { sessionType: string }) => session.sessionType === 'invite',
    )
  ) {
    return { error: 'User already has an invite' }
  }

  const user = await db.create('user', {
    name: convertEmailToName(email),
    email,
    role,
    status: 'pending',
  })

  const { ip, userAgent, geo } = getIpInfo(based, ctx)

  const inviteLinkSessionId = await db.create('userSession', {
    sessionType: 'invite',
    user,
    ip,
    userAgent,
    geo,
  })

  const idTokenSecret = await getIdTokenSecret(based)
  const emailToken = signIdToken({ id: inviteLinkSessionId }, idTokenSecret)
  const domain =
    process.env.DOMAIN || process.env.BASED_DEV_SERVER_LOCAL_URL?.split('//')[1]
  const protocol =
    domain?.startsWith('192.168') || domain?.startsWith('localhost')
      ? 'http'
      : 'https'
  const callToAction = `${protocol}://${domain}/cms/auth?t=${emailToken}`
  db.expire('userSession', inviteLinkSessionId, INVITE_TOKEN_EXPIRY / 1000)
  await db.drain()
  await based.call('based:auth-email', {
    type: 'invite',
    email,
    appName: 'Winit CMS',
    callToAction,
  })

  return { ok: true }
}

export default fn
