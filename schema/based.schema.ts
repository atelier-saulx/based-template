import type { Schema } from '@based/schema'
import { user } from './user'
import { vote } from './vote'
import { contestant } from './contestant'
import { file } from './file'
import { userSession } from './userSession'
import { passkeyChallenge } from './passkeyChallenge'
import { passkey } from './passkey'

const schema: Schema = {
  locales: {
    en: {},
  },
  types: {
    user,
    userSession,
    passkeyChallenge,
    passkey,
    vote,
    contestant,
    file,
  },
}

export default schema
