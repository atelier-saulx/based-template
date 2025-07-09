import { Validators } from '.'

export const viewerValidators: Validators = {
  'active-users': (user, payload) => {
    return false
  },
  contestants: (user, payload) => {
    return true
  },
} as const
