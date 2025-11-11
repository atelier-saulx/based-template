import type { BasedQueryFunction } from '@based/functions'
import { type } from 'arktype'
import { getIdTokenSecret } from '../auth/utils/getIdTokenSecret'
import { verifyIdToken } from '../auth/utils/idToken'

export type User = {
  id: number
  name: string
  email: string
  role: string
  status: string
  picture: string
  passkeys: {
    id: number
  }[]
  passkeysReminder: number
}

const userPayload = type({
  token: 'string < 100',
})

const fn: BasedQueryFunction<
  {
    token: string
  },
  User
> = async (based, payload, update) => {
  const db = based.db

  const validate = userPayload(payload)
  if (validate instanceof type.errors) {
    console.error(validate.summary) // remove in production
    throw new Error('Invalid arguments')
  }
  const { token } = payload

  const idTokenSecret = await getIdTokenSecret(based)
  const { id: userSessionId } = verifyIdToken(token, idTokenSecret)

  const userSession = await db
    .query('userSession', userSessionId)
    .include('user.id')
    .get()
    .toObject()
  if (!userSession?.user.id) {
    throw new Error('Invalid session')
  }

  return db
    .query('user', userSession.user.id)
    .include(
      'name',
      'email',
      'role',
      'picture',
      'passkeys.id',
      'passkeysReminder',
    )
    .subscribe((res) => {
      update(res.toObject(), res.checksum)
    })
}

export default fn
