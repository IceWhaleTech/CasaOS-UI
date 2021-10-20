<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-20 16:38:51
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
    // Check if not login then login and get token
    if (!localStorage.getItem("user_token")) {
      this.login()
    }
  },
  mounted() {
    //this.$tours['myTour'].start()
  },
  methods: {
    login() {
      /**
       * @description: Login
       * @return void
       */
      // this.$api.user.login({
      //   username: "admin",
      //   pwd: "admin"
      // }).then((res) => {
      //   if (res.data.success == 200) {
      //     localStorage.setItem("user_token", res.data.data)
      //   }
      // })
    }
  },
}
</script>
