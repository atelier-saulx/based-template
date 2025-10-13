import {
  BasedFunctionClient,
  Context,
  WebSocketSession,
} from '@based/sdk/functions'

export const getIpInfo = (
  based: BasedFunctionClient,
  ctx: Context<WebSocketSession>,
) => {
  let ip: string | undefined
  let userAgent: string | undefined
  let geo: string | undefined
  if (ctx.session?.ip) {
    ip = ctx.session.ip
    userAgent = ctx.session.ua
    geo = based.geo(ctx).country
  }

  return { ip, userAgent, geo }
}
