import type { DbClient } from '@based/db'
import type { BasedQueryFunction } from '@based/functions'

export type User = {
  id: number
  name: string
  email: string
  role: 'admin' | 'viewer'
  status: 'active' | 'inactive'
  followMe?: Record<string, any>
  createdAt: number
  updatedAt: number
}

const fn: BasedQueryFunction<
  {
    id: number
    includeAll?: boolean
  },
  {
    all?: User[]
    me: User | null
  }
> = async (based, payload, update) => {
  const db = based.db.v2 as DbClient
  const { id, includeAll = true } = payload || {}

  if (!id) {
    throw new Error('No user ID in payload')
  }

  let all: User[] = []
  let me: User | null = null
  const fiveMinutes = 5 * 60 * 1000

  const close = db
    .query('user')
    .include('*')
    .subscribe((res) => {
      const result = res.toObject()
      all = []
      me = null

      for (const user of result) {
        if (user.id === id) {
          me = user
          continue
        }

        if (
          includeAll &&
          user.status === 'active' &&
          Object.keys(user.followMe || {}).length &&
          Date.now() - user.updatedAt < fiveMinutes
        ) {
          all.push(user)
        }
      }

      return update({ me, all }, res.checksum)
    })

  return () => {
    if (me?.id) {
      db.update('user', me.id, {
        followMe: {},
      })
    }

    close()
  }
}

export default fn
