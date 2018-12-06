<template>
  <section class="h-100">
    <scroll ref="kefusList" :data="kefuList" :auto-scroll="false" class="scrollUsers">
      <div class="p-3">
        <ul class="users-list">
          <li>
            <img src="@/assets/imgs/ednet.jpg">
            <span>e德互联在线</span>
          </li>
          <li v-for="(item,index) in kefuList" :key="index">
            <img :src="item.headimage">
            <span>{{ item.nickname }}</span>
            <i :class="['fas',item.status==1?'fa-frown':'fa-smile',item.status==1?'text-warning':'text-success','pull-right']"/>
          </li>
        </ul>
      </div>
    </scroll>
  </section>
</template>
<style scoped>
</style>

<script>
import scroll from '@/components/scroll'
import tools from '@/utiltools/tools.js'
const config = require('~/config-lock.json')
export default {
  components: {
    scroll: scroll
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['kefuList'],
  data() {
    return {}
  },
  created() {
    var that = this
    this.$nextTick(() => {
      that.$refs.kefusList.refresh()
    })
  }
}
</script>
