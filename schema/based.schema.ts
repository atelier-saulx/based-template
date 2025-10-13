import type { Schema } from '@based/schema'
import { user } from './user'
import { vote } from './vote'
import { contestant } from './contestant'
import { file } from './file'
import { userSession } from './userSession'

const schema: Schema = {
  locales: {
    en: {},
  },
  types: {
    user,
    userSession,
    vote,
    contestant,
    file,
  },
}

export default schema
