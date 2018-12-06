import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'
const getQueryParams = () => {
  const params = {}
  window.location.href.replace(
    /([^(?|#)=&]+)(=([^&]*))?/g,
    ($0, $1, $2, $3) => {
      params[$1] = $3
    }
  )
  return params
}

export const extractInfoFromHash = () => {
  if (process.SERVER_BUILD) return
  // eslint-disable-next-line camelcase
  const { id_token, state } = getQueryParams()
  return {
    token: id_token,
    secret: state
  }
}
// 读取/写入 本地用户信息
export const getCurrentUserFromLocalStorage = () => {
  const json = window.localStorage.currentUser
  return json ? JSON.parse(json) : undefined
}

export const setCurrentUserToLocalStorage = user => {
  window.localStorage.setItem('currentUser', JSON.stringify(user))
}
export const unsetCurrentUser = () => {
  window.localStorage.removeItem('currentUser')
  window.localStorage.removeItem('mac')
  window.localStorage.setItem('logout', Date.now())
}

//读写本机MAC
export const getMac = () => {
  const mac = window.localStorage.mac
  return mac || undefined
}

export const setMac = mac => {
  window.localStorage.setItem('mac', mac)
}
// 预备更新后使用
export const setSecret = secret => window.localStorage.setItem('secret', secret)

export const checkSecret = secret => window.localStorage.secret === secret

export const setToken = token => {
  if (process.SERVER_BUILD) return
  window.localStorage.setItem('token', token)
  window.localStorage.setItem('user', JSON.stringify(jwtDecode(token)))
  Cookie.set('jwt', token)
}

export const unsetToken = () => {
  if (process.SERVER_BUILD) return
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('secret')
  Cookie.remove('jwt')
  window.localStorage.setItem('logout', Date.now())
}

export const getUserFromCookie = req => {
  if (!req.headers.cookie) return
  const jwtCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith('jwt='))
  if (!jwtCookie) return
  const jwt = jwtCookie.split('=')[1]
  return jwtDecode(jwt)
}
