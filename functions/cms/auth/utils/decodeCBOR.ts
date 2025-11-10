type CborValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Uint8Array
  | CborValue[]
  | { [key: string]: CborValue }

export const decodeCBOR = (buffer: Uint8Array): CborValue => {
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

  return decodeValue()
}
