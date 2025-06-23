import type { BasedAuthorizeFunctionConfig } from '@based/functions'

const config: BasedAuthorizeFunctionConfig = {
  /************************************************************
   *                                                          *
   * For the 'type' of BasedFunctions you can have:           *
   *                                                          *
   * - 'app':       Deploys a frontend application.           *
   * - 'channel':   Keeps the connection open to receive data *
   *                from the server.                          *
   * - 'function':  Processes data.                           *
   * - 'job':       Schedules a function to run periodically. *
   * - 'query':     Fetches data from the database.           *
   * - 'stream':    Handles uploaded files.                    *
   * - 'authorize': Acts like a middleware to validate access *
   *                to other functions.                       *
   *                                                          *
   ************************************************************/
  type: 'authorize',
}

export default config
