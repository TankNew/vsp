<template>
  <section class="h-100">
    <SliderContent ref="SliderContent" :is-setting="isSetting" @reload="reload" @onClick="leftBarClose">
      <div slot="top">
        <h6>
          <i class="fas fa-sync fa-spin mr-1"/>刷新中......
        </h6>
      </div>
      <div slot="content" class="h-100">
        <router-view
          ref="home"
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
        />
      </div>
    </SliderContent>
    <footer>
      <div class="menu-bar">
        <a v-for="(item,index) in pages" v-if="item.menu" :key="index" :class="item.url==currentPage.url?'active':''" @click="changePage(item.url)">
          <i :class="['fas', item.icon]"/>
          {{ item.name }}
        </a>
      </div>
    </footer>
  </section>
</template>
<script>
import SliderContent from '@/components/SliderContent'

export default {
  components: { SliderContent },
  // eslint-disable-next-line vue/require-prop-types
  props: [
    'macAddress',
    'userChatTabs',
    'userHold',
    'kefuList',
    'userWatting',
    'currentPage',
    'pages',
    'isSetting'
  ],
  data() {
    return {}
  },
  mounted() {
    this.back()
  },
  methods: {
    back() {
      this.$refs.SliderContent.back()
    },
    alertInfo(val, event) {
      this.$emit('alertInfo', [val, event])
    },
    alertError(val) {
      this.$emit('alertError', val)
    },
    chatIn(val) {
      this.$emit('chatIn', val)
    },
    chatOut(val, bool) {
      this.$emit('chatOut', [val, bool])
    },
    setCurrentChat(val) {
      this.$emit('setCurrentChat', val)
    },
    reload() {
      this.$emit('reload')
    },
    leftBarClose() {
      this.$emit('leftBarClose')
    },
    changePage(val) {
      this.$emit('changePage', val)
    }
  }
}
</script>
