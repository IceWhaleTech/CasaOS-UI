<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:34:15
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-09 15:55:47
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
          <side-bar></side-bar>
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
              <suggestion></suggestion>
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
import Suggestion from '@/components/Suggestion.vue'
import TopBar from '@/components/TopBar.vue'
//import Shortcuts from '@/components/Shortcuts.vue'

export default {
  name: "home",
  components: {
    SideBar,
    SearchBar,
    Suggestion,
    Apps,
    TopBar,
    //Shortcuts
  },
  data() {
    return {
      isLoading: true,
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
    this.$api.info.guideCheck().then(res => {
      if (res.data.success == 200 && res.data.data.need_init_user) {
        localStorage.removeItem("user_token");
        this.$router.push("/welcome");
      } else {
        this.isLoading = false
      }
    });
    window.addEventListener("resize", this.onResize);
    this.onResize()
  },
  methods: {
    showSideBar() {
      console.log("showSidebar");
    },
    onResize() {
      if (window.innerWidth > 480 && this.sidebarOpen) {
        this.$store.commit('closeSideBar');
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener("resize", this.onResize)
  },
}
</script>

<style>
</style>