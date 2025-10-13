import type { BasedQueryFunction } from '@based/functions'
import { verifyIdToken } from '../auth/utils/idToken'
import { getIdTokenSecret } from '../auth/utils/getIdTokenSecret'

export type User = {
  id: number
  name: string
  email: string
  role: ['admin', 'viewer']
  picture?: string
  followMe?: Record<string, any>
  // createdAt: number
  updatedAt: number
}

const fn: BasedQueryFunction<
  {
    token: string
    includeAll?: boolean
  },
  {
    all?: User[]
    me: User | null
  }
> = async (based, payload, update) => {
  const db = based.db
  const { token, includeAll = true } = payload || {}

  if (!token) {
    throw new Error('No token in payload')
  }

  let all: User[] = []
  let me: User | null = null

  const idTokenSecret = await getIdTokenSecret(based)
  const { id: currentSessionId } = verifyIdToken(token, idTokenSecret)
  const currentSession = await db
    .query('userSession', currentSessionId)
    .include('user.role')
    .get()
    .toObject()
  if (!currentSession?.user?.id) {
    throw new Error('Not allowed')
  }

  const closeMe = db
    .query('user', currentSession?.user?.id)
    .include('name', 'email', 'role', 'picture', 'followMe')
    .subscribe((res) => {
      me = res.toObject()
      multiUpdate()
    })

  let closeAll: any
  if (currentSession.user.role === 'admin' && includeAll) {
    closeAll = db
      .query('user')
      .include(
        'id',
        'name',
        'email',
        'role',
        'picture',
        'followMe',
        'updatedAt',
      )
      .filter('id', '!=', currentSession?.user?.id)
      .filter('updatedAt', '>', 'now - 5m')
      .subscribe((res) => {
        all = (res.toObject() || []).filter((user: User) => user.followMe?.hash)
        multiUpdate()
      })
  }

  const multiUpdate = () => {
    update({
      me,
      all,
    })
  }

  return () => {
    if (me?.id) {
      db.update('user', me.id, {
        followMe: {},
      })
    }
    closeMe()
    closeAll && closeAll()
  }
}

export default fn
