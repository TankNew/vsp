<template>
  <section class="h-100">
    <scroll ref="usersList" :data="userWatting" :auto-scroll="false" class="scrollUsers">
      <div class="p-3">
        <ul class="users-list">
          <li v-for="(item,index) in userWatting" :key="index">
            <img :src="item.headimage">
            <span>{{ item.islogin?item.nickname:item.username }}</span>
            <button type="button" class="btn btn-sm btn-primary mr_10" @click="chatIn(item)">接入</button>
          </li>
        </ul>
      </div>
    </scroll>
  </section>
</template>
 

<script>
import scroll from '@/components/scroll'
import tools from '@/utiltools/tools.js'
const config = require('~/config-lock.json')
export default {
  components: {
    scroll: scroll
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['userWatting'],
  data() {
    return {}
  },
  created() {
    var that = this
    this.$nextTick(() => {
      that.$refs.usersList.refresh()
    })
  },
  methods: {
    chatIn(val) {
      this.$emit('chatIn', val)
    }
  }
}
</script>
