<template>
  <div :class="item | coverType">
    <transition name="fade">
      <img alt="folder" :src="imageData" key="thumb" v-if="showThumb" class="has-absolute" :class="isWide?'thumb-w':'thumb-h'" />
      <img alt="folder" :src="getIconFile(item)" :class="item | iconType" key="icon" class=" has-absolute" v-else />
    </transition>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],

  props: {
    item: {}
  },
  data() {
    return {
      isLoaded: false,
      imageData: "",
      isWide: true,
      io: {},
      inViewPort: false
    }
  },

  computed: {
    showThumb() {
      return this.isLoaded && this.hasThumb(this.item)
    }
  },
  watch: {
    inViewPort(value) {
      if (value) {
        this.loadImage();
      }
    }
  },
  created() {
    this.io = new IntersectionObserver((events) => {
      const { target, isIntersecting } = events[0]
      if (isIntersecting && !this.inViewPort) {
        this.inViewPort = true
        this.io.unobserve(target)
      }
    })
  },
  mounted() {
    if (this.hasThumb(this.item)) {
      this.io.observe(this.$el);
    }
  },

  methods: {
    loadImage() {
      var imgUrl = this.getThumbUrl(this.item) //  带有参数的的ajax接口url
      var img = new Image();
      img.crossOrigin = location.host;
      img.src = imgUrl;
      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        this.isWide = img.width > img.height
        this.isLoaded = true
        this.imageData = canvas.toDataURL('image/png');
      };
      img.onerror = (e, s) => {
        console.log(e, s);
      }

    }
  },
}
</script>

<style>
</style>