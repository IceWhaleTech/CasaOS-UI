<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-09 16:43:29
 * @Description: Main entry of application
 * @FilePath: /CasaOS-UI/src/App.vue
-->

<template>
  <div id="app" class="is-flex is-flex-direction-column" v-if="!isLoading">

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
// import UAParser from 'ua-parser-js';

// const parser = new UAParser();
// console.log(parser.getResult());
export default {
  components: {
    BrandBar,
    ContactBar,
  },
  data() {
    return {
      isLoading: true,
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

  created() {
    console.log(this.$router.history.current.path);
    this.$api.info.guideCheck().then(res => {
      this.isLoading = false
      if (res.data.success == 200 && res.data.data.need_init_user) {
        this.isWelcome = true
      } else {
        this.isWelcome = false
      }
    })
  },
  mounted() {
    //this.$tours['myTour'].start()
  },
  methods: {

  },
}
</script>
