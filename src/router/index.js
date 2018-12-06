import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Index from '@/components/index'
import Setting from '@/components/home/setting'
import ControlPanel from '@/components/home/control-panel'
import ChatList from '@/components/home/control-panel/chat-list'
import Online from '@/components/home/control-panel/online'
import Waitting from '@/components/home/control-panel/waitting'
 

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: { auth: true },
      children: [
        {
          path: 'setting',
          name: 'Setting',
          component: Setting
        },
        {
          path: 'control-panel',
          name: 'ControlPanel',
          component: ControlPanel,
          children: [
            {
              path: 'chat-list',
              name: 'ChatList',
              component: ChatList
            },
            {
              path: 'online',
              name: 'Online',
              component: Online
            },
            {
              path: 'waitting',
              name: 'Waitting',
              component: Waitting
            }  
          ]
        }
      ]
    },
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    }
  ]
})
