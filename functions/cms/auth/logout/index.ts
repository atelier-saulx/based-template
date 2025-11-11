import { isWsContext, type BasedFunction } from '@based/functions'

const fn: BasedFunction = async (based, payload, ctx) => {
  if (!isWsContext(ctx)) {
    return null
  }
  const db = based.db

  const sessionTokenId = ctx.session?.state?.userSession?.id

  if (!sessionTokenId) {
    console.error('No sessionTokenId')
    return null
  }

  db.delete('userSession', sessionTokenId)

  if (ctx.session?.state?.sessionTokenId) {
    ctx.session.state.userSession = null
    ctx.session.state.lastHandledExpire = null
  }

  return
}

export default fn
