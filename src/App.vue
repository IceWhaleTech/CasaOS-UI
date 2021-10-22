<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-21 13:30:20
 * @Description: Main entry of application
 * @FilePath: /CasaOS-UI/src/App.vue
-->

<template>
  <div id="app" class="is-flex is-flex-direction-column" :style="{'background-image': 'url(' + require('./assets/background/bg.jpeg') + ')'}">
    <router-view />

    <!-- BrandBar Start -->
    <brand-bar></brand-bar>
    <!-- BrandBar End -->

    <!-- ContactBar Start -->
    <contact-bar></contact-bar>
    <!-- ContactBar End -->

    <!-- <v-tour name="myTour" :steps="steps"></v-tour> -->
  </div>
</template>

<script>
import BrandBar from './components/BrandBar.vue'
import ContactBar from './components/ContactBar.vue'

export default {
  components: {
    BrandBar,
    ContactBar,
  },
  data() {
    return {
      steps: [
        // {
        //   target: '#v-step-0',  // We're using document.querySelector() under the hood

        //   content: `Add your first App!`
        // },
        // {
        //   target: '#v-step-1',  // We're using document.querySelector() under the hood
        //   content: `Add your first App!`
        // }
      ]
    }
  },
  created() {

  },
  mounted() {
    //this.$tours['myTour'].start()
  },
  methods: {

  },
}
</script>
