import type { Authorize } from '@based/functions'

const authorize: Authorize = async (_based, _ctx, _name, _payload) => {
  // You can perform any kind of validation to determine
  // whether the user is allowed to execute the function.
  return true
}

export default authorize
