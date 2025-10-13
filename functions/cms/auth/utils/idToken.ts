import { createHmac, timingSafeEqual } from 'node:crypto'

const SIGNATURE_LENGTH = 32

export type TokenPayload = {
  id: number
  exp?: number
}

export const signIdToken = (payload: TokenPayload, secret: string): string => {
  const hasExp = payload.exp !== undefined
  const bufferSize = hasExp ? 12 : 4
  const buffer = Buffer.allocUnsafe(bufferSize)
  buffer.writeUInt32BE(payload.id, 0)

  if (hasExp) {
    buffer.writeBigUInt64BE(BigInt(payload.exp!), 4)
  }

  const hmac = createHmac('sha256', secret)
  hmac.update(buffer)
  const signature = hmac.digest()

  return Buffer.concat([signature, buffer]).toString('base64url')
}

export const verifyIdToken = (token: string, secret: string): TokenPayload => {
  const buffer = Buffer.from(token, 'base64url')

  if (
    buffer.length !== SIGNATURE_LENGTH + 12 &&
    buffer.length !== SIGNATURE_LENGTH + 4
  ) {
    throw new Error('Invalid token format')
  }

  const signature = buffer.subarray(0, SIGNATURE_LENGTH)
  const payloadBuffer = buffer.subarray(SIGNATURE_LENGTH)

  const hmac = createHmac('sha256', secret)
  hmac.update(payloadBuffer)
  const expectedSignature = hmac.digest()

  if (!timingSafeEqual(signature, expectedSignature)) {
    throw new Error('Invalid signature')
  }

  const id = payloadBuffer.readUInt32BE(0)

  if (payloadBuffer.length === 12) {
    const exp = Number(payloadBuffer.readBigUInt64BE(4))

    if (exp < Date.now()) {
      throw new Error('Token expired')
    }

    return { id, exp }
  }

  return { id }
}
