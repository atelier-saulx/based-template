import { DbClient } from '@based/db'
import { isHttpContext, type BasedFunction } from '@based/functions'
import { HTMLTemplate } from './template'

type Payload = {
  token: string
}

const fn: BasedFunction<Payload> = async (based, payload, ctx) => {
  const db = based.db.v2 as DbClient

  let token = payload?.token

  if (typeof token !== 'string') {
    throw new Error('Invalid token')
  }

  try {
    const magicLinkSession = await db
      .query('userSession', { token })
      .include('user.email', 'ip')
      .get()
      .toObject()

    if (!magicLinkSession?.id) {
      throw new Error('Invalid or expired token')
    }

    // if (isHttpContext(ctx) && ctx.session?.ip) {
    //   if (magicLinkSession.ip && magicLinkSession.ip !== ctx.session?.ip) {
    //     console.error(
    //       `User ${magicLinkSession.user?.email} tried to login with a different IP. \nOriginal: ${magicLinkSession.ip}, new: ${ctx.session?.ip}`,
    //     )
    //     throw new Error('NETWORK_DOES_NOT_MATCH')
    //   }
    // }

    db.update('userSession', magicLinkSession.id, {
      used: true,
    })

    return HTMLTemplate(
      'Login succesful',
      'Login succesful',
      'You can now close this window and return to your original session.',
    )
  } catch (error) {
    // @ts-ignore
    if (error.message === 'NETWORK_DOES_NOT_MATCH') {
      return HTMLTemplate(
        'Login failed',
        'Network does not match',
        'Please click the login link from a device on the same network as the login tab.',
      )
    }
    return HTMLTemplate(
      'Login failed',
      'Invalid or expired token',
      'The confirmation token was invalid.',
    )
  }
}

export default fn
