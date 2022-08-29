<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-22 14:50:09
 * @Description: Top bar 
 * @FilePath: \CasaOS-UI-dev\src\components\TopBar.vue
-->

<template>
  <div class="navbar top-bar is-flex is-align-items-center">
    <div class="navbar-brand ml-4">

      <!-- SideBar Button Start -->
      <div class="is-flex is-align-items-center mr-3 ml-3" id="sidebar-btn">
        <b-tooltip :label="sidebarIconLabel" :active="!$store.state.isMobile" position="is-right" type="is-dark">
          <div role="button" @click="showSideBar">
            <b-icon :icon="sidebarIcon" class="picon"></b-icon>
          </div>
        </b-tooltip>
      </div>
      <!-- SideBar Button Start -->

      <!-- Account Dropmenu Start -->
      <b-dropdown aria-role="list" class="navbar-item " animation="fade1" @active-change="getUserInfo">
        <template #trigger>
          <b-tooltip :label="$t('Account')" :active="!$store.state.isMobile" position="is-right" type="is-dark">
            <p role="button">
              <b-icon pack="casa" class="picon" icon="account"></b-icon>
            </p>
          </b-tooltip>
        </template>

        <b-dropdown-item aria-role="menu-item" :focusable="false" custom>
          <h2 class="title is-4">{{$t('Account')}}</h2>

          <div class="is-flex is-align-items-center item">
            <div class="is-flex is-align-items-center is-flex-grow-1">
              <b-image :src="require('@/assets/img/account/default-avatar.svg')" class="is-40x40 mr-3" rounded></b-image>
              <b>{{userInfo.username}}</b>
            </div>
            <div>
              <a aria-role="button" @click="showAccountPanel">
                <b-icon pack="casa" icon="account-edit"></b-icon>
              </a>
            </div>
          </div>

          <div class="is-flex is-align-items-center item mt-2">
            <div class="is-flex is-align-items-center  is-flex-grow-1">
            </div>
            <div>
              <b-button type="is-dark" size="is-small" class="ml-2 " rounded @click="logout">{{$t('Logout')}}</b-button>
            </div>
          </div>

        </b-dropdown-item>
      </b-dropdown>
      <!-- Account Dropmenu End -->

      <!-- Settings Dropmenu Start -->
      <b-dropdown aria-role="list" ref="settingsDrop" class="navbar-item" animation="fade1" @active-change="onOpen">
        <template #trigger>
          <b-tooltip :label="$t('Settings')" :active="!$store.state.isMobile" position="is-right" type="is-dark">
            <p role="button">
              <b-icon pack="casa" icon="tune" class="picon" :class="{'update-icon-dot': updateInfo.need_update }"></b-icon>
            </p>
          </b-tooltip>
        </template>

        <b-dropdown-item aria-role="menu-item" :focusable="false" custom>
          <h2 class="title is-4">{{$t('Dashboard Setting')}}</h2>

          <!-- Search Engine Switch Start  -->
          <div class="is-flex is-align-items-center mb-2 h-30">
            <div class="is-flex is-align-items-center is-flex-grow-1">
              <b-icon pack="casa" icon="search-manage" class="mr-1"></b-icon> <b>{{$t('Show Search Bar')}}</b>
            </div>
            <div>
              <b-field>
                <b-switch type="is-dark" class="is-flex-direction-row-reverse mr-0" v-model="barData.search_switch" @input="saveData"></b-switch>
              </b-field>
            </div>
          </div>
          <!-- Search Engine Switch End  -->

          <!-- Search Engine Start -->
          <div class="is-flex is-align-items-center mb-2 h-30" v-if="barData.search_switch">
            <div class="is-flex is-align-items-center is-flex-grow-1">
              <b-icon pack="casa" icon="magnifier" class="mr-1"></b-icon> <b>{{$t('Search Engine')}}</b>
            </div>
            <div>
              <b-field>
                <b-select size="is-small" class="set-select" v-model="barData.search_engine" @input="saveData">
                  <option v-for="item in searchEngines" :key="item.name" :value="item.url">{{item.name}}</option>
                </b-select>
              </b-field>
            </div>
          </div>
          <!-- Search Engine End -->

          <!-- Language Start -->
          <div class="is-flex is-align-items-center mb-2 h-30">
            <div class="is-flex is-align-items-center is-flex-grow-1">
              <b-icon pack="casa" icon="language" class="mr-1"></b-icon> <b>{{ $t('Language') }}</b>
            </div>
            <div>
              <b-field>
                <b-select size="is-small" class="set-select" v-model="barData.lang" @input="saveData">
                  <option v-for="lang in languages" :key="lang.lang" :value="lang.lang">{{lang.name}}</option>
                </b-select>
              </b-field>
            </div>
          </div>
          <!-- Language End -->

          <!-- WebUI Port Start -->
          <div class="is-flex is-align-items-center mb-2 h-30">
            <div class="is-flex is-align-items-center is-flex-grow-1">
              <b-icon pack="casa" icon="port" class="mr-1"></b-icon> <b>{{$t('WebUI Port')}}</b>
            </div>
            <div>
              {{port}}
            </div>
            <div class="ml-2">
              <b-button type="is-dark" size="is-small" rounded @click="showPortPanel">{{$t('Change')}}</b-button>
            </div>
          </div>
          <!-- WebUI Port End -->

          <!-- Background Start -->
          <div class="is-flex is-align-items-center mb-2 h-30">
            <div class="is-flex is-align-items-center is-flex-grow-1">
              <b-icon pack="casa" icon="picture" class="mr-1"></b-icon> <b>{{$t('Wallpaper')}}</b>
            </div>
            <div class="ml-2">
              <b-button type="is-dark" size="is-small" rounded @click="showChangeWallpaperModal">{{$t('Change')}}</b-button>
            </div>
          </div>
          <!-- Background End -->

          <!--  Recommended modules Switch Start  -->
          <div class="is-flex is-align-items-center mb-2 h-30">
            <div class="is-flex is-align-items-center is-flex-grow-1">
              <b-icon pack="casa" icon="app-switch" class="mr-1"></b-icon> <b>{{$t('Show Recommended Apps')}}</b>
            </div>
            <div>
              <b-field>
                <b-switch type="is-dark" class="is-flex-direction-row-reverse mr-0" v-model="barData.recommend_switch" @input="saveData"></b-switch>
              </b-field>
            </div>
          </div>
          <!-- Recommended modules Switch End  -->

          <!-- Automount USB Drive Start  -->
          <div class="is-flex is-align-items-center mb-2 h-30">
            <div class="is-flex is-align-items-center is-flex-grow-1">
              <b-icon pack="casa" icon="usb" class="mr-1"></b-icon> <b>{{$t('Automount USB Drive')}}</b>
              <b-tooltip :label="$t('Enabling this function may cause boot failures when the Raspberry Pi device is booted from USB')" type="is-dark" multilined v-if="isRaspberryPi">
                <b-icon icon="help-circle-outline" size="is-small" class="ml-1"></b-icon>
              </b-tooltip>
            </div>
            <div>
              <b-field>
                <b-switch v-model="autoUsbMount" type="is-dark" class="is-flex-direction-row-reverse mr-0" @input="usbAutoMount"></b-switch>
              </b-field>
            </div>
          </div>
          <!-- Automount USB Drive End  -->

          <!-- Update Start -->
          <div class="is-flex is-align-items-center h-30">
            <div class="is-flex is-align-items-center is-flex-grow-1">
              <b-icon pack="casa" icon="upgrade" class="mr-1"></b-icon> <b :class="{'update-text-dot': updateInfo.need_update}">{{$t('Update')}}</b>
            </div>
            <div>
              v{{updateInfo.current_version}}
            </div>
          </div>

          <div class="is-flex is-align-items-center pl-55 is-size-7" v-if="!updateInfo.need_update">
            {{$t(latestText)}}
            <b-icon type="is-success" icon="check" class="ml-1" custom-size="mdi-18px"></b-icon>
          </div>
          <div class="is-flex is-align-items-center is-justify-content-end update-container pl-5 " v-else>
            <div class="is-flex-grow-1 is-size-7">{{$t(updateText)}}</div>
            <b-button type="is-dark" size="is-small" class="ml-2" rounded @click="showUpdateModal">{{$t('Update')}}</b-button>
          </div>
          <!-- Update End -->

        </b-dropdown-item>
      </b-dropdown>
      <!-- Settings Dropmenu End -->

      <!-- Terminal  Start -->
      <div class="is-flex is-align-items-center ml-2">
        <b-tooltip :label="$t('Terminal & Logs')" :active="!$store.state.isMobile" position="is-right" type="is-dark">
          <p role="button" @click="showTerminalPanel">
            <b-icon pack="casa" class="picon" icon="terminal"></b-icon>
          </p>
        </b-tooltip>
      </div>
      <!-- Terminal  End -->
    </div>

    <div class="navbar-menu">
      <div class="navbar-end mr-3">
        <!-- <b-icon pack="far" icon="comment-alt"></b-icon> -->
      </div>
    </div>

  </div>
</template>

<script>
import AccountPanel from './account/AccountPanel.vue'
import TerminalPanel from './logsAndTerminal/TerminalPanel.vue'
import PortPanel from './settings/PortPanel.vue'
import UpdateModal from './settings/UpdateModal.vue'
import { mixin } from '../mixins/mixin';

import events from '@/events/events';

const systemConfigName = "system"

export default {
  name: "top-bar",
  mixins: [mixin],
  data() {
    return {
      timer: 0,
      // User
      userInfo: this.$store.state.user,
      // System
      barData: {
        lang: this.getInitLang(),
        search_engine: "https://duckduckgo.com/?q=",
        search_switch: true,
        recommend_switch: true,
        shortcuts_switch: false, // Not used
        widgets_switch: false, // Not used
      },
      updateInfo: {
        current_version: '0',
        need_update: false,
        version: Object
      },
      isUpdating: false,
      latestText: "Currently the latest version",
      updateText: "A new version is available!",

      port: "",
      autoUsbMount: false,
      deviceModel: "",
      // Language Sets
      languages: [
        { lang: "de_de", name: "Deutsch" },
        { lang: "en_us", name: "English" },
        { lang: "es_es", name: "Español" },
        { lang: "fr_fr", name: "Français" },
        { lang: "it_it", name: "Italiano" },
        { lang: "ru_ru", name: "Русский" },
        { lang: "pl_pl", name: "Polska" },
        { lang: "pt_br", name: "Português (Brasil)" },
        { lang: "zh_cn", name: "简体中文" },
      ],
      // Search Engine Sets
      searchEngines: [
        { url: "https://duckduckgo.com/?q=", name: "DuckDuckGo" },
        { url: "https://www.google.com/search?q=", name: "Google" },
        { url: "https://www.bing.com/search?q=", name: "Bing" },
      ]
    }
  },
  props: {
    initBarData: {
      type: Object
    },
  },
  computed: {
    sidebarIcon() {
      return this.$store.state.sidebarOpen ? "close" : "menu"
    },
    sidebarIconLabel() {
      return this.$store.state.sidebarOpen ? "Hide Sidebar" : "Show SideBar"
    },
    isRaspberryPi() {
      return this.deviceModel.toLowerCase().indexOf("raspberry") >= 0
    }
  },
  watch: {
    'barData.lang': {
      handler(val) {
        const lang = val.includes("_") ? val : "en_us";
        this.setLang(lang)
      },
      deep: true
    },
    'barData.search_engine': {
      handler(val) {
        this.$store.commit('SET_SEARCH_ENGINE', val);
      },
      deep: true
    },
    'barData.search_switch': {
      handler(val) {
        this.$store.commit('SET_SEARCH_ENGINE_SWITCH', val);
      },
      deep: true
    },
    'barData.recommend_switch': {
      handler(val) {
        this.$store.commit('SET_RECOMMEND_SWITCH', val);
      },
      deep: true
    },
    initBarData(val) {
      this.barData = val
    },

  },
  created() {
    this.barData = this.initBarData
    // this.getConfig();
    this.getPort();
  },
  mounted() {
    this.checkVersion();
    this.getUserInfo();
    this.getUsbStatus();
    this.getHardwareInfo();
  },

  methods: {
    /*************************************************
    * PART 0  Common
    **************************************************/
    /**
     * @description: Save CasaOs Configs
     * @param {*}
     * @return {*}
     */
    async saveData() {
      const saveRes = await this.$api.users.setCustomStorage(systemConfigName, this.barData)
      if (saveRes.data.success === 200) {
        this.barData = saveRes.data.data
      }
    },

    /**
     * @description: Handle Dropmenu state
     * @param {Boolean} isOpen
     * @return {*}
     */
    onOpen(isOpen) {
      if (isOpen) {
        this.$store.commit('SET_SIDEBAR_CLOSE')
        this.checkVersion()
      }
    },

    /**
     * @description: Show SideBar
     * @param {*}
     * @return {*}
     */
    showSideBar() {
      this.$store.commit('TOOGLE_SIDEBAR_STATE')
    },


    /*************************************************
    * PART 1-2  Dashboard Setting - Language
    **************************************************/

    /**
     * @description: Get Initnal Language
     * @param {*}
     * @return {String} lang
     */
    getInitLang() {
      let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : this.getLangFromBrowser()
      lang = lang.includes("_") ? lang : "en_us";
      return lang
    },

    /*************************************************
    * PART 1-3  Dashboard Setting - Web UI Port
    **************************************************/

    /**
     * @description: Get CasaOs WebUI port
     * @return {*} 
     */
    getPort() {
      this.$api.sys.getServerPort().then(res => {
        if (res.data.success == 200) {
          this.port = res.data.data
        }
      })
    },

    /**
     * @description: Show Port panel
     * @return {*} 
     */
    showPortPanel() {
      this.$refs.settingsDrop.toggle()
      this.$buefy.modal.open({
        parent: this,
        component: PortPanel,
        hasModalCard: true,
        customClass: 'account-modal',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        props: {
          initPort: this.port
        }
      })
    },
    showChangeWallpaperModal() {
      this.$EventBus.$emit(events.SHOW_CHANGE_WALLPAPER_MODAL);
      this.$refs.settingsDrop.toggle()
    },


    /*************************************************
    * PART 1-4  Dashboard Setting - Auto USB Mount Switch
    **************************************************/
    /**
     * @description: Get Auto USB Mount State
     * @return {*} 
     */
    getUsbStatus() {
      this.$api.sys.getUsbStatus().then(res => {
        if (res.data.success == 200) {
          this.autoUsbMount = res.data.data === "True"
        }
      })
    },

    /**
     * @description: Enable or Disable USB Auto Mount
     * @param {*}
     * @return {*}
     */
    usbAutoMount() {
      if (this.autoUsbMount) {
        this.$api.sys.toggleUsbAutoMount({ state: "on" })
        // Show 
        if (this.isRaspberryPi) {
          this.$buefy.snackbar.open({
            message: this.$t('Enabling this function may cause boot failures when the Raspberry Pi device is booted from USB'),
            type: 'is-warning',
            position: 'is-top',
          })
        }

      } else {
        this.$api.sys.toggleUsbAutoMount({ state: "off" })
      }
    },
    /**
     * @description: Get Hardware Info etc. Board Info
     * @param {*}
     * @return {*}
     */
    getHardwareInfo() {
      this.$api.sys.hardwareInfo().then(res => {
        if (res.data.success == 200) {
          this.deviceModel = res.data.data.drive_model
        }
      })
    },

    /*************************************************
    * PART 1-5  Dashboard Setting - Update
    **************************************************/

    /**
     * @description: Get Version info 
     * @return {*} void
     */
    checkVersion() {
      this.$api.sys.getVersion().then(res => {
        if (res.data.success == 200) {
          this.updateInfo = res.data.data
        }
      })
    },

    /**
     * @description: Open Update Modal
     * @return {*} void
     */
    showUpdateModal() {
      this.$buefy.modal.open({
        parent: this,
        component: UpdateModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape'],
        scroll: 'keep',
        animation: 'zoom-in',
        props: {
          changeLog: this.updateInfo.version.change_log
        }
      })
    },

    /*************************************************
    * PART 2  Userinfo
    **************************************************/
    /**
     * @description: Get user info
     * @return {*} void
     */
    async getUserInfo() {
      this.userInfo = this.$store.state.user
      this.$store.commit('SET_SIDEBAR_CLOSE')
      if (this.$store.state.user.id == 0) {
        try {
          const userRes = await this.$api.users.getUserInfo()
          this.userInfo = userRes.data.data
          this.$store.commit('SET_USER', this.userInfo)
        } catch (error) {
          console.log(error)
        }
      }
    },

    /**
     * @description: Show Account panel
     * @return {*} void
     */
    showAccountPanel() {
      this.$buefy.modal.open({
        parent: this,
        component: AccountPanel,
        hasModalCard: true,
        customClass: 'account-modal',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
      })
    },

    logout() {
      this.$store.commit('SET_DEFAULT_WALLPAPER')
      this.$router.push("/logout");
    },


    /*************************************************
    * PART 3  Terminal
    **************************************************/

    /**
     * @description: Show Terminal panel
     * @return {*} void
     */
    showTerminalPanel() {
      this.$store.commit('SET_SIDEBAR_CLOSE')
      this.$buefy.modal.open({
        parent: this,
        component: TerminalPanel,
        hasModalCard: true,
        customClass: 'terminal-modal',
        trapFocus: true,
        canCancel: [],
        scroll: "keep",
        animation: "zoom-in",
      })
    },


  },

}
</script>

<style lang="scss" >
.top-bar {
  position: relative;
  z-index: 20;
  height: 3.75rem;
  background: rgba(255, 255, 255, 1);

  .navbar-brand {
    height: 3.75rem;

    .picon {
      cursor: pointer;
    }

    .dropdown + .dropdown {
      margin-left: 0;
    }

    .dropdown-trigger,
    .tooltip-trigger {
      height: 1.5rem;
    }

    .dropdown-menu {
      margin-top: 0.5rem;
      min-width: 20rem;

      .dropdown-content {
        background: rgba(255, 255, 255, 1);
        backdrop-filter: blur(1rem);

        .dropdown-item {
          padding: 0.875rem 1.25rem;
          text-align: left;

          .item {
            height: 2rem;
          }
        }
      }
    }
  }

  .set-select {
    .select {
      &::after {
        border-color: #000 !important;
      }
    }

    select {
      background-color: transparent !important;
      border-color: #000 !important;
    }
  }

  .field {
    line-height: 1rem;
  }

  .switch {
    &.is-flex-direction-row-reverse {
      .control-label {
        padding-left: 0;
        padding-right: calc(0.75em - 1px);
      }
    }
  }

  .update-container {
    .button.is-rounded {
      padding-left: calc(1em + 0.25em);
      padding-right: calc(1em + 0.25em);
      border-radius: 9999px !important;
    }
  }

  .button {
    &.is-small {
      height: 2em;
    }
  }
  .icon {
    color: rgb(74, 74, 74);
  }
}

.update-text-dot {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: $danger;
    right: -0.5rem;
    top: 0rem;
  }
}

.update-icon-dot {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: $danger;
    right: 0;
    top: 0;
  }
}

#sidebar-btn {
  display: none !important;
}
@media screen and (max-width: 480px) {
  #sidebar-btn {
    display: flex !important;
  }
}

@media (prefers-color-scheme: dark) {
  .top-bar {
    background: rgba(53, 54, 58, 1);
    .picon {
      color: #fff;
    }
  }
}
</style>
