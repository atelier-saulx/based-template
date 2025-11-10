import { describe, it, expect } from 'vitest'
import { decodeCBOR } from './decodeCBOR'

describe('decodeCBOR', () => {
  it('decodes positive integers', () => {
    expect(decodeCBOR(new Uint8Array([0x00]))).toBe(0)
    expect(decodeCBOR(new Uint8Array([0x01]))).toBe(1)
    expect(decodeCBOR(new Uint8Array([0x0a]))).toBe(10)
    expect(decodeCBOR(new Uint8Array([0x17]))).toBe(23)
    expect(decodeCBOR(new Uint8Array([0x18, 0x18]))).toBe(24)
    expect(decodeCBOR(new Uint8Array([0x18, 0x64]))).toBe(100)
    expect(decodeCBOR(new Uint8Array([0x19, 0x03, 0xe8]))).toBe(1000)
  })

  it('decodes negative integers', () => {
    expect(decodeCBOR(new Uint8Array([0x20]))).toBe(-1)
    expect(decodeCBOR(new Uint8Array([0x29]))).toBe(-10)
    expect(decodeCBOR(new Uint8Array([0x38, 0x63]))).toBe(-100)
  })

  it('decodes byte strings', () => {
    const result = decodeCBOR(new Uint8Array([0x44, 0x01, 0x02, 0x03, 0x04]))
    expect(result).toBeInstanceOf(Uint8Array)
    expect(Array.from(result as Uint8Array)).toEqual([1, 2, 3, 4])
  })

  it('decodes text strings', () => {
    expect(decodeCBOR(new Uint8Array([0x60]))).toBe('')
    expect(decodeCBOR(new Uint8Array([0x61, 0x61]))).toBe('a')
    expect(decodeCBOR(new Uint8Array([0x64, 0x49, 0x45, 0x54, 0x46]))).toBe(
      'IETF',
    )
  })

  it('decodes arrays', () => {
    expect(decodeCBOR(new Uint8Array([0x80]))).toEqual([])
    expect(decodeCBOR(new Uint8Array([0x83, 0x01, 0x02, 0x03]))).toEqual([
      1, 2, 3,
    ])
    expect(
      decodeCBOR(
        new Uint8Array([0x83, 0x01, 0x82, 0x02, 0x03, 0x82, 0x04, 0x05]),
      ),
    ).toEqual([1, [2, 3], [4, 5]])
  })

  it('decodes maps', () => {
    expect(decodeCBOR(new Uint8Array([0xa0]))).toEqual({})

    const mapResult = decodeCBOR(new Uint8Array([0xa2, 0x01, 0x02, 0x03, 0x04]))
    expect(mapResult).toEqual({ '1': 2, '3': 4 })
  })

  it('decodes maps with string keys', () => {
    const result = decodeCBOR(
      new Uint8Array([0xa2, 0x61, 0x61, 0x01, 0x61, 0x62, 0x82, 0x02, 0x03]),
    )
    expect(result).toEqual({ a: 1, b: [2, 3] })
  })

  it('decodes booleans', () => {
    expect(decodeCBOR(new Uint8Array([0xf4]))).toBe(false)
    expect(decodeCBOR(new Uint8Array([0xf5]))).toBe(true)
  })

  it('decodes null and undefined', () => {
    expect(decodeCBOR(new Uint8Array([0xf6]))).toBe(null)
    expect(decodeCBOR(new Uint8Array([0xf7]))).toBe(undefined)
  })

  it('decodes WebAuthn attestation object structure', () => {
    const attestationBuffer = new Uint8Array([
      0xa3,
      0x63,
      0x66,
      0x6d,
      0x74,
      0x64,
      0x6e,
      0x6f,
      0x6e,
      0x65,
      0x67,
      0x61,
      0x74,
      0x74,
      0x53,
      0x74,
      0x6d,
      0x74,
      0xa0,
      0x68,
      0x61,
      0x75,
      0x74,
      0x68,
      0x44,
      0x61,
      0x74,
      0x61,
      0x58,
      0x25,
      ...new Array(37).fill(0),
    ])

    const result = decodeCBOR(attestationBuffer)
    expect(result).toHaveProperty('fmt')
    expect(result).toHaveProperty('attStmt')
    expect(result).toHaveProperty('authData')
  })

  it('decodes COSE public key structure', () => {
    const coseKey = new Uint8Array([
      0xa5,
      0x01,
      0x02,
      0x03,
      0x26,
      0x20,
      0x01,
      0x21,
      0x58,
      0x20,
      ...new Array(32).fill(0),
      0x22,
      0x58,
      0x20,
      ...new Array(32).fill(0),
    ])

    const result = decodeCBOR(coseKey)
    expect(result).toHaveProperty('1')
    expect(result).toHaveProperty('3')
    expect(result).toHaveProperty('-1')
    expect(result).toHaveProperty('-2')
    expect(result).toHaveProperty('-3')
  })
})
