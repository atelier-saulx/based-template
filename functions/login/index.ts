import { DbClient } from '@based/db'
import { type BasedFunction } from '@based/functions'
import { sign } from '@saulx/crypto'

const USER_TOKEN_EXPIRY = 604_800_000

const SAMPLE_RSA_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAx8K8vDHmcqRxAQgJ5TKdJPrAKBmJzJkonEJ7hVmJEpMJOkCt
YT6xLqAiXhMJ0DU3ORh3WVRbJRU9Qz8YvRvwHYQr5HgbfBXHVbsT3OFrGGZwlO/v
Ua2ftqNpL6qZ1v1QrYzkl2ZB2vvM8m3La5ofYlOqlU4J3sCpDPJxOBfXwCP8VKpH
yCdDUcfrcVu9bevXakz+iaOvHh1GrLq6moRqNF7bgP5VpZiobL2zq4FOtFLygdED
oBtVPTGjjsoCn1W0sj3fWsTdmJTmYh36pZ/GrmvQ2hBQzxhP6YFnMhQD7ksIrhKE
VJi8K9WrFQdGrmP6LQzzXMxkTjdMz8DrVXlHBQIDAQABAoIBAEKuTcz1e0o31B0j
yGfeAamJuCQ7A2qRnBL6dCBLQuOlcU1MFWJjQFgXJNPfox2HQ0yH5Y8kCdxWL3DV
d1LGEqaQ8nCHg3h3HNnHlwA7eOmZBrI7CXRBqrMky4UH7LBMVmGxJQVJWVV8Lvkf
W7ovYzD0CtFnGGT8huHBpLBJfqrGvQQYvmCrr9FYVOjzDoQeLVFiXbnsFcTcJn5l
pKz0xCMDLjPLBp8wOdj7YsXvAiXDvRqH7q7W2q0DcDkLQPkrr7xHlmFEThE2YTXE
zOY1Qfbz0tlWbEhVMK7NAKkeZphWDvoYHJixB5hnWKJUkfx7Tu0V8wHvKdmPJJ0L
0tOMWAECgYEA+NaQ9H3LhtVP4rKMADZKL1mPH2OqJQcjeLtVywqfb5CYH8LhGRQu
W/7lXZaC0rSPHDLHpWKGELsfLLUdJamnXdJkh5q2kVdHKWylaECAzYPgGOnqvQJN
RJA0xV1vIDON5a0wqrG1BRsWrC9qz+HDgZaGGF1YXPEk8M+j7OyCsQUCgYEAzY/L
WKW4wKTgJT6vWOLqq3Q0qQL4KfGJb7BKnGpZGPxDKVLiMQBgDnFBYvHv8aSIjxLF
RBQQq5/U3fJYiVGBnKlJjZJDJ4jWbrbfuWLwhLMa8T3XqxvqYfcCcMbh5qKwODYJ
5zl7xJqwKuqQH5nQqR+6YYJUDwJMQQgLKHKP3gECgYEAhQ5HYLmHPBLvx7KJYfrb
dZjJMfUYW1KQ8hqQxHNqB3bqBkX0EbvhiY8xVYm3J6lVOdJMfqJZcLB+7AMTXSGK
4E2CSnHBT+VGR9a4Zk9PuWvN1wKSJ9EkcvfJR0l7cMrNDqAzQNpIH1BmkCcqX8pw
4KJIxdGpH0hQQRkJ0B7l9H0CgYEAyXQB3JNz3aEhmKGKmLNQQFWQnKQ3mfn7/YJa
G6xfvVFDBXjVRvPJFJvGLjJHB7TnQ0pBZHKNz7mjVxq3xGotBa3F2Y3h2TchKNaE
aGRW0Dn9IrNl/Qfh7DqCd+lTBLPJJLXWf3VC+fQh7mQVJQqLKmG8xYQ0ixBB7Jvh
BcEBAoGAEIc0M1hHatwNDv4FGCMqaVycDdvXHR/b1fqHYrV5HeXjxviXqY8B9Ien
YVQJO0uMJYtyqNq/m3B8KRfKPqVsJQ5nO2sHSYvGfpHYJvUXPEhB9n8w5FtQN1BP
uxf7aW3TtQF0b6G5n7w1jzFBKkGnZBRpHM3qVsPvMQ3oVKYKc8w=
-----END RSA PRIVATE KEY-----`

const fn: BasedFunction = async (based, payload, ctx) => {
  const db = based.db.v2 as DbClient

  let { email, password } = payload || {}

  if (!email || !password) {
    throw new Error('Invalid payload')
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Invalid payload')
  }

  const privateKey = SAMPLE_RSA_PRIVATE_KEY

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

  const digest = db.schema?.types?.user.props.password.transform?.(
    'update',
    password,
  )

  if (user.password === digest) {
    await based.renewAuthState(ctx, {
      persistent: true,
      userId: user.id,
      token: sign(
        { userId: user.id, expiresAt: Date.now() + USER_TOKEN_EXPIRY },
        privateKey,
      ),
    })
  }
}

export default fn
