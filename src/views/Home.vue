<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:34:15
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-31 15:02:05
 * @Description: 
 * @FilePath: \CasaOS-UI\src\views\Home.vue
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
              <app-section ref="apps"></app-section>
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
    <!-- File Panel Start -->
    <b-modal v-model="isFileActive" has-modal-card :destroy-on-hide="false" animation="zoom-in" custom-class="file-panel" :can-cancel="[]" aria-modal full-screen>
      <template #default="props">
        <file-panel @close="props.close"></file-panel>
      </template>
    </b-modal>
    <!-- File Panel End -->
  </div>
</template>

<script>

import SearchBar from '@/components/SearchBar.vue'
import SideBar from '@/components/SideBar.vue'
import TopBar from '@/components/TopBar.vue'
import CoreService from '../components/CoreService.vue'
import AppSection from '../components/Apps/AppSection.vue'
//import Shortcuts from '@/components/Shortcuts.vue'
import FilePanel from '@/components/filebrowser/FilePanel.vue'
export default {
  name: "home-page",
  components: {
    SideBar,
    SearchBar,
    AppSection,
    TopBar,
    CoreService,
    //Shortcuts,
    FilePanel
  },
  data() {
    return {
      isLoading: true,
      hardwareInfoLoading: true,
      isFileActive: false,
      topBarAni: {
        classes: 'fadeInDown',
        duration: 800
      },
    }
  },
  provide() {
    return {
      homeShowFiles: this.showFiles,
    };
  },

  computed: {
    sidebarOpen() {
      return this.$store.state.sidebarOpen
    }
  },
  mounted() {
    this.isLoading = false
    this.getHardwareInfo();
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
     * @description: Show Files
     * @param {*}
     * @return {*} void
     */
    showFiles() {
      this.isFileActive = true
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
    },

  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },

}
</script>

<style>
</style>