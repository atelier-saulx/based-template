import type { Schema } from '@based/schema'
import { user } from './user'
import { vote } from './vote'
import { contestant } from './contestant'

const schema: Schema = {
  locales: {
    en: {},
  },
  types: {
    user,
    vote,
    contestant,
  },
}

export default schema
