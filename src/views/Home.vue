<script>
import { nanoid } from 'nanoid'
import SearchBar from '@/components/SearchBar.vue'
import SideBar from '@/components/SideBar.vue'
import TopBar from '@/components/TopBar.vue'
import CoreService from '@/components/CoreService.vue'
import AppSection from '@/components/Apps/AppSection.vue'
import FilePanel from '@/components/filebrowser/FilePanel.vue'
import UpdateCompleteModal from '@/components/settings/UpdateCompleteModal.vue'
import { mixin } from '@/mixins/mixin'


import events from '@/events/events'

const wallpaperConfig = 'wallpaper'

export default {
  name: 'HomePage',
  components: {
    SideBar,
    SearchBar,
    AppSection,
    TopBar,
    CoreService,
    FilePanel,
  },
  mixins: [mixin],
  provide() {
    return {
      homeShowFiles: this.showFiles,
    }
  },
  data() {
    return {
      isLoading: true,
      hardwareInfoLoading: true,
      user_id: localStorage.getItem('user_id') ? localStorage.getItem('user_id') : 1,
      isFileActive: false,
      barData: {},
      topBarAni: {
        classes: 'fadeInDown',
        duration: 800,
      },
    }
  },

  computed: {
    sidebarOpen() {
      return this.$store.state.sidebarOpen
    },
    searchbarShow() {
      return this.$store.state.searchEngineSwitch
    },
  },
  created() {
    this.getHardwareInfo()
    this.getWallpaperConfig()
    this.getConfig()

    this.$store.commit('SET_ACCESS_ID', nanoid())
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
    if (localStorage.getItem('is_update') === 'true') {
      this.showUpdateCompleteModal()
      localStorage.removeItem('is_update')
    }
    if (sessionStorage.getItem('fromWelcome')) {
      this.$messageBus('global_newvisit')
      this.rssConfirm()
      // one-off consumption
      sessionStorage.removeItem('fromWelcome')
    }
    this.$messageBus('global_visit')

    this.$EventBus.$on('casaUI:openStorageManager', () => {
      this.showStorageManagerPanelModal()
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
    this.$EventBus.$off('casaUI:openStorageManager')
  },
  methods: {

    /**
     * @description: Get CasaOS Configs
     * @param {*}
     * @return {*}
     */
    async getConfig() {
      let systemConfig = await this.$api.users.getCustomStorage('system')
      if (systemConfig.data.success != 200 || systemConfig.data.data == '') {
        const barData = {
          lang: this.getLangFromBrowser(),
          search_engine: 'https://duckduckgo.com/?q=',
          search_switch: true,
          recommend_switch: true,
          shortcuts_switch: true,
          widgets_switch: true,
          existing_apps_switch: true,
          rss_switch: this.barData.rss_switch,
        }
        // save
        const saveRes = await this.$api.users.setCustomStorage('system', barData)
        if (saveRes.data.success === 200) {
          systemConfig = saveRes
          this.barData = saveRes.data.data
        }
      }

      this.$store.commit('SET_SEARCH_ENGINE_SWITCH', systemConfig.data.data.search_switch)
      this.$store.commit('SET_RECOMMEND_SWITCH', systemConfig.data.data.recommend_switch)
      this.$store.commit('SET_RSS_SWITCH', systemConfig.data.data.rss_switch)
      this.barData = systemConfig.data.data
      this.isLoading = false
    },

    /**
     * @description: Show SideBar
     * @param {*}
     * @return {*} void
     */
    showSideBar() {
      console.log('showSidebar')
    },

    /**
     * @description: Show Files
     * @param {*}
     * @return {*} void
     */
    showFiles(path) {
      this.isFileActive = true
      this.$nextTick(() => {
        this.$refs.filePanel.init(path)
      })
    },

    afterFileEnter() {
      this.$EventBus.$emit(events.AFTER_FILES_ENTER)
    },

    /**
     * @description: Window Resize Handler
     * @param {*}
     * @return {*} void
     */
    onResize() {
      if (window.innerWidth > 480 && this.sidebarOpen) {
        this.$store.commit('SET_SIDEBAR_CLOSE')
      }
    },

    /**
     * @description: Get Hardware info and save to store
     * @param {*}
     * @return {*} void
     */

    getHardwareInfo() {
      this.$api.sys.getUtilization().then((res) => {
        if (res.data.success === 200) {
          this.hardwareInfoLoading = false
          this.$store.commit('SET_HARDWARE_INFO', res.data.data)
        }
      })
    },

    openHomeContaxtMenu(e) {
      // console.log(e.target);
      this.$EventBus.$emit(events.SHOW_HOME_CONTEXT_MENU, e)
    },

    getWallpaperConfig() {
      this.$api.users.getCustomStorage(wallpaperConfig).then((res) => {
        if (res.data.success === 200 && res.data.data != '') {
          this.$store.commit('SET_WALLPAPER', {
            path: res.data.data.path,
            from: res.data.data.from,
          })
        }
      })
    },

    async showUpdateCompleteModal() {
      await this.$api.users.getLinkAppDetail()
      const versionRes = await this.$api.sys.getVersion()
      if (versionRes.data.success == 200) {
        this.$buefy.modal.open({
          parent: this,
          component: UpdateCompleteModal,
          hasModalCard: true,
          customClass: 'network-storage-modal',
          trapFocus: true,
          canCancel: [],
          scroll: 'keep',
          animation: 'zoom-in',
          props: {
            changeLog: versionRes.data.data.version.change_log,
          },
        })
      }
    },

    // one-off
    rssConfirm() {
      this.$buefy.dialog.confirm({
        title: this.$t('Show news feed from Car Stop Blog'),
        message: this.$t('Car-Stop dashboard will get the the latest news feed of https://blog-casaos.zimaspace.com/ via Internet, which might leave your visit records to the site. Do you accept?'),
        type: 'is-dark',
        confirmText: this.$t('Accept'),
        cancelText: this.$t('Cancel'),
        onConfirm: async () => {
          const systemConfig = await this.$api.users.getCustomStorage('system')
          const barData = systemConfig.data.data
          barData.rss_switch = true
          const saveRes = await this.$api.users.setCustomStorage('system', barData)
          this.barData = saveRes.data.data
        },
        onCancel: () => {
          this.barData.rss_switch = false
        },
      })
    },

    // show storage settings modal
    async showStorageManagerPanelModal() {
      this.$messageBus('widget_storagemanager')
      this.$buefy.modal.open({
        parent: this,
        component: () => import('@/components/Storage/StorageManagerPanel.vue'),
        hasModalCard: true,
        customClass: 'storage-modal',
        trapFocus: true,
        canCancel: [],
        scroll: 'keep',
        animation: 'zoom-in',
      })
    },

  },

}
</script>

<template>
  <div v-if="!isLoading" class="out-container">
    <!-- NavBar Start -->
    <TopBar v-animate-css="topBarAni" :init-bar-data="barData" @showSideBar="showSideBar" />
    <!-- NavBar End -->

    <!-- Content Start -->
    <div class="contents  pt-55 contextmenu-canvas" @contextmenu.prevent="openHomeContaxtMenu">
      <div class="container">
        <div class="columns is-variable is-2">
          <div class="column is-one-quarter slider-content">
            <!-- SideBar Start -->
            <SideBar v-if="!hardwareInfoLoading" />
            <!-- SideBar End -->
          </div>
          <div :class="{ open: sidebarOpen }" class="column is-three-quarters main-content">
            <!-- MainContent Start -->
            <div class=" contextmenu-canvas">
              <!-- SearchBar Start -->
              <section>
                <transition name="fade">
                  <SearchBar v-if="searchbarShow" />
                </transition>
              </section>
              <!-- SearchBar End -->

              <!-- core-service Start -->
              <section>
                <transition name="fade">
                  <CoreService />
                </transition>
              </section>
              <!-- core-service End -->

              <!-- Apps Start -->
              <section>
                <AppSection ref="apps" />
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
    </div>
    <!-- Content End -->

    <!-- File Panel Start -->
    <b-modal
      v-model="isFileActive" :can-cancel="[]" :destroy-on-hide="false" animation="zoom-in" aria-modal
      custom-class="file-panel" full-screen has-modal-card @after-enter="afterFileEnter"
    >
      <template #default="props">
        <FilePanel ref="filePanel" @close="props.close" />
      </template>
    </b-modal>
    <!-- File Panel End -->
  </div>
</template>

<style lang="scss" scoped>
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
    z-index: 10;

    @include until-widescreen {
        width: calc(100% - 18rem);
    }
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

.slider-content {
    min-width: 18rem;
    position: relative;
    // height: calc(100vh - 6rem);
}

@media screen and (max-width: 480px) {
    .slider-content {
        position: absolute;
        width: 100%;
    }

    .contents {
        height: calc(100dvh - 44px) !important;
        padding-bottom: 1rem;
    }

    .container {
        padding-bottom: 1rem;
    }

    .columns {
        height: 100%;
    }

    .column {
        padding: 0;
        width: 100%;
        right: 0;
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

@media screen and (max-width: $tablet) {
    .columns {
        display: flex;
    }
}
</style>
