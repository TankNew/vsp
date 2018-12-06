<template>
  <section class="h-100 p-3">
    <ul class="user-chat-list">
      <li v-for="(item, index) in userChatTabs" :key="index">
        <div class="user-head">
          <i v-show="isHold(item)" class="fas fa-circle text-danger small"/>
          <img :src="item.headimage">
        </div>
        <div class="user-chat" @click="setCurrentChat(item)">
          <h6 class="mb-0">
            <a>{{ item.username }}</a>
          </h6>
          <small class="text-secondary">{{ lastChat(item.chats) }}</small>
        </div>
        <i class="fas fa-phone-slash text-danger" @click.stop="chatOut(item,true)"/>
      </li>
    </ul>
  </section>
</template>
<style scoped>
</style>
<script>
export default {
  name: 'HomeChatTitle',
  // eslint-disable-next-line vue/require-prop-types
  props: ['userChatTabs', 'userHold'],
  data() {
    return {}
  },
  methods: {
    lastChat(val) {
      return val.length > 0 ? val[val.length - 1].content : ''
    },
    isHold(val) {
      let inVal = false
      this.userHold.forEach(element => {
        if (element === val.username) inVal = true
      })
      return inVal
    },
    push(id) {
      // 直接调用$router.push 实现携带参数的跳转
      this.$router.push({
        path: `/chat/${id}`
      })
    },
    setCurrentChat(val) {
      this.$emit('setCurrentChat', val)
    },
    chatOut(val, bool) {
      this.$emit('chatOut', val, bool)
    }
  }
}
</script>
