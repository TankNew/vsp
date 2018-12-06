<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  data() {
    return {
      title: null
    }
  },
  computed: mapGetters({ currentPath: 'currentPath' }),
  created() {
    console.log(this.currentPath)
    console.log(this.$store.state.pathName.pathName)
  }
}
</script>

