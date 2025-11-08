import { isWsContext, type BasedFunction } from '@based/sdk/functions'
import { type } from 'arktype'
import { inspect } from 'util'
import { createHash } from 'crypto'
import { decodeAttestationObject, type AttestationObject } from '../utils'

const passkeysRegisterPayload = type({
  id: 'string < 250',
  rawId: 'string < 250',
  type: 'string < 50',
  attestationObject: 'string < 1024',
  clientDataJSON: 'string < 1024',
})

const fn: BasedFunction = async (based, payload, ctx) => {
  if (!isWsContext(ctx)) {
    return null
  }

  const db = based.db

  const validate = passkeysRegisterPayload(payload)
  if (validate instanceof type.errors) {
    console.error(validate.summary) // remove in production
    throw new Error('Invalid payload')
  }

  const userId = ctx.session?.authState?.userId
  if (!userId) {
    throw new Error('no user')
  }

  // console.log(payload)

  const { clientDataJSON, attestationObject, id } = payload

  try {
    const clientData = JSON.parse(
      Buffer.from(clientDataJSON, 'base64').toString(),
    )

    const decodedAttestationObject = decodeAttestationObject(
      Buffer.from(attestationObject, 'base64'),
    )
    // console.log(
    //   inspect({ clientData, decodedAttestationObject }, { depth: null }),
    // )

    if (clientData.type !== 'webauthn.create') {
      throw new Error('Invalid client data type:', clientData.type)
    }

    const storedChallenge = await db
      .query('passkeyChallenge', { challenge: clientData.challenge })
      .include('user.id')
      .get()
      .toObject()

    if (!storedChallenge) {
      throw new Error('Challenge not found or expired')
    }

    // console.log({ storedChallenge, userId })
    if (storedChallenge.user?.id !== userId) {
      throw new Error('Challenge does not belong to this user')
    }

    await db.delete('passkeyChallenge', storedChallenge.id)

    const rpId =
      process.env.DOMAIN ||
      process.env.BASED_DEV_SERVER_LOCAL_URL?.split('//')[1].split(':')[0]
    if (!rpId) throw new Error('Invalid domain configuration')

    let [protocol, clientDomain] = clientData.origin.split('://')
    clientDomain = clientDomain.split(':')[0]

    // console.log({ protocol, clientDomain, rpId, clientData })
    if (clientDomain !== rpId)
      throw new Error('Invalid origin:', clientData.origin)
    if (rpId !== 'localhost' && protocol === 'http')
      throw new Error('Invalid protocol:', clientData.origin)

    const expectedRpIdHash = createHash('sha256').update(rpId).digest('hex')

    if (!('authData' in decodedAttestationObject))
      throw new Error('No authData in attestation object')

    const attestationObj = decodedAttestationObject as AttestationObject
    const { authData } = attestationObj
    if (authData.rpIdHash !== expectedRpIdHash)
      throw new Error('RP ID hash mismatch')

    if (!authData.flags.userPresent) throw new Error('User not present')

    if (!authData.attestedCredentialData)
      throw new Error('No attested credential data')

    const publicKey = authData.attestedCredentialData.credentialPublicKey
    const signCount = authData.signCount
    const aaguid = authData.attestedCredentialData.aaguid
    const backupEligible = authData.flags.backupEligible
    const backupState = authData.flags.backupState

    db.create('passkey', {
      credentialId: id,
      publicKey,
      signCount,
      aaguid,
      user: userId,
      backupEligible,
      backupState,
    })
  } catch (error) {
    console.error(error)
    return { ok: false, error: 'Verification failed' }
  }

  return { ok: true }
}
export default fn
