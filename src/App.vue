<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-22 13:30:55
 * @Description: Main entry of application
 * @FilePath: /CasaOS-UI/src/App.vue
-->

<template>
  <div id="app" class="is-flex is-flex-direction-column">
    <template v-if="isNotSharing">
      <!-- Background Layer Start -->
      <casa-background :animate="isWelcome?initAni:noneAni"></casa-background>
      <!-- Background Layer End -->

      <!-- BrandBar Start -->
      <brand-bar v-animate-css="brandAni" v-if="!$store.state.isMobile"></brand-bar>
      <!-- BrandBar End -->
      <!-- ContactBar Start -->
      <contact-bar v-animate-css="contactAni" v-if="!$store.state.isMobile"></contact-bar>
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
import CasaBackground from './components/background/CasaBackground.vue'
import { mixin } from './mixins/mixin';

const customIconConfig = {
  customIconPacks: {
    'casa': {
      sizes: {
        'default': 'is-size-4',
        'is-20': 'is-size-5',
        'is-small': '',
        'is-medium': 'is-size-3',
        'is-large': 'is-size-1'
      },
      iconPrefix: 'casa-',
      internalIcons: {
        'check': 'checkmark',
        'information': 'information',
        'check-circle': 'checkmark-circle-outline',
        'alert': 'alert',
        'alert-circle': 'alert',
        'arrow-up': 'arrow-up',
        'chevron-right': 'arrow-right',
        'chevron-left': 'arrow-back',
        'chevron-down': 'arrow-down',
        'eye': 'eye',
        'eye-off': 'eye-off',
        'menu-down': 'arrow-dropdown',
        'menu-up': 'arrow-dropup',
        'close-circle': 'close-circle-outline'
      }
    },
  }
}

export default {
  components: {
    BrandBar,
    ContactBar,
    CasaBackground
  },
  mixins: [mixin],
  data() {
    return {
      //isLoading: true,
      steps: [
      ],
      isWelcome: false,
      backgroundStyleObj: {
        backgroundImage: `url(${require('@/assets/background/background.png')})`
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

    this.$buefy.config.setOptions(customIconConfig)
    this.checkInit();
  },
  mounted() {
    this.setInitLang();
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
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
    },
    /**
     * @description: Handle on Window reize
     * @return {*}
     */
    onWindowResize() {
      if (document.body.clientWidth >= 480) {
        this.$store.commit('setIsMobile', false)
      } else {
        this.$store.commit('setIsMobile', true)
      }

      console.log(this.$store.state.isMobile);
    },



  },
  sockets: {
    connect() {
      console.log('socket connected');
    },

  },
}
</script>

<style lang="scss" scoped>
#app {
  width: 100vw;
  height: 100vh;
  font-weight: 400;
  font-size: 0.875rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  overflow-y: hidden;
}
</style>
