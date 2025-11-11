import { isWsContext, type BasedFunction } from '@based/functions'

const fn: BasedFunction = async (based, payload, ctx) => {
  if (!isWsContext(ctx)) {
    return null
  }
  const db = based.db
  console.log('logging out')

  const sessionTokenId = ctx.session?.state?.sessionTokenId

  if (!sessionTokenId) {
    console.error('No sessionTokenId')
    return null
  }

  db.delete('userSession', sessionTokenId)

  if (ctx.session?.state?.sessionTokenId) {
    ctx.session.state.sessionTokenId = null
    ctx.session.state.lastHandledExpire = null
  }

  return
}

export default fn
