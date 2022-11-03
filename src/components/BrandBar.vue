<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-20 18:04:06
 * @Description: The left bottom brand bar
 * @FilePath: /CasaOS-UI/src/components/BrandBar.vue
-->

<template>
  <div class="brand-bar is-flex is-align-items-center has-text-white">
    <figure class="image is-24x24">
      <img :src="require('@/assets/img/logo/casa-white.svg')">
    </figure>
    <span class="logo-text mr-3 ml-1">CasaOS</span>
    <span v-if="!rssShow && rss.length" class="intro-text">Made with ❤️ by IceWhale and YOU!</span>
    <span v-else class="window">
      <ul class="scroll" :style="{'--time': 5*rss.length+'s'}">
        <li v-for="(item,key) in rss" :key="key"><a :href="item.link" target="_blank" class="intro-text">{{
            item.title
          }}</a></li>
      </ul>
    </span>
  </div>
</template>

<script>
import Parser from "rss-parser";

export default {
  name: "brand-bar",
  computed: {
    rssShow() {
      return this.$store.state.rssSwitch
    },
  },
  data() {
    return {
      rss: [],
    };
  },
  created() {
    console.log(123)
    this.parseFeed()
  },
  methods: {
    async parseFeed() {
      let parser = new Parser();
      let feed = await parser.parseURL('https://blog.casaos.io/feed/')
      this.rss = feed.items
    }
  }
}
</script>

<style lang="scss" scoped>
.brand-bar {
  position: fixed;
  left: 2rem;
  bottom: 1.125rem;
  z-index: 100;
  //pointer-events: none;

  .logo-text {
    font-size: 1.125rem;
  }

  .intro-text {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
  }
}

@media screen and (max-width: 480px) {
  .brand-bar {
    left: 0;
    bottom: 3rem;
    display: flex;
    width: 100%;
    justify-content: center;
    font-size: 0.875rem;

    .image.is-32x32 {
      height: 24px;
      width: 24px;
    }

    .is-size-4 {
      font-size: 1.25rem !important;
    }
  }
}

@keyframes scroll {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(0, -100%)
  }
}

.window {
  height: 1rem;
  overflow: hidden;

}

.scroll {
  width: 100%;
  line-height: 1rem;
  verticle-align: bottom;
  text-align: center;
  animation-name: scroll;
  animation-duration: var(--time);
  animation-delay: 0s;
  animation-iteration-count: infinite;

  li {
    no-wrap: true;
  }
}
</style>
