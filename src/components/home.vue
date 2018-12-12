<template>
  <section class="control-panel">
    <slider ref="slider" :is-chat="isChat" :is-setting="isSetting" @onSlideEnd="onSlideEnd">
      <div slot="left">
        <span class="left-shrink-icon" @click="leftBarClose">
          <i class="fas fa-arrow-left"/>
        </span>
        <p class="lead mt-5">{{ companyInfo.name }}</p>
        <div class="user-panel mt-3">
          <div class="user-pic">
            <img class="img-responsive img-rounded mCS_img_loaded" src="@/assets/imgs/64.png" alt>
          </div>
          <div class="user-info">
            <span class="user-name">
              <strong>{{ kefuinfo.nickname }}</strong>
            </span>
            <span class="user-role">{{ kefuinfo.domain }}</span>
            <div class="user-status">
              <a href="javascript:void(0)">
                <span class="btn btn-success btn-sm" style="padding:0 0.2rem;">Online</span>
              </a>
            </div>
          </div>
        </div>
        <hr>
        <ul class="user-toolbar">
          <li>
            <a @click="setting">
              <i class="fas fa-cog mr-1"/>设置
            </a>
          </li>
          <li>
            <a @click="reConnect">
              <i class="fas fa-redo mr-1"/>重连
            </a>
          </li>
          <li>
            <a @click="logout">
              <i class="fas fa-sign-out-alt mr-1"/>退出登录
            </a>
          </li>
        </ul>
      </div>
      <div slot="content" class="h-100">
        <header>
          <div class="server-status">
            <span>
              <i class="fas fa-server text-success mr-1"/>
              服务器状态： {{ serverstatus }}
            </span>
            <span>
              <i class="fas fa-globe text-success mr-1"/>
              {{ kefuinfo.domain }}
            </span>
            <span>
              <i class="fab fa-creative-commons text-success mr-1"/>版本：1.0.0
            </span>
          </div>
          <div v-if="!isSetting" class="top_bg">
            <div class="logo">
              <img :src="kefuinfo.headimage" class="img-responsive" alt @click="leftBarChange">
            </div>
            <div class="top_title">{{ currentPage.name }}</div>
          </div>
          <div v-else class="top_bg">
            <div class="logo">
              <i class="fas fa-chevron-left" @click="back()"/>
            </div>
            <div class="top_title">{{ currentPage.name }}</div>
          </div>
        </header>
        <b-alert :show="dismissCountDown" variant="info" class="small system-info mb-0" dismissible fade @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged">
          <span class="system-info-text">
            <i class="fas fa-circle mr-1"/>
            <span class="system-info-text-content">{{ Event(systemInfoNew.code,systemInfoNew.username) }}</span>
          </span>
        </b-alert>
        <router-view
          ref="home"
          :is-setting="isSetting"
          :current-page="currentPage"
          :pages="pages"
          :mac-address="macAddress"
          :user-chat-tabs="userChatTabs"
          :user-hold="userHold"
          :kefu-list="kefuList"
          :user-watting="userWatting"
          @alertInfo="alertInfo"
          @alertError="alertError"
          @chatIn="chatIn"
          @setCurrentChat="setCurrentChat"
          @chatOut="chatOut"
          @reload="reload"
          @leftBarClose="leftBarClose"
          @changePage="changePage"
          @back="back"
        />
      </div>
      <div slot="right" class="h-100">
        <header>
          <div class="server-status">
            <span>
              <i class="fas fa-server text-success mr-1"/>
              服务器状态： {{ serverstatus }}
            </span>
            <span>
              <i class="fas fa-globe text-success mr-1"/>
              {{ kefuinfo.domain }}
            </span>
            <span>
              <i class="fab fa-creative-commons text-success mr-1"/>版本：1.0.0
            </span>
          </div>
          <div class="top_bg">
            <a @click="rightBack">
              <i class="fas fa-chevron-left mr-1"/>
            </a>
            <div class="top_title">与 {{ currentChat.username }} 对话中</div>
          </div>
        </header>
        <div class="w-100 h-100 position-relative">
          <scroll ref="scrollpanel" :data="currentChat.chats" :auto-scroll="true" class="message-box-wrapper">
            <div class="message-box-content">
              <ul v-if="currentChat" class="mbox">
                <li v-for="(chat,index) in currentChat.chats" :key="index" :class="chat.fromUser==kefuinfo.username?'replay':'receive'">
                  <div v-if="chat.fromUser==kefuinfo.username" class="headAndName">
                    <img :src="kefuinfo.headimage">
                  </div>
                  <div v-else class="headAndName">
                    <img :src="currentChat.headimage">
                  </div>
                  <p class="pointer">{{ chat.content }}</p>
                  <div class="clear"/>
                </li>
              </ul>
            </div>
          </scroll>
          <div class="text-center">
            <a class="btn btn-link btn-sm text-primary" @click="chatOut(currentChat,true)">结束当前对话</a>
          </div>
          <div class="message-box-tools">
            <div class="message-box-tools-input">
              <textarea v-model="message" class="form-control" rows="3" style="resize:none" @keydown.enter="chatSubmit(currentChat.username,$event)">输入内容</textarea>
            </div>
            <div class="message-box-tools-btn">
              <button type="button" class="btn btn-success px-1" @click="chatSubmit(currentChat.username,$event)">发 送</button>
            </div>
          </div>
        </div>
      </div>
    </slider>
  </section>
</template>
<script>
import scroll from '@/components/scroll'
import { mapGetters, mapMutations } from 'vuex'
import slider from '@/components/Slider'
import tools from '@/utiltools/tools'
import config from '~/config-lock.json'
import { logout } from '@/utiltools/lock'
var websocket = null
var sendnum = null
const visitorjson = {
  username: '',
  nickname: '',
  headimage: './static/imgs/visitor.png',
  chats: []
}

const systeminfo = {
  code: 100,
  username: '系统',
  time: ''
}
export default {
  name: 'Home',
  components: {
    slider,
    scroll: scroll
  },
  data: function() {
    return {
      dismissSecs: 3,
      dismissCountDown: 0,
      kefuinfo: {
        username: null,
        headimage: null,
        nickname: null,
        domain: null,
        sign: null,
        state: 1
      },
      companyInfo: {},
      serverstatus: '等待……',
      isCollapsed: false, //左侧菜单是否展开
      isSetting: false, //是否出于设置状态
      pages: [
        {
          name: '对话列表',
          url: '/home/control-panel/chat-list',
          icon: 'fa-comment',
          menu: true
        },
        {
          name: '等待访客',
          url: '/home/control-panel/waitting',
          icon: 'fa-user-friends',
          menu: true
        },
        {
          name: '在线客服',
          url: '/home/control-panel/online',
          icon: 'fa-user-clock',
          menu: true
        },
        {
          name: '设置',
          url: '/home/setting',
          menu: false
        }
      ],
      currentPage: {},
      currentChat: { chats: [] },
      isChat: false,
      userWatting: [],
      kefuList: [],
      systemInfo: [],
      systemInfoNew: {},
      count: 0, // 已经接入访客 0 - 5
      chatIndex: 0, // 处于焦点、已经接入
      userChatTabs: [], // 已经接入的访客列表
      userHold: [], // 未处于焦点、已经接入、接收到新消息,
      message: ''
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser', 'macAddress']),
    ...mapGetters({ currentPath: 'currentPath' })
  },
  watch: {
    $route(val) {
      window.scrollTo(0, 0)
    },
    systemInfo(val) {
      let sleng = val.length
      this.systemInfoNew = val[sleng - 1]
    }
  },
  created: function() {
    var that = this
    that.setCurrentPage()
    that.setPathName(that.currentPage.name)
    that.kefuinfo.username = that.currentUser.UserName
    that.kefuinfo.headimage = that.currentUser.HeadImg
    that.kefuinfo.nickname = that.currentUser.NickName
    that.kefuinfo.domain = that.currentUser.UserDomain
    that.kefuinfo.sign = that.currentUser.UserSign
    that.getCompanyInfo()
    that.connect()
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    setCurrentPage(val) {
      var that = this
      let routerPath = that.$router.history.current.path
      console.log(routerPath)

      that.currentPage.url = val || routerPath

      let ispage = false //是否有传入path
      that.pages.forEach(element => {
        if (element.url === that.currentPage.url) {
          that.currentPage = JSON.parse(JSON.stringify(element))
          ispage = true
        }
      })
      if (!ispage) {
        that.setCurrentPage('/home/control-panel/chat-list')
      } else if (val !== routerPath)
        that.$router.push({ path: that.currentPage.url })

      if (that.currentPage.url === '/home/setting') that.isSetting = true
      else that.isSetting = false
    },
    alertInfo(val, event) {
      var message = val
      var title = '确认'
      var buttonLabels = '确认,取消'

      navigator.notification.confirm(message, event, title, buttonLabels)
      navigator.notification.beep(1)

      function confirmCallback(buttonIndex) {
        console.log('You clicked ' + buttonIndex + ' button!')
      }
    },
    alertError(val) {
      var title = '错误'
      var buttonName = '确认'
      navigator.notification.alert(val, alertCallback, title, buttonName)
      navigator.notification.beep(1)
      function alertCallback() {
        // console.log('Alert is Dismissed!')
      }
    },
    ...mapMutations({
      setPathName: 'set'
    }),
    //切换功能内页
    changePage(val) {
      this.setCurrentPage(val)
      this.setPathName(this.currentPage.name)
    },
    //打开左侧菜单
    leftBarChange() {
      this.$refs.slider.goto(0)
      this.isCollapsed = true
    },
    //关闭左侧菜单
    leftBarClose() {
      this.$refs.slider.goto(1)
      this.isCollapsed = false
    },
    //关闭当前聊天
    rightBack() {
      this.onSlideEnd()
      this.$refs.slider.goto(1)
    },
    //当滑动到主界面时，关闭当前聊天
    onSlideEnd() {
      this.isChat = false
      this.currentChat = { chats: [] }
      this.setPathName(this.currentPage.name)
    },
    // 打开设置
    setting() {
      var that = this
      that.leftBarClose()
      that.isSetting = true
      that.$nextTick(() => {
        that.changePage('/home/setting')
      })
    },
    back() {
      var that = this
      that.isSetting = false
      that.$refs.slider.back()
      that.changePage('/home/control-panel/chat-list')
    },
    // 刷新操作
    reload() {
      console.log(`Page reloading`)
    },
    //设置当前对话
    setCurrentChat(val) {
      var that = this
      // 从 有新消息但位处于焦点的用户组删除
      var holdIndex = this.userHold.indexOf(val.username)
      if (holdIndex > -1) {
        this.userHold.splice(holdIndex, 1)
      }
      that.isChat = true
      that.currentChat = val
      that.setCurrentPage('/home/control-panel/chat-list')
      that.$nextTick(() => {
        that.setPathName(`与 ${that.currentChat.username} 对话中`)
        that.$refs.scrollpanel.refresh()
        that.$refs.slider.goto(2)
      })
    },
    //更改服务器状态
    changeServerStatus(val) {
      this.serverstatus = val
    },
    //回车返回错误
    rfalse: function() {
      return false
    },
    //退出
    logout() {
      logout()
    },
    //获取公司资料
    getCompanyInfo() {
      var that = this
      let url = tools.kefuUrl + 'GetDomainInfo'
      this.$httpform
        .post(url, {
          domain: that.kefuinfo.domain,
          username: that.kefuinfo.username,
          sign: that.kefuinfo.sign,
          sessionid: that.macAddress
        })
        .then(function(response) {
          var json = response.data
          if (json.error === 0) that.companyInfo = JSON.parse(json.content)
          else that.alertError(json.error + ':' + json.detail)
        })
        // eslint-disable-next-line handle-callback-err
        .catch(function(error) {
          that.alertError('系统错误')
        })
    },
    // 重连服务器
    reConnect() {
      websocket.close()
      websocket = null
      this.connect()
    },
    // 连接到服务器
    connect() {
      var that = this
      var support =
        'MozWebSocket' in window
          ? 'MozWebSocket'
          : 'WebSocket' in window
          ? 'WebSocket'
          : null
      var wsServer = `ws://${config.wsUrl}/token?name=${
        that.kefuinfo.username
      }&sign=${encodeURIComponent(that.kefuinfo.sign)}&domain=${
        that.kefuinfo.domain
      }&admin=true&islogin=false&uniqueid=${that.macAddress}`

      websocket = new window[support](wsServer)
      websocket.onclose = function(evt) {
        onClose(evt)
      }
      websocket.onopen = function(evt) {
        onOpen(evt)
      }
      websocket.onmessage = function(evt) {
        onMessage(evt)
      }
      websocket.onerror = function(evt) {
        onError(evt)
      }
      function onOpen(evt) {
        //console.log(evt.currentTarget.readyState)
        that.changeServerStatus('连接中...')
      }
      function onClose(evt) {
        //console.log(evt.currentTarget.readyState)
        //关闭所有窗口 清空所有列表
        that.userChatTabs = []
        that.userHold = []
        that.userWatting = []
        that.kefuList = []
        that.count = 0
        that.changeServerStatus('中断')
        if (sendnum) {
          clearInterval(sendnum)
          sendnum = null
        }
      }
      function onMessage(evt) {
        //console.log(evt.currentTarget.readyState)
        that.changeServerStatus('正常')
        if (sendnum) {
          clearInterval(sendnum)
          sendnum = null
        }
        // sendnum = setInterval(getnums, 200)
        that.Revice(evt.data)
      }
      function onError(evt) {
        //console.log(evt.currentTarget.readyState)
        that.changeServerStatus('连接错误')
        if (sendnum) {
          clearInterval(sendnum)
          sendnum = null
        }
      }
      function getnums() {
        var json = {
          id: 0,
          fromUser: that.kefuinfo.username,
          toUser: that.kefuinfo.username,
          content: null,
          code: 10000,
          addTime: tools.myTime.UnixToDate(tools.myTime.CurTime(), true, 8)
        }
        websocket.send(JSON.stringify(json))
      }
    },
    Revice(data) {
      var that = this
      let arry
      console.log(data)
      try {
        var json = JSON.parse(data)
        let message = null
        let person = null
        switch (json.code) {
          case 0:
            // 消息
            that.chatMessage(json, false)
            message = '您有新的消息'
            person = json.username
            // if (
            //   that.$electron.remote.BrowserWindow.getFocusedWindow() == null ||
            //   that.$electron.remote.getCurrentWindow().isMinimized()
            // )
            //   that.$electron.remote.getCurrentWindow().flashFrame(true)
            break
          case 1:
            // 新增等待访客
            that._pushUserWatting(json.username, json.islogin)
            message = '您有一位新的等待访客'
            person = '系统通知'
            // if (
            //   that.$electron.remote.BrowserWindow.getFocusedWindow() == null ||
            //   that.$electron.remote.getCurrentWindow().isMinimized()
            // )
            //   that.$electron.remote.getCurrentWindow().flashFrame(true)
            break
          case 2:
            // 访客已被接入
            that._removeUserWatting(json.username)
            break
          case 3:
            // 客服上线推送
            that._pushKefu(json.username)
            break
          case 4:
            // 客服离线推送
            that._removeKefu(json.username)
            break
          case 5:
            that._removeUserWatting(json.username)
            that._removeChatTab(json.username)
            // 访客离线
            break
          case 11:
            // 刷新访客列表
            arry = []
            that.userWatting = []
            json.userwaitting.forEach(visitor => {
              if (visitor.islogin) arry.push(visitor.username)
              else {
                var visitorNoLogin = JSON.parse(JSON.stringify(visitorjson))
                visitorNoLogin.username = visitor.username
                visitorNoLogin.islogin = visitor.islogin
                that.userWatting.push(visitorNoLogin)
              }
            })

            if (arry.length > 0) that._getUserInfo(arry)
            break
          case 13:
            // 刷新客服列表
            that.kefuList = []
            arry = []
            json.adminlist.forEach(kefu => {
              arry.push(kefu.username)
            })
            if (arry.length > 0) that._getKefuInfo(arry)
            break
          default:
            // 默认显示
            break
        }
        let isback = cordova.plugins.backgroundMode.isActive()
        if (message !== null) {
          if (isback)
            cordova.plugins.notification.local.schedule({
              title: 'e德互联客服',
              text: [{ person: person, message: message }],
              foreground: true
            })
          else navigator.notification.beep(1)
        }
      } catch (e) {
        var json2 = JSON.parse(JSON.stringify(systeminfo))
        json2.code = data
        that._pushSystemInfo(json2)
      }
    },
    // 转移事件CODE
    Event(code, username) {
      switch (code) {
        case 1:
          return `访客：${username} 等待中`
        case 2:
          return `访客：${username} 已被接入`
        case 5:
          return `访客：${username} 离线`
        case 3:
          return `客服：${username} 上线`
        case 4:
          return `客服：${username} 离线`
        case 11:
          return '访客列表刷新'
        case 13:
          return '刷新客服列表'
        default:
          return `系统：${code}`
      }
    },

    // 接收系统信息
    _pushSystemInfo(val) {
      val.time = tools.myTime.UnixToDate(tools.myTime.CurTime(), true, 8)
      this.systemInfo.push(val)
      this.showAlert()
    },

    //获取客服信息
    _getKefuInfo(arry) {
      var that = this
      let url = tools.kefuUrl + 'GetKefuList'
      let postdata = {
        domain: that.kefuinfo.domain,
        username: that.kefuinfo.username,
        sign: that.kefuinfo.sign,
        sessionid: that.macAddress,
        content: arry
      }
      this.$httpform
        .post(url, postdata)
        .then(response => {
          var json = response.data
          if (json.error === 0) that.kefuList = JSON.parse(json.content)
          else if (json.error) that.alertError(json.error + ':' + json.content)
          else that.alertError('通讯错误')
        })
        .catch(function(error) {
          that.alertError('系统错误')
          console.log(error)
        })
    },

    //获取用户信息
    _getUserInfo(arry) {
      var that = this
      var url = tools.kefuUrl + 'GetVisitorList'
      var postdata = {
        domain: that.kefuinfo.domain,
        username: that.kefuinfo.username,
        sign: that.kefuinfo.sign,
        sessionid: that.macAddress,
        content: arry
      }
      if (arry.length > 0)
        this.$httpform
          .post(url, postdata)
          .then(response => {
            var json = response.data
            if (json.error === 0) {
              var visitors = JSON.parse(json.content)
              visitors.forEach(v => {
                v.islogin = true
              })
              that.userWatting.concat(visitors)
            } else that.alertError(json.error + ':' + json.content)
          })
          .catch(function(error) {
            that.alertError('系统错误')
            console.log(error)
          })
    },
    //验证本地缓存是否存在访客信息 获取访客信息 并添加到访客等待列表 本地缓存
    _pushKefu(val) {
      var that = this
      if (val !== that.kefuinfo.username) {
        var arry = []
        arry.push(val)
        if (arry.length > 0) that._getKefuInfo(arry)
      }
    },
    // 在线客服移除
    _removeKefu(val) {
      var that = this
      that.kefuList.forEach((user, index, array) => {
        if (user.username === val) that.userWatting.splice(index, 1)
      })
    },

    //验证本地缓存是否存在访客信息 获取访客信息 并添加到访客等待列表 本地缓存
    _pushUserWatting(val, islogin) {
      var that = this
      var bool = true
      that.userWatting.forEach(user => {
        if (user.username === val) {
          bool = false
        }
      })
      that.userChatTabs.forEach(user => {
        if (user.username === val) {
          bool = false
        }
      })
      if (bool) {
        if (!islogin) {
          var visitorNoLogin = JSON.parse(JSON.stringify(visitorjson))
          visitorNoLogin.username = val
          visitorNoLogin.islogin = islogin
          that.userWatting.push(visitorNoLogin)
        } else {
          var arry = []
          arry.push(val)
          _getUserInfo(arry)
        }
      }
    },
    // 等待访客移除
    _removeUserWatting(val) {
      var that = this
      that.userWatting.forEach((user, index, array) => {
        if (user.username === val) that.userWatting.splice(index, 1)
      })
    },
    // 接入会话
    chatIn(_visitor) {
      var that = this
      if (that.count < 5) {
        var userStorage = that._loadUserStorage(_visitor.username)
        if (userStorage) _visitor.chats = userStorage.chats
        that.userChatTabs.push(_visitor)
        that.count++
        that._removeUserWatting(_visitor.username)
        that.sendCode(2001, _visitor.username)
        // open the new tab after created
        that.$nextTick(() => {
          that.setCurrentChat(_visitor)
          // that.chatIndex = that.userChatTabs.length - 1
        })
      } else that.alertError('您的客户等级只能同时接入5个会话')
    },
    // 关闭会话
    chatOut(item, isclear) {
      var that = this
      // if (that.userChatTabs.length > 0) {
      that.alertInfo('关闭当前访客会话', response => {
        if (response === 1) {
          let username = that.currentChat.username
          that.sendCode(2002, username)
          that._removeChatTab(username)
          if (isclear) that._removeUserStorage(username)
        }
      })
      // } else that.alertError('暂无会话')
    },
    // 新消息
    chatMessage(chatjson, isOut) {
      //this.$emit('alertInfo', 'home is loadding', response => { console.log(response) })
      var that = this
      var tabname
      var visitor
      if (!isOut) {
        tabname = chatjson.fromUser
        that.userChatTabs.forEach(user => {
          if (user.username === chatjson.fromUser) visitor = user
        })
      } else {
        tabname = chatjson.toUser
        that.userChatTabs.forEach(user => {
          if (user.username === chatjson.toUser) visitor = user
        })
      }
      // 会话访客是否存在 visitor
      if (visitor != null) {
        visitor.chats.push(chatjson)
        // 是否属于焦点信息
        if (tabname !== that.currentChat.username) {
          var holdIndex = that.userHold.indexOf(tabname)
          if (holdIndex === -1) {
            that.userHold.push(tabname)
          }
        } else that.refresh()
      }
    },
    // 发送信息
    chatSubmit(username, e) {
      var that = this
      if (e.shiftKey) {
      } else {
        if (that.message === null || that.message === '') {
          that.alertError('您还没有输入对话内容')
        } else {
          var json = {
            id: 0,
            fromUser: that.kefuinfo.username,
            toUser: username,
            content: that.message,
            code: 0,
            addTime: tools.myTime.UnixToDate(tools.myTime.CurTime(), true, 8)
          }
          that.chatMessage(json, true)
          websocket.send(JSON.stringify(json))
          that.message = null
        }
        e.preventDefault()
        return false
      }
    },
    // 刷新会话到底部
    refresh() {
      if (this.$refs.scrollpanel) {
        this.$refs.scrollpanel.refresh()
      }
    },
    // 会话移除
    _removeChatTab(val) {
      var that = this
      that.userChatTabs.forEach((user, index, array) => {
        if (user.username === val) {
          that.userChatTabs.splice(index, 1)
          that.count--
          that.onSlideEnd()
        }
      })
    },
    // 读取用户缓存
    _loadUserStorage(val) {
      let user = null
      let userJson = {
        username: '',
        nickname: '',
        headimage: '@/assets/imgs/visitor.png',
        islogin: true,
        chats: [
          {
            id: 0,
            fromUser: 'kefu02',
            toUser: 'kefu02',
            content: '........',
            code: 0,
            addTime: '2018-4-27 8:36:21'
          }
        ]
      }
      return user
    },
    // 清除用户缓存
    _removeUserStorage(val) {},
    // 读取客服缓存
    _loadKefuStorage(val) {},
    // 清除客服缓存
    _removeKefuStorage(val) {},
    // 发送code
    sendCode(code, username) {
      var that = this
      var _content = null
      switch (code) {
        case 2001:
          _content = '欢迎您，' + that.kefuinfo.nickname + '很高兴为您服务'
          break
        case 2002:
          _content = '感谢您的咨询，祝您生活愉快'
          break
      }
      var json = {
        id: 0,
        fromUser: that.kefuinfo.username,
        toUser: username,
        content: _content,
        code: code,
        addTime: tools.myTime.UnixToDate(tools.myTime.CurTime(), true, 8)
      }
      websocket.send(JSON.stringify(json))
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
  }
}
</script>
