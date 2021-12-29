<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:34:15
 * @LastEditors: JerryK
 * @LastEditTime: 2021-12-29 15:01:09
 * @Description: 
 * @FilePath: /CasaOS-UI/src/views/Home.vue
-->
<template>
  <div v-if="!isLoading" class="out-container">
    <!-- NavBar Start -->
    <top-bar v-animate-css="topBarAni" @showSideBar="showSideBar"></top-bar>
    <!-- NavBar End -->

    <!-- Content Start -->
    <div class="contents  pt-55">
      <div class="container">
        <div class="is-flex">
          <!-- SideBar Start -->
          <side-bar v-if="!hardwareInfoLoading"></side-bar>
          <div class="dark-bg" :class="{'open':sidebarOpen}"></div>
          <!-- SideBar End -->

          <!-- MainContent Start -->
          <div class="main-content">
            <!-- SearchBar Start -->
            <section>
              <search-bar></search-bar>
            </section>
            <!-- SearchBar End -->

            <!-- Suggestions For You Start -->
            <section>
              <!-- <suggestion></suggestion> -->
              <core-service></core-service>
            </section>
            <!-- Suggestions For You End -->

            <!-- Apps Start -->
            <section>
              <apps></apps>
            </section>
            <!-- Apps End -->

            <!-- Shortcuts Start -->
            <!-- <section>
              <shortcuts></shortcuts>
            </section> -->
            <!-- Shortcuts End -->
          </div>
          <!-- MainContent End -->
        </div>
      </div>
    </div>
    <!-- Content End -->
  </div>
</template>

<script>
import Apps from '@/components/Apps.vue'

import SearchBar from '@/components/SearchBar.vue'
import SideBar from '@/components/SideBar.vue'
// import Suggestion from '@/components/Suggestion.vue'
import TopBar from '@/components/TopBar.vue'
import CoreService from '../components/CoreService.vue'
//import Shortcuts from '@/components/Shortcuts.vue'

export default {
  name: "home",
  components: {
    SideBar,
    SearchBar,
    // Suggestion,
    Apps,
    TopBar,
    CoreService,
    //Shortcuts
  },
  data() {
    return {
      isLoading: true,
      hardwareInfoLoading: true,
      timer: 0,
      timeGap: 3,
      topBarAni: {
        classes: 'fadeInDown',
        duration: 800
      }

    }
  },

  computed: {
    sidebarOpen() {
      return this.$store.state.sidebarOpen
    }
  },
  mounted() {
    this.isLoading = false
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.getHardwareInfo();
    this.timer = setInterval(() => {
      this.getHardwareInfo()
    }, 2000);


    window.addEventListener("resize", this.onResize);
    this.onResize()
  },
  methods: {
    /**
     * @description: Show SideBar
     * @param {*}
     * @return {*} void
     */
    showSideBar() {
      console.log("showSidebar");
    },

    /**
     * @description: Window Resize Handler
     * @param {*}
     * @return {*} void
     */
    onResize() {
      if (window.innerWidth > 480 && this.sidebarOpen) {
        this.$store.commit('closeSideBar');
      }
    },

    /**
     * @description: Get Hardware info and save to store
     * @param {*}
     * @return {*} void
     */

    getHardwareInfo() {
      this.$api.info.allInfo().then(res => {
        if (res.data.success === 200) {
          this.hardwareInfoLoading = false
          this.$store.commit('changeHardwareInfo', res.data.data);
        }
      })
    }


  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    clearInterval(this.timer);
  },
}
</script>

<style>
</style>