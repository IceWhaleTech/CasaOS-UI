<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2022-01-28 16:05:56
 * @Description: Main entry of application
 * @FilePath: /CasaOS-UI/src/App.vue
-->

<template>
  <div id="app" class="is-flex is-flex-direction-column">

    <!-- Background Layer Start -->
    <div v-if="isWelcome" id="background" v-animate-css="initAni" :style="{'background-image': 'url(' + require('./assets/background/bg3.jpg') + ')'}"></div>
    <div v-if="!isWelcome" id="background" :style="{'background-image': 'url(' + require('./assets/background/bg3.jpg') + ')'}"></div>

    <!-- Background Layer End -->

    <!-- Router View Start -->
    <router-view />
    <!-- Router View End -->

    <!-- BrandBar Start -->
    <brand-bar v-animate-css="brandAni"></brand-bar>
    <!-- BrandBar End -->

    <!-- ContactBar Start -->
    <contact-bar v-animate-css="contactAni"></contact-bar>
    <!-- ContactBar End -->

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
        // {
        //   target: '#v-step-0',  // We're using document.querySelector() under the hood

        //   content: `Add your first App!`
        // },
        // {
        //   target: '#v-step-1',  // We're using document.querySelector() under the hood
        //   content: `Add your first App!`
        // }
      ],
      isWelcome: false,
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
    }
  },

  computed: {
    isLoading() {
      return this.$store.state.siteLoading
    }
  },

  created() {
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
}
</script>
