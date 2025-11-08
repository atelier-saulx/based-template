type CborValue =
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

const parseAuthData = (buffer: Uint8Array): AuthData => {
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
    const credentialPublicKey = decodeAttestationObject(
      Buffer.from(credentialPublicKeyBuffer),
    ) as { [key: string]: CborValue }

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
  let offset = 0

  const readByte = (): number => {
    return buffer[offset++]
  }

  const readBytes = (length: number): Uint8Array => {
    const bytes = buffer.subarray(offset, offset + length)
    offset += length
    return bytes
  }

  const readUint = (length: number): number => {
    let value = 0
    for (let i = 0; i < length; i++) {
      value = value * 256 + readByte()
    }
    return value
  }

  const decodeValue = (): CborValue => {
    const byte = readByte()
    const majorType = byte >> 5
    const additionalInfo = byte & 0x1f

    const getLength = (): number => {
      if (additionalInfo < 24) {
        return additionalInfo
      }
      if (additionalInfo === 24) {
        return readByte()
      }
      if (additionalInfo === 25) {
        return readUint(2)
      }
      if (additionalInfo === 26) {
        return readUint(4)
      }
      if (additionalInfo === 27) {
        return readUint(8)
      }
      return 0
    }

    if (majorType === 0) {
      return getLength()
    }

    if (majorType === 1) {
      return -1 - getLength()
    }

    if (majorType === 2) {
      const length = getLength()
      return readBytes(length)
    }

    if (majorType === 3) {
      const length = getLength()
      const bytes = readBytes(length)
      return Buffer.from(bytes).toString('utf8')
    }

    if (majorType === 4) {
      const length = getLength()
      const array: CborValue[] = []
      for (let i = 0; i < length; i++) {
        array.push(decodeValue())
      }
      return array
    }

    if (majorType === 5) {
      const length = getLength()
      const map: { [key: string]: CborValue } = {}
      for (let i = 0; i < length; i++) {
        const key = decodeValue()
        const value = decodeValue()
        const keyStr = typeof key === 'string' ? key : String(key)
        map[keyStr] = value
      }
      return map
    }

    if (majorType === 7) {
      if (additionalInfo === 20) {
        return false
      }
      if (additionalInfo === 21) {
        return true
      }
      if (additionalInfo === 22) {
        return null
      }
      if (additionalInfo === 23) {
        return undefined
      }
    }

    throw new Error(`Unsupported CBOR type: ${majorType}`)
  }

  const result = decodeValue()
  if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
    const obj = result as { [key: string]: CborValue }

    if (obj.authData && obj.authData instanceof Uint8Array) {
      return {
        fmt: obj.fmt as string,
        attStmt: obj.attStmt as { [key: string]: CborValue },
        authData: parseAuthData(obj.authData),
      }
    }

    return obj
  }

  throw new Error('Attestation object must be a CBOR map')
}
