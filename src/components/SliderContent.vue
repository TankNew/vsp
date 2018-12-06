
<template>
  <swiper ref="verticalSwiper" :options="verticalSwiperOptions" class="h-100" @slideChangeTransitionEnd="onSlideEnd" @tap="onClick">
    <swiper-slide v-if="!isSetting" ref="top" class="top-bar">
      <slot name="top"/>
    </swiper-slide>
    <swiper-slide ref="content" class="h-100">
      <slot name="content"/>
    </swiper-slide>
  </swiper>
</template>
<style scoped>
</style>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'SliderContent',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    isSetting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      verticalSwiperOptions: {
        slidesPerView: 'auto',
        initialSlide: 1,
        direction: 'vertical'
      }
    }
  },
  computed: {
    verticalSwiper () {
      return this.$refs.verticalSwiper.swiper
    }
  },
  mounted () {
    setTimeout(() => {
      this._initMenuWidth()
    }, 20)
  },
  methods: {
    _initMenuWidth () {
      // this.$refs.top.$el.style.height = this.topHeight
      this.verticalSwiper.updateSlides()
      this.verticalSwiper.slideTo(1, 0, false)
    },
    back () {
      this.$nextTick(() => {
        this.verticalSwiper.slideTo(1, 0, false)
      })
    },
    onSlideEnd () {
      if (this.verticalSwiper.activeIndex === 0) {
        setTimeout(() => {
          this.$emit('reload')
          this.verticalSwiper.slideTo(1, 200, false)
        }, 500)
      }
    },
    onClick () {
      this.$emit('onClick')
    }
  }
}
</script>
