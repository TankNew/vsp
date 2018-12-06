import tools from './tools'
import { setCurrentUserToLocalStorage, setMac, unsetCurrentUser } from './auth'
import { AxiosForm } from '../plugins/AxiosForm'
import router from '../router'
export const userLogin = ({ UserDomain, UserName, UserPass, SessionId }) => {
  let url = tools.kefuUrl + 'login'
  AxiosForm.post(url, {
    domain: UserDomain,
    username: UserName,
    password: UserPass,
    sessionid: SessionId
  })
    .then(function(response) {
      var json = response.data
      if (json.error === 0) {
        let user = {
          UserDomain: UserDomain,
          UserName: UserName,
          NickName: json.nickname,
          HeadImg: json.headimage,
          UserSign: json.sign
        }
        setCurrentUserToLocalStorage(user)
        setMac(SessionId)
        router.replace('/home')
      } else console.error(json.content)
    })
    .catch(function(error) {
      console.error(error)
    })
}

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`

export const logout = () => {
  unsetCurrentUser()
  router.replace('/')
}
