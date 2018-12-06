import axios from 'axios'
import Vue from 'vue'
export const AxiosForm = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

const AxiosFormProperty = {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$httpform', { value: AxiosForm })
  }
}
Vue.use(AxiosFormProperty)
