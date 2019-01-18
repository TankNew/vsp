<template>
  <section>
    <form class="form-horizontal" autocomplete="off" @submit.prevent="submitForm">
      <div class="p-3">
        <mu-avatar slot="avatar" :src="kefuData.headimage"/>
        <mu-raised-button label="上传头像" icon="folder" background-color="#ba68c8" class="align-middle">
          <vue-base64-file-upload
            :max-size="customImageMaxSize"
            :disable-preview="true"
            class="v1"
            accept="image/png, image/jpeg"
            image-class="v1-image"
            input-class="v1-file"
            @size-exceeded="onSizeExceeded"
            @file="onFile"
            @load="onLoad"
          />
        </mu-raised-button>
        <mu-divider/>
        <div class="m-5">
          <p class="lead">界面设置</p>
          <mu-divider/>
          <div>
            <mu-checkbox label="显示电话" labelClass="mucheckbox" uncheckIcon="phone" v-model="kefuData.showphonenumber" checkedIcon="done"/>
            <mu-checkbox label="显示邮箱" labelClass="mucheckbox" uncheckIcon="email" v-model="kefuData.showemail" checkedIcon="done"/>
            <mu-checkbox label="显示QQ" labelClass="mucheckbox" uncheckIcon="chat_bubble_outline" v-model="kefuData.showqqnumber" checkedIcon="done"/>
          </div>
          <mu-divider/>
        </div>
        <mu-text-field v-validate="'required'" v-model="kefuData.nickname" :error-text="errors.has('昵称')?errors.first('昵称'):''" label="昵称" hint-text="昵称" name="昵称" icon="location_city" label-float/>

        <mu-text-field label="电话" hintText="电话" name="电话" class="demo-divider-form" icon="phone" labelFloat v-model="kefuData.phonenumber" :errorText="errors.has('电话')?errors.first('电话'):''"/>
        <mu-text-field label="邮箱" hintText="邮箱" name="邮箱" class="demo-divider-form" icon="email" labelFloat v-model="kefuData.email" :errorText="errors.has('邮箱')?errors.first('邮箱'):''"/>
        <mu-text-field
          label="QQ"
          hintText="QQ"
          name="QQ"
          class="demo-divider-form"
          icon="chat_bubble_outline"
          labelFloat
          v-model="kefuData.qqnumber"
          :errorText="errors.has('QQ')?errors.first('QQ'):''"
        />

        <mu-text-field
          v-validate="'required|min:6'"
          v-if="isPawword"
          v-model="kefuData.oldPassword"
          :error-text="errors.has('旧的密码')?errors.first('旧的密码'):''"
          label="旧的密码"
          hhint-text="旧的密码"
          name="旧的密码"
          icon="lock"
          label-float
          type="password"
        />
        <mu-text-field
          v-validate="'min:6'"
          v-else
          v-model="kefuData.oldPassword"
          :error-text="errors.has('旧的密码')?errors.first('旧的密码'):''"
          label="旧的密码"
          hhint-text="旧的密码"
          name="旧的密码"
          icon="lock"
          label-float
          type="password"
        />
        <mu-text-field
          v-validate="'min:6'"
          ref="新的密码"
          v-model="kefuData.password"
          :error-text="errors.has('新的密码')?errors.first('新的密码'):''"
          label="新的密码"
          hhint-text="新的密码"
          name="新的密码"
          icon="lock"
          label-float
          type="password"
        />
        <mu-text-field
          v-validate="'min:6|confirmed:新的密码'"
          v-model="kefuData.confirmPassword"
          :error-text="errors.has('确认密码')?errors.first('确认密码'):''"
          label="确认密码"
          hhint-text="确认密码"
          name="确认密码"
          icon="lock"
          label-float
          type="password"
        />
        <p class="ml-4">
          <mu-flat-button slot="actions" primary label="提交" type="submit"/>
        </p>
      </div>
    </form>
  </section>
</template>
<script>
import VueBase64FileUpload from 'vue-base64-file-upload'
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
import tools from '@/utiltools/tools'
import { setCurrentUserToLocalStorage } from '@/utiltools/auth'
import { logout } from '@/utiltools/lock'
export default {
  middleware: 'authenticated',
  components: {
    VueBase64FileUpload
  },
  data() {
    return {
      kefuData: {},
      kefuTemp: {
        username: null,
        headimage: null,
        nickname: null,
        domain: null,
        sign: null,
        state: 1,
        oldPassword: null,
        password: null,
        confirmPassword: null
      },
      customImageMaxSize: 0.2,
      isPawword: false
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser', 'macAddress'])
  },
  watch: {
    kefuData: {
      handler(curVal, oldVal) {
        if (curVal.password !== null && curVal.password !== '')
          this.isPawword = true
        else this.isPawword = false
      },
      deep: true
    }
  },
  created() {
    var that = this
    that.reset()
  },
  methods: {
    onFile(file) {},
    onLoad(dataUri) {
      this.kefuData.headimage = dataUri
    },
    onSizeExceeded(size) {
      alert({
        title: '客服头像不超过200K',
        icon: 'error'
      })
    },
    reset() {
      var that = this
      that.kefuTemp.username = that.currentUser.UserName
      that.kefuTemp.headimage = that.currentUser.HeadImg
      that.kefuTemp.nickname = that.currentUser.NickName
      that.kefuTemp.domain = that.currentUser.UserDomain
      that.kefuTemp.sign = that.currentUser.UserSign
      that.kefuTemp.phonenumber = that.currentUser.phonenumber
      that.kefuTemp.email = that.currentUser.email
      that.kefuTemp.qqnumber = that.currentUser.qqnumber
      that.kefuTemp.showphonenumber = that.currentUser.showphonenumber ? 1 : 0
      that.kefuTemp.showemail = that.currentUser.showemail ? 1 : 0
      that.kefuTemp.showqqnumber = that.currentUser.showqqnumber ? 1 : 0
      that.kefuData = JSON.parse(JSON.stringify(that.kefuTemp))
    },
    submitForm() {
      var that = this
      that.$validator
        .validateAll()
        .then(result => {
          if (result) {
            var that = this
            let url = tools.kefuUrl + 'Update'
            let postdata = {
              domain: that.kefuData.domain,
              username: that.kefuData.username,
              sign: that.kefuData.sign,
              sessionid: that.macAddress,
              ischpw: false,
              content: that.kefuData
            }
            if (that.kefuData.password != null && that.kefuData.password !== '')
              postdata.ischpw = true
            this.$httpform
              .post(url, JSON.stringify(postdata))
              .then(response => {
                var json = response.data
                if (json.error === 0) {
                  if (!postdata.ischpw) {
                    let user = {
                      UserDomain: that.kefuData.domain,
                      UserName: that.kefuData.username,
                      NickName: that.kefuData.nickname,
                      HeadImg: that.kefuData.headimage,
                      UserSign: that.kefuData.sign,
                      phonenumber: that.kefuData.phonenumber,
                      email: that.kefuData.email,
                      qqnumber: that.kefuData.qqnumber,
                      showphonenumber: that.kefuData.showphonenumber,
                      showemail: that.kefuData.showemail,
                      showqqnumber: that.kefuData.showqqnumber
                    }
                    setCurrentUserToLocalStorage(user)
                    that.$emit('back')
                  } else {
                    that.alertInfo('您更新了密码, 请重新登陆', response =>
                      logout()
                    )
                  }
                } else that.alertError(json.error + ':' + json.content)
              })
              .catch(error => {
                that.alertError('系统错误')
                console.log(error)
              })
          }
        })
        .catch(failure => {
          console.log(failure)
        })
    },
    alertInfo(val, event) {
      this.$emit('alertInfo', [val, event])
    },
    alertError(val) {
      this.$emit('alertError', val)
    }
  }
}
</script>
<style scoped>
.mu-avatar {
  margin: 0 20px;
  vertical-align: middle;
}
.mu-divider {
  margin: 10px;
}
.v1 {
  width: 120px;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
}

.v1-image {
  display: none;
}
</style>
