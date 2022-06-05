<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-30 14:51:28
 * @Description: Main entry of application
 * @FilePath: \CasaOS-UI\src\App.vue
-->

<template>
  <div id="app" class="is-flex is-flex-direction-column">
    <template v-if="isNotSharing">
      <!-- Background Layer Start -->
      <div id="background" v-animate-css="isWelcome?initAni:noneAni" :style="backgroundStyleObj"></div>
      <!-- Background Layer End -->

      <!-- BrandBar Start -->
      <brand-bar v-animate-css="brandAni"></brand-bar>
      <!-- BrandBar End -->
      <!-- ContactBar Start -->
      <contact-bar v-animate-css="contactAni"></contact-bar>
      <!-- ContactBar End -->
    </template>

    <!-- Router View Start -->
    <router-view />
    <!-- Router View End -->

    <!-- <v-tour name="myTour" :steps="steps"></v-tour> -->
  </div>
</template>

<script>
import BrandBar from './components/BrandBar.vue'
import ContactBar from './components/ContactBar.vue'
import { mixin } from './mixins/mixin';


export default {
  components: {
    BrandBar,
    ContactBar,
  },
  mixins: [mixin],
  data() {
    return {
      //isLoading: true,
      steps: [
      ],
      isWelcome: false,
      backgroundStyleObj: {
        backgroundImage: `url(${require('@/assets/background/bg3.jpg')})`
      },
      noneAni: {
        classes: 'fadeIn',
        duration: 500
      },
      initAni: {
        classes: 'zoomOutIn',
        duration: 2500
      },
      brandAni: {
        classes: "fadeInLeft",
        duration: 700
      },
      contactAni: {
        classes: "fadeInRight",
        duration: 700
      },
      isNotSharing: true
    }
  },

  computed: {
    isLoading() {
      return this.$store.state.siteLoading
    },
  },
  watch: {
    $route() {
      this.isNotSharing = this.$route.path != "/connect"
    }
  },

  created() {
    console.log(`%c
_____             _____ _____ 
|     |___ ___ ___|     |   __|
|   --| .'|_ -| .'|  |  |__   |
|_____|__,|___|__,|_____|_____|
-- Made by IceWhale with YOU --
`, `font-family: monospace`);

    this.checkInit();
  },
  mounted() {
    this.setInitLang();
  },
  methods: {
    /**
     * @description: Check if System need init first
     * @return {*} void
     */
    checkInit() {
      this.$api.info.guideCheck().then(res => {
        if (res.data.success == 200 && res.data.data.need_init_user) {
          this.isWelcome = true
          this.$store.commit('changeSiteLoading')
          this.$store.commit('changeInitialization', true)
          localStorage.removeItem("user_token");
          this.$router.push("/welcome");
        } else {
          this.isWelcome = false
        }
      })
    },
    /**
     * @description: Get and Set default language 
     * @return {*} void
     */
    setInitLang() {
      let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : this.getLangFromBrowser()
      lang = lang.includes("_") ? lang : "en_us";
      this.setLang(lang);
    }

  },
  sockets: {
    connect() {
      console.log('socket connected');
    },
    
  },
}
</script>
