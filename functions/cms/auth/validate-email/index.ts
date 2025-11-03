import { type BasedFunction } from '@based/functions'
import { HTMLTemplate } from './template'
import { verifyIdToken } from '../utils/idToken'
import { getIdTokenSecret } from '../utils/getIdTokenSecret'

type Payload = {
  token: string
}

const fn: BasedFunction<Payload> = async (based, payload, ctx) => {
  const db = based.db

  let token = payload?.token

  if (typeof token !== 'string') {
    throw new Error('Invalid token')
  }

  try {
    const idTokenSecret = await getIdTokenSecret(based)
    const { id: magicLinkSessionId } = verifyIdToken(token, idTokenSecret)
    const magicLinkSession = await db
      .query('userSession', magicLinkSessionId)
      .include('user.email', 'ip', 'sessionType')
      .get()
      .toObject()

    if (
      !magicLinkSession?.id ||
      (magicLinkSession.sessionType !== 'magicLink' &&
        magicLinkSession.sessionType !== 'invite')
    ) {
      throw new Error('Invalid or expired token')
    }

    console.log({ magicLinkSession })

    // if (isHttpContext(ctx) && ctx.session?.ip) {
    //   if (magicLinkSession.ip && magicLinkSession.ip !== ctx.session?.ip) {
    //     console.error(
    //       `User ${magicLinkSession.user?.email} tried to login with a different IP. \nOriginal: ${magicLinkSession.ip}, new: ${ctx.session?.ip}`,
    //     )
    //     throw new Error('NETWORK_DOES_NOT_MATCH')
    //   }
    // }

    if (magicLinkSession.sessionType === 'magicLink') {
      db.update('userSession', magicLinkSessionId, {
        used: true,
      })

      return HTMLTemplate(
        'based-template CMS',
        'Login approved',
        'Login approved',
        'You are now logged in to Once CMS.<br />You can close this tab.',
      )
    } else if (magicLinkSession.sessionType === 'invite') {
      db.update('user', magicLinkSession.user.id, {
        status: 'onboarding',
      })
      db.delete('userSession', magicLinkSessionId)

      return HTMLTemplate(
        'based-template CMS',
        'Email confirmation successful',
        'Email confirmation successful',
        'You can now close this window and login to your app.',
      )
    }

    throw new Error('invalid session type')
  } catch (error) {
    console.log({ error })
    // @ts-ignore
    if (error.message === 'NETWORK_DOES_NOT_MATCH') {
      return HTMLTemplate(
        'Once CMS',
        'Login failed',
        'Network does not match',
        'Please click the login link from a device on the same network as the login tab.',
      )
    }
    return HTMLTemplate(
      'Once CMS',
      'Confirmation failed',
      'Invalid or expired token',
      'The confirmation token was invalid.',
    )
  }
}

export default fn
