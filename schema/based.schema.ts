import type { Schema } from '@based/schema'
import { user } from './user'
import { vote } from './vote'
import { contestant } from './contestant'
import { file } from './file'

const schema: Schema = {
  locales: {
    en: {},
  },
  types: {
    user,
    vote,
    contestant,
    file,
  },
}

export default schema
