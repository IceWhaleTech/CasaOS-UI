<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:34:15
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 21:42:07
 * @Description: 
 * @FilePath: \CasaOS-UI\src\views\Home.vue
-->
<template>
  <div v-if="!isLoading" class="out-container">
    <!-- NavBar Start -->
    <top-bar v-animate-css="topBarAni" @showSideBar="showSideBar" :initBarData="barData"></top-bar>
    <!-- NavBar End -->

    <!-- Content Start -->
    <div class="contents  pt-55 contextmenu-canvas" @contextmenu.prevent="openHomeContaxtMenu">
      <div class="container">
        <div class="is-flex">
          <!-- SideBar Start -->
          <side-bar v-if="!hardwareInfoLoading"></side-bar>
          <!-- SideBar End -->

          <!-- MainContent Start -->
          <div class="main-content contextmenu-canvas is-flex-grow-1" :class="{'open':sidebarOpen}">
            <!-- SearchBar Start -->
            <section>
              <transition name="fade">
                <search-bar v-if="searchbarShow"></search-bar>
              </transition>
            </section>
            <!-- SearchBar End -->

            <!-- core-service Start -->
            <section>
              <transition name="fade">
                <core-service v-if="recommendShow"></core-service>
              </transition>
            </section>
            <!-- core-service End -->

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
import { mixin } from '../mixins/mixin';
const wallpaperConfig = "wallpaper"

export default {
  name: "home-page",
  mixins: [mixin],
  components: {
    SideBar,
    SearchBar,
    AppSection,
    TopBar,
    CoreService,
    //Shortcuts,
    FilePanel,
  },
  data() {
    return {
      isLoading: true,
      hardwareInfoLoading: true,
      user_id: localStorage.getItem("user_id") ? localStorage.getItem("user_id") : 1,
      isFileActive: false,
      barData: {},
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
    },
    searchbarShow() {
      return this.$store.state.searchEngineSwitch
    },
    recommendShow() {
      return this.$store.state.recommendSwitch
    }
  },
  created() {
    this.getHardwareInfo();
    this.getWallpaperConfig();
    this.getConfig()
  },
  mounted() {


    window.addEventListener("resize", this.onResize);
    this.onResize()

  },
  methods: {

    /**
     * @description: Get CasaOS Configs
     * @param {*}
     * @return {*}
     */
    async getConfig() {
      let systemConfig = await this.$api.user.getCustomConfig(this.user_id, "system")
      if (systemConfig.data.success != 200 || systemConfig.data.data == "") {
        const oldData = systemConfig.data.data
        const oldSystemConfig = await this.$api.sys.systemConfig()
        if (oldData == "") {
          const barData = {
            lang: oldSystemConfig.data.data.lang ? oldSystemConfig.data.data.lang : this.getLangFromBrowser(),
            search_engine: oldSystemConfig.data.data.search_engine ? oldSystemConfig.data.data.search_engine : "https://duckduckgo.com/?q=",
            search_switch: true,
            recommend_switch: true,
            shortcuts_switch: oldSystemConfig.data.data.shortcuts_switch ? oldSystemConfig.data.data.shortcuts_switch : true,
            widgets_switch: oldSystemConfig.data.data.widgets_switch ? oldSystemConfig.data.data.widgets_switch : true,
          }
          // save
          const saveRes = await this.$api.user.postCustomConfig(this.user_id, "system", barData)
          if (saveRes.data.success === 200) {
            systemConfig = saveRes
            this.barData = saveRes.data.data

          }
        }
      }

      this.$store.commit('changeSearchEngineSwitch', systemConfig.data.data.search_switch);
      this.$store.commit('changeRecommendSwitch', systemConfig.data.data.recommend_switch);
      this.barData = systemConfig.data.data
      this.isLoading = false

    },

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
      this.$api.sys.getUtilization().then(res => {
        if (res.data.success === 200) {
          this.hardwareInfoLoading = false
          this.$store.commit('changeHardwareInfo', res.data.data);
        }
      })
    },

    openHomeContaxtMenu(e) {
      // console.log(e.target);
      this.$EventBus.$emit("showHomeContextMenu", e);
    },

    getWallpaperConfig() {
      this.$api.user.getCustomConfig(this.user_id, wallpaperConfig).then(res => {
        if (res.data.success === 200 && res.data.data != "") {
          this.$store.commit('changeWallpaper', {
            path: res.data.data.path,
            from: res.data.data.from
          })
        }
      })
    }

  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },

}
</script>

<style lang="scss">
.out-container {
  position: relative;
  height: 100%;
}

.contents {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100% - 7rem);
}

.main-content {
  margin-left: 17.5rem;
  position: relative;
  z-index: 10;
}

.dark-bg {
  position: fixed;
  transition: all 0.3s ease;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 1);
  z-index: 19;
  opacity: 0;
  visibility: hidden;

  &.open {
    opacity: 1;
    visibility: visible;
  }
}

@media screen and (max-width: 480px) {
  .contents {
    height: calc(100vh - 4rem) !important;
  }

  .main-content {
    margin-left: 0;
    transition: all 0.3s;
    &.open {
      transform: scale(0.9);
      opacity: 0;
    }
  }
}
</style>

<style lang="scss">
</style>