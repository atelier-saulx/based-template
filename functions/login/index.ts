import { DbClient } from '@based/db'
import { type BasedFunction } from '@based/functions'
import { sign } from '@saulx/crypto'
import { hashPassword } from '../utils'

const USER_TOKEN_EXPIRY = 604_800_000

const fn: BasedFunction = async (based, payload, ctx) => {
  const db = based.db.v2 as DbClient

  let { email, password } = payload || {}

  if (!email || !password) {
    throw new Error('Invalid payload')
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Invalid payload')
  }

  // TODO: Add this once local based:secret is implemented
  // const privateKey = await getSecret('login_token_key')

  email = email.trim().toLowerCase()

  const user = await db
    .query('user', { email })
    .include('password')
    .get()
    .toObject()

  if (!user?.id) {
    console.info(`User ${email} is inactive or non existant, cannot login`)
    throw new Error('Not allowed')
  }

  const digest = hashPassword(password)
  // const digest = db.schema?.types?.user.props.password.transform?.(
  //   'update',
  //   password,
  // )

  if (user.password === digest) {
    await based.renewAuthState(ctx, {
      persistent: true,
      userId: user.id,
      token: 'mynicesecret',
      // TODO:
      // token: sign(
      //   { userId: user.id, expiresAt: Date.now() + USER_TOKEN_EXPIRY },
      //   privateKey,
      // ),
    })
  }
}

export default fn
