import { JWK } from 'schema/passkey'
import { decodeCBOR } from './decodeCBOR'

export type CborValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Uint8Array
  | CborValue[]
  | { [key: string]: CborValue }

export type AuthData = {
  rpIdHash: string
  flags: {
    userPresent: boolean
    userVerified: boolean
    backupEligible: boolean
    backupState: boolean
    attestedCredentialData: boolean
    extensionDataIncluded: boolean
  }
  signCount: number
  attestedCredentialData?: {
    aaguid: string
    credentialIdLength: number
    credentialId: string
    credentialPublicKey: { [key: string]: CborValue }
  }
}

export type AttestationObject = {
  fmt: string
  attStmt: { [key: string]: CborValue }
  authData: AuthData
}

export const decodeAuthenticatorData = (buffer: Uint8Array): AuthData => {
  let offset = 0

  const rpIdHash = Buffer.from(buffer.subarray(offset, offset + 32)).toString(
    'hex',
  )
  offset += 32

  const flagsByte = buffer[offset++]
  const flags = {
    userPresent: !!(flagsByte & 0x01),
    userVerified: !!(flagsByte & 0x04),
    backupEligible: !!(flagsByte & 0x08),
    backupState: !!(flagsByte & 0x10),
    attestedCredentialData: !!(flagsByte & 0x40),
    extensionDataIncluded: !!(flagsByte & 0x80),
  }

  const signCount =
    (buffer[offset] << 24) |
    (buffer[offset + 1] << 16) |
    (buffer[offset + 2] << 8) |
    buffer[offset + 3]
  offset += 4

  const result: AuthData = {
    rpIdHash,
    flags,
    signCount,
  }

  if (flags.attestedCredentialData) {
    const aaguid = Buffer.from(buffer.subarray(offset, offset + 16)).toString(
      'hex',
    )
    offset += 16

    const credentialIdLength = (buffer[offset] << 8) | buffer[offset + 1]
    offset += 2

    const credentialId = Buffer.from(
      buffer.subarray(offset, offset + credentialIdLength),
    ).toString('hex')
    offset += credentialIdLength

    const credentialPublicKeyBuffer = buffer.subarray(offset)
    const credentialPublicKey = decodeCBOR(credentialPublicKeyBuffer) as {
      [key: string]: CborValue
    }

    result.attestedCredentialData = {
      aaguid,
      credentialIdLength,
      credentialId,
      credentialPublicKey,
    }
  }

  return result
}

export const decodeAttestationObject = (
  buffer: Buffer,
): AttestationObject | { [key: string]: CborValue } => {
  const result = decodeCBOR(buffer)

  if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
    const obj = result as { [key: string]: CborValue }

    if (obj.authData && obj.authData instanceof Uint8Array) {
      return {
        fmt: obj.fmt as string,
        attStmt: obj.attStmt as { [key: string]: CborValue },
        authData: decodeAuthenticatorData(obj.authData),
      }
    }

    return obj
  }

  throw new Error('Attestation object must be a CBOR map')
}

export const convertPublicKeyToJWK = (coseKey: {
  [key: string]: CborValue
}): JWK => {
  const kty = coseKey['1']

  if (kty === 1) {
    const crv = coseKey['-1']
    const x = coseKey['-2']

    if (!(x instanceof Uint8Array)) {
      throw new Error('Invalid OKP key parameters')
    }

    const crvName = crv === 6 ? 'Ed25519' : crv === 7 ? 'Ed448' : 'unknown'

    return {
      kty: 'OKP',
      crv: crvName,
      x: Buffer.from(x).toString('base64url'),
    }
  }

  if (kty === 2) {
    const crv = coseKey['-1']
    const x = coseKey['-2']
    const y = coseKey['-3']

    if (!(x instanceof Uint8Array) || !(y instanceof Uint8Array)) {
      throw new Error('Invalid EC2 key coordinates')
    }

    const crvName = crv === 1 ? 'P-256' : crv === 2 ? 'P-384' : 'P-521'

    return {
      kty: 'EC',
      crv: crvName,
      x: Buffer.from(x).toString('base64url'),
      y: Buffer.from(y).toString('base64url'),
    }
  }

  if (kty === 3) {
    const n = coseKey['-1']
    const e = coseKey['-2']

    if (!(n instanceof Uint8Array) || !(e instanceof Uint8Array)) {
      throw new Error('Invalid RSA key parameters')
    }

    return {
      kty: 'RSA',
      n: Buffer.from(n).toString('base64url'),
      e: Buffer.from(e).toString('base64url'),
    }
  }

  throw new Error(`Unsupported key type: ${kty}`)
}
