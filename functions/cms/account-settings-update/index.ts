import { type BasedFunction } from '@based/functions'
import { getIdTokenSecret } from '../auth/utils/getIdTokenSecret'
import { verifyIdToken } from '../auth/utils/idToken'

type Payload = {
  name?: string
  picture?: string
  status?: 'active'
  logout?: 'all' | number
}

const fn: BasedFunction<Payload> = async (based, payload, ctx) => {
  const db = based.db

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
    }
  } | null = await db
    .query('userSession', userSessionId)
    .include('user.id', 'user.sessions.id')
    .get()
    .toObject()
  if (!currentSession || currentSession.user?.id !== Number(userId)) {
    throw new Error('Not allowed')
  }

  const { name, picture, status, logout } = payload

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

  return { ok: true }
}

export default fn
