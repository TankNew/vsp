
<template>
  <swiper ref="horizontalSwiper" :options="horizontalSwiperOptions" class="h-100" @slideChangeTransitionEnd="onSlideEnd">
    <swiper-slide v-if="!isSetting" ref="left" class="leftBar">
      <slot name="left"/>
    </swiper-slide>
    <swiper-slide ref="content" class="main-body">
      <slot name="content"/>
    </swiper-slide>
    <swiper-slide v-if="isChat" ref="right" class="right-chat">
      <slot name="right"/>
    </swiper-slide>
  </swiper>
</template>
<style scoped>
</style>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'Slider',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    isChat: {
      type: Boolean,
      default: false
    },
    isSetting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      horizontalSwiperOptions: {
        slidesPerView: 'auto',
        initialSlide: 1,
        direction: 'horizontal',
        slideToClickedSlide: true
      }
    }
  },
  computed: {
    horizontalSwiper () {
      return this.$refs.horizontalSwiper.swiper
    }
  },
  mounted () {
    setTimeout(() => {
      this._initMenuWidth()
    }, 20)
  },
  methods: {
    _initMenuWidth () {
      this.horizontalSwiper.updateSlides()
      this.horizontalSwiper.slideTo(1, 0, false)
    },
    goto (val) {
      this.horizontalSwiper.slideTo(val)
    },
    back () {
      this.$nextTick(() => {
        this.horizontalSwiper.slideTo(1, 0, false)
      })
    },
    onSlideEnd () {
      if (this.horizontalSwiper.activeIndex === 1) this.$emit('onSlideEnd')
    },
    /* 获取随机颜色 */
    getRandomColor () {
      return (
        '#' +
        ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(
          -6
        )
      )
    }
  }
}
</script>
