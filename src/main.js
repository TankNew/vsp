// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { getMac, getCurrentUserFromLocalStorage } from './utiltools/auth'
//使BootStrap-vue支持到IE11
import 'babel-polyfill'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './plugins/AxiosForm'
import './plugins/muse.config'
import './plugins/vee-validate'

import './assets/main.css'
import 'swiper/dist/css/swiper.css'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  const currentUser = getCurrentUserFromLocalStorage()
  store.commit('setUser', currentUser)
  const mac = getMac()
  store.commit('setMacAddress', mac)
  if (to.matched.some(m => m.meta.auth)) {
    // 对路由进行验证
    if (store.getters.isAuthenticated) {
      // 已经登陆
      next()
    } else {
      // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
      next({ path: '/', query: { Rurl: to.fullPath } })
    }
  } else {
    next()
  }
})

if (!window.localStorage) {
  alert(
    'This browser do not supports localStorage. Please change browser to ie 9.0 at least .'
  )
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
