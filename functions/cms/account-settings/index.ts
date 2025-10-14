import { BasedQueryFunction } from '@based/functions'
import { countryNames } from './countryNames'
import { getIdTokenSecret } from '../auth/utils/getIdTokenSecret'
import { verifyIdToken } from '../auth/utils/idToken'

const parseUserAgent = (
  userAgent: string,
): {
  device: 'desktop' | 'tablet' | 'mobile' | 'unknown'
  os: string
  browser: string
} => {
  if (typeof userAgent !== 'string' || userAgent.trim() === '') {
    return { device: 'unknown', os: 'Unknown', browser: 'Unknown' }
  }

  const mobileRegex =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i
  const tabletRegex =
    /(ipad|playbook|silk)|(hp|kindle|tablet|(windows( ce)?|opera) tablet)/i
  const simpleMobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

  let device: 'desktop' | 'tablet' | 'mobile' | 'unknown' = 'desktop'
  if (
    tabletRegex.test(userAgent) ||
    (simpleMobileRegex.test(userAgent) && !/iPad/i.test(userAgent))
  ) {
    device = 'tablet'
  } else if (mobileRegex.test(userAgent) || simpleMobileRegex.test(userAgent)) {
    device = 'mobile'
  }

  const osPatterns = [
    { name: 'Windows Phone', regex: /Windows Phone/ },
    { name: 'Windows', regex: /Windows NT ([0-9.]+)/ },
    { name: 'Android', regex: /Android ([0-9.]+)/ },
    { name: 'iOS', regex: /CPU OS ([0-9_]+) like Mac OS X/ },
    { name: 'Macintosh', regex: /Macintosh|Mac OS X/ },
    { name: 'Linux', regex: /Linux/ },
  ]

  const browserPatterns = [
    { name: 'Edge', regex: /EdgA?\/([0-9.]+)/ },
    { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
    { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
    { name: 'Safari', regex: /Version\/([0-9.]+).*Safari/ },
    { name: 'IE', regex: /MSIE ([0-9.]+)|Trident\/[7-9].*rv:([0-9.]+)/ },
  ]

  let os = 'Unknown'
  let browser = 'Unknown'

  for (const pattern of osPatterns) {
    if (pattern.regex.test(userAgent)) {
      os = pattern.name
      break
    }
  }

  for (const pattern of browserPatterns) {
    if (pattern.regex.test(userAgent)) {
      browser = pattern.name
      break
    }
  }

  return { device, os, browser }
}

type Payload = {
  token: string
}

type UserObject = {
  name: string
  email: string
  sessions: {
    id: number
    date: number
    device: 'desktop' | 'tablet' | 'mobile' | 'unknown'
    os: string
    browser: string
    country: string
    current?: boolean
  }[]
}

const fn: BasedQueryFunction<Payload, UserObject> = async (
  based,
  payload,
  update,
) => {
  const db = based.db

  const { token } = payload

  const idTokenSecret = await getIdTokenSecret(based)
  const { id: userSessionId } = verifyIdToken(token, idTokenSecret)

  return db
    .query('userSession', userSessionId)
    .include((a) => {
      a('user')
        .include('email', 'name', 'picture')
        .include((b) => {
          b('sessions')
            .include('sessionType', 'userAgent', 'geo', 'updatedAt')
            .filter('sessionType', '=', 'userSession')
            .sort('updatedAt', 'desc')
        })
    })
    .subscribe((res) => {
      const currentSession: {
        id: number
        user: {
          name: string
          email: string
          sessions: {
            id: number
            sessionType: 'userSession' | 'magicLink'
            userAgent: string
            geo: string
            updatedAt: number
          }[]
        }
      } = res.toObject()
      const user = currentSession.user || {}
      update({
        ...user,
        sessions: user.sessions.map((session) => ({
          id: session.id,
          date: session.updatedAt,
          ...parseUserAgent(session.userAgent),
          country: countryNames[session.geo] || 'Unknown',
          current: currentSession.id === session.id,
        })),
      })
    })
}

export default fn
