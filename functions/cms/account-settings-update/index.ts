import { type BasedFunction } from '@based/functions'
import { getIdTokenSecret } from '../auth/utils/getIdTokenSecret'
import { verifyIdToken } from '../auth/utils/idToken'
import { type } from 'arktype'

const accountSettingsUpdatePayload = type({
  'name?': 'string < 1024',
  'picture?': 'string < 1024',
  'status?': '"active"',
  'logout?': '"all" | number.integer',
  'passkeysReminder?': 'number.epoch',
  'removePasskey?': '"all" | number.integer',
})

const fn: BasedFunction<typeof accountSettingsUpdatePayload.infer> = async (
  based,
  payload,
  ctx,
) => {
  const db = based.db

  const validate = accountSettingsUpdatePayload(payload)
  if (validate instanceof type.errors) {
    console.error(validate.summary) // remove in production
    throw new Error('Invalid arguments')
  }

  const { token, userId } = ctx.session?.authState || {}

  if (!userId || !token) {
    throw new Error('Not allowed')
  }
  const idTokenSecret = await getIdTokenSecret(based)
  const { id: userSessionId } = verifyIdToken(token, idTokenSecret)

  const currentSession: {
    user: {
      id: number
      sessions: {
        id: number
      }[]
      passkeys: {
        id: number
      }[]
    }
  } | null = await db
    .query('userSession', userSessionId)
    .include('user.id', 'user.sessions.id', 'user.passkeys.id')
    .get()
    .toObject()
  if (!currentSession || currentSession.user?.id !== Number(userId)) {
    throw new Error('Not allowed')
  }

  const { name, picture, status, logout, passkeysReminder, removePasskey } =
    payload

  if (name) {
    db.update('user', currentSession.user.id, {
      name,
    })
  }

  if (typeof picture !== 'undefined') {
    db.update('user', currentSession.user.id, {
      picture,
    })
  }

  if (status === 'active') {
    db.update('user', currentSession.user.id, {
      status,
    })
  }

  if (typeof passkeysReminder !== 'undefined') {
    db.update('user', currentSession.user.id, {
      passkeysReminder,
    })
  }

  if (logout) {
    if (logout === 'all' && currentSession.user.sessions?.length) {
      const sessionsToDelete = currentSession.user.sessions.filter(
        (session) => session.id !== userSessionId,
      )
      await Promise.all([
        sessionsToDelete.map((session) => db.delete('userSession', session.id)),
      ])
    } else if (typeof logout === 'number') {
      if (
        !currentSession.user.sessions.find((session) => session.id === logout)
      ) {
        throw new Error('Not allowed')
      }
      await db.delete('userSession', logout)
    } else {
      throw new Error('Invalid input')
    }
  }

  if (removePasskey) {
    if (removePasskey === 'all' && currentSession.user.passkeys?.length) {
      await Promise.all([
        currentSession.user.passkeys.map((passkey) =>
          db.delete('passkey', passkey.id),
        ),
      ])
    } else if (typeof removePasskey === 'number') {
      if (
        !currentSession.user.passkeys.find(
          (passkey) => passkey.id === removePasskey,
        )
      ) {
        throw new Error('Not allowed')
      }
      await db.delete('passkey', removePasskey)
    } else {
      throw new Error('Invalid input')
    }
  }

  return { ok: true }
}

export default fn
