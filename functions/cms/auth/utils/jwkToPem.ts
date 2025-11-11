import type { JWK } from 'schema/passkey'

export const jwkToPem = (jwk: JWK): string => {
  if (jwk.kty === 'OKP') {
    const x = Buffer.from(jwk.x!, 'base64url')

    const oid =
      jwk.crv === 'Ed25519'
        ? Buffer.from([0x2b, 0x65, 0x70])
        : Buffer.from([0x2b, 0x65, 0x71])

    const der = Buffer.concat([
      Buffer.from([0x30, 0x2a, 0x30, 0x05, 0x06, 0x03]),
      oid,
      Buffer.from([0x03, 0x21, 0x00]),
      x,
    ])

    return `-----BEGIN PUBLIC KEY-----\n${der.toString('base64')}\n-----END PUBLIC KEY-----`
  }

  if (jwk.kty === 'EC') {
    const x = Buffer.from(jwk.x!, 'base64url')
    const y = Buffer.from(jwk.y!, 'base64url')
    const publicKeyDer = Buffer.concat([Buffer.from([0x04]), x, y])

    const oid =
      jwk.crv === 'P-256'
        ? Buffer.from([0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07])
        : Buffer.from([0x2b, 0x81, 0x04, 0x00, 0x22])

    const der = Buffer.concat([
      Buffer.from([
        0x30, 0x59, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02,
        0x01, 0x06, 0x08,
      ]),
      oid,
      Buffer.from([0x03, 0x42, 0x00]),
      publicKeyDer,
    ])

    return `-----BEGIN PUBLIC KEY-----\n${der.toString('base64')}\n-----END PUBLIC KEY-----`
  }

  if (jwk.kty === 'RSA') {
    const n = Buffer.from(jwk.n!, 'base64url')
    const e = Buffer.from(jwk.e!, 'base64url')

    const encodeLength = (len: number): Buffer => {
      if (len < 128) return Buffer.from([len])
      const bytes: number[] = []
      let temp = len
      while (temp > 0) {
        bytes.unshift(temp & 0xff)
        temp >>= 8
      }
      return Buffer.concat([
        Buffer.from([0x80 | bytes.length]),
        Buffer.from(bytes),
      ])
    }

    const encodeInteger = (buf: Buffer): Buffer => {
      const needsPadding = buf[0] & 0x80
      const length = encodeLength(buf.length + (needsPadding ? 1 : 0))
      return Buffer.concat([
        Buffer.from([0x02]),
        length,
        needsPadding ? Buffer.from([0x00]) : Buffer.alloc(0),
        buf,
      ])
    }

    const sequence = Buffer.concat([encodeInteger(n), encodeInteger(e)])
    const sequenceLength = encodeLength(sequence.length)
    const publicKeyDer = Buffer.concat([
      Buffer.from([0x30]),
      sequenceLength,
      sequence,
    ])

    const header = Buffer.from([
      0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01,
      0x01, 0x05, 0x00,
    ])

    const bitStringLength = encodeLength(publicKeyDer.length + 1)
    const der = Buffer.concat([
      Buffer.from([0x30]),
      encodeLength(
        header.length + 2 + bitStringLength.length + publicKeyDer.length + 1,
      ),
      header,
      Buffer.from([0x03]),
      bitStringLength,
      Buffer.from([0x00]),
      publicKeyDer,
    ])

    return `-----BEGIN PUBLIC KEY-----\n${der.toString('base64')}\n-----END PUBLIC KEY-----`
  }

  throw new Error(`Unsupported key type: ${jwk.kty}`)
}
