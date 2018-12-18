<template>
  <div class="login-bg">
    <div class="login-panel">
      <div class="login-logo">
        <img src="@/assets/imgs/128.png">
        <span>e德互联企业在线客服</span>
      </div>
      <hr class="my-4">
      <form autocomplete="off" @submit.prevent="login">
        <div class="form-group">
          <input v-validate="'required|min:5'" v-model="UserModel.UserDomain" type="text" class="form-control" name="域名" placeholder="域名" @focus="srollbottom">
        </div>
        <div class="form-group">
          <input v-validate="'required|min:5'" v-model="UserModel.UserName" type="text" class="form-control" name="用户名" placeholder="用户名">
        </div>
        <div class="form-group">
          <input v-validate="'required|min:6'" v-model="UserModel.UserPass" type="password" class="form-control" name="密码" placeholder="密码">
        </div>
        <hr class="my-4">
        <div class="form-group text-center">
          <button type="submit" class="btn btn-success w-100">登 陆</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import uuid from 'uuid'
import { mapGetters } from 'vuex'
import { userLogin } from '../utiltools/lock'
export default {
  data() {
    return {
      UserModel: {},
      rememberPassword: true,
      macAddress: null
    }
  },
  computed: { ...mapGetters(['currentUser']) },
  created: function() {
    var that = this
    that.UserModel = that.currentUser
      ? JSON.parse(JSON.stringify(that.currentUser))
      : {}
  },
  watch: {},
  methods: {
    login() {
      var that = this
      var Rurl = that.$route.query.Rurl
      that.macAddress = uuid.v4()
      that.$validator
        .validateAll()
        .then(result => {
          if (result) {
            userLogin({
              UserDomain: that.UserModel.UserDomain,
              UserName: that.UserModel.UserName,
              UserPass: that.UserModel.UserPass,
              SessionId: that.macAddress
            })
            setTimeout(() => {
              that.UserModel.UserPass = ''
            }, 50)
          } else {
            if (that.errors.has('域名'))
              that.alertError(this.errors.first('域名'))
            else if (that.errors.has('用户名'))
              that.alertError(this.errors.first('用户名'))
            else if (that.errors.has('密码'))
              that.alertError(this.errors.first('密码'))
          }
        })
        .catch(failure => {
          console.log(failure)
        })
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
    srollbottom() {
      //  window.scrollTo(0, document.body.scrollHeight)
    }
  }
}
</script>
<style scoped>
hr {
  border: 0.5px solid #fff;
}
.glyphicon:hover {
  color: white;
}

.error {
  margin-top: 10px;
  display: inline-block;
}

.control-label {
  font-size: 16px;
  font-weight: normal;
  padding-top: 10px;
  text-align: right;
}

.login-logo {
  display: block;
  margin-bottom: 20px;
}

.login-logo > img {
  display: inline-block;
  vertical-align: middle;
}

.login-logo > span {
  font-size: 24px;
  display: block;
  margin-left: 2px;
}

.login-panel {
  color: #fff;
  padding: 20px;
  width: 100%;
  height: 100%;
  /* background: rgba(0, 0, 0, 0.3); */
  z-index: 2;
  /* box-shadow: 0 0 5px 0 rgba(255, 255, 255, 0.7); */
  box-sizing: border-box;
}

.login-panel form {
  padding: 0 4px;
}

.login-bg {
  width: 100%;
  min-height: 100vh;
  padding-top: 100px;
  text-align: center;
  background-color: #27ae60;
  color: rgba(255, 255, 255, 0.75);
  background-attachment: fixed, fixed, fixed;
  background-image: url('../assets/overlay1.png'), url('../assets/overlay3.svg'),
    linear-gradient(45deg, #7e57c2 5%, #9575cd 35%, #66bb6a);
  background-position: top left, center center, center center;
  background-size: auto, cover, cover;
  overflow: hidden;
  position: absolute;
}

.login-toolbar-bg {
  position: absolute;
  height: 100px;
  width: 100%;
  -webkit-user-select: none;
}

.login-toolbar {
  position: absolute;
  right: 10px;
  top: 10px;
  -webkit-app-region: no-drag;
}
</style>
