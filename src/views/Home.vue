<!--
 * @Author: JerryK
 * @Date: 2021-10-20 16:34:15
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-24 17:42:34
 * @Description: 
 * @FilePath: /CasaOS-UI/src/views/Home.vue
-->
<template>
  <div v-if="!isLoading" class="out-container">
    <!-- NavBar Start -->
    <top-bar v-animate-css="topBarAni" @showSideBar="showSideBar"></top-bar>
    <!-- NavBar End -->

    <!-- Content Start -->
    <div class="contents  pt-55 contextmenu-canvas" @contextmenu.prevent="openHomeContaxtMenu">
      <div class="container">
        <div class="is-flex">
          <!-- SideBar Start -->
          <side-bar v-if="!hardwareInfoLoading"></side-bar>
          <!-- <div class="dark-bg" :class="{'open':sidebarOpen}"></div> -->
          <!-- SideBar End -->

          <!-- MainContent Start -->
          <div class="main-content contextmenu-canvas" :class="{'open':sidebarOpen}">
            <!-- SearchBar Start -->
            <section>
              <search-bar></search-bar>
            </section>
            <!-- SearchBar End -->

            <!-- core-service Start -->
            <section>
              <core-service></core-service>
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

const wallpaperConfig = "wallpaper"

export default {
  name: "home-page",
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
      user_id: localStorage.getItem("user_id"),
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
  created() {
    this.getHardwareInfo();
    this.getWallpaperConfig();
  },
  mounted() {
    this.isLoading = false

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
      this.$api.info.utilization().then(res => {
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
        console.log(res.data.data);
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