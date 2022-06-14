<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-14 13:40:51
 * @Description: Top bar 
 * @FilePath: \CasaOS-UI\src\components\TopBar.vue
-->

<template>
  <div class="navbar top-bar is-flex is-align-items-center">
    <div class="navbar-brand ml-3">

      <!-- SideBar Button Start -->
      <div class="is-flex is-align-items-center mr-3 ml-3" id="sidebar-btn">
        <b-tooltip :label="sidebarIconLabel" :active="!$store.state.isMobile" position="is-right" type="is-dark">
          <p role="button" @click="showSideBar">
            <b-icon :icon="sidebarIcon"></b-icon>
          </p>
        </b-tooltip>
      </div>
      <!-- SideBar Button Start -->

      <!-- Account Dropmenu Start -->
      <b-dropdown aria-role="list" class="navbar-item " animation="fade1" @active-change="getUserInfo">
        <template #trigger>
          <b-tooltip :label="$t('Account')" :active="!$store.state.isMobile" position="is-right" type="is-dark">
            <p role="button">
              <b-icon class="picon" icon="account-circle"></b-icon>
            </p>
          </b-tooltip>
        </template>

        <b-dropdown-item aria-role="menu-item" :focusable="false" custom>
          <h2 class="title is-4">{{$t('Account')}}</h2>

          <div class="is-flex is-align-items-center item">
            <div class="is-flex is-align-items-center flex1">
              <b-image :src="require('@/assets/img/account/default-avatar.svg')" class="is-40x40 mr-3" rounded></b-image>
              <b>{{userInfo.user_name}}</b>
            </div>
            <div>
              <a aria-role="button" @click="showAccountPanel">
                <b-icon icon="account-edit"></b-icon>
              </a>
            </div>
          </div>

          <div class="is-flex is-align-items-center item mt-2">
            <div class="is-flex is-align-items-center flex1">
            </div>
            <div>
              <b-button type="is-dark" size="is-small" class="ml-2 " rounded @click="logout">{{$t('Logout')}}</b-button>
            </div>
          </div>

        </b-dropdown-item>
      </b-dropdown>
      <!-- Account Dropmenu End -->

      <!-- Settings Dropmenu Start -->
      <b-dropdown aria-role="list" class="navbar-item" animation="fade1" @active-change="onOpen">
        <template #trigger>
          <b-tooltip :label="$t('Settings')" :active="!$store.state.isMobile" position="is-right" type="is-dark">
            <p role="button">
              <b-icon icon="tune" class="picon" :class="{'update-icon-dot': updateInfo.is_need }"></b-icon>
            </p>
          </b-tooltip>
        </template>

        <b-dropdown-item aria-role="menu-item" :focusable="false" custom>
          <h2 class="title is-4">{{$t('Dashboard Setting')}}</h2>

          <!-- Search Engine Start -->
          <div class="is-flex is-align-items-center mb-2 h-30">
            <div class="is-flex is-align-items-center flex1">
              <b-icon icon="magnify" class="mr-1" custom-size="mdi-18px"></b-icon> <b>{{$t('Search Engine')}}</b>
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
            <div class="is-flex is-align-items-center flex1">
              <b-icon icon="translate" class="mr-1" custom-size="mdi-18px"></b-icon> <b>{{ $t('Language') }}</b>
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
            <div class="is-flex is-align-items-center flex1">
              <b-icon icon="view-dashboard-outline" class="mr-1" custom-size="mdi-18px"></b-icon> <b>{{$t('WebUI Port')}}</b>
            </div>
            <div>
              {{port}}
            </div>
            <div class="ml-2">
              <b-button type="is-dark" size="is-small" rounded @click="showPortPanel">{{$t('Edit')}}</b-button>
            </div>
          </div>
          <!-- WebUI Port End -->

          <!-- Automount USB Drive Start  -->
          <div class="is-flex is-align-items-center mb-2 h-30">
            <div class="is-flex is-align-items-center flex1">
              <b-icon icon="usb-flash-drive-outline" class="mr-1" custom-size="mdi-18px"></b-icon> <b>{{$t('Automount USB Drive')}}</b>
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
            <div class="is-flex is-align-items-center flex1">
              <b-icon icon="sync" class="mr-1" custom-size="mdi-18px"></b-icon> <b :class="{'update-text-dot': updateInfo.is_need}">{{$t('Update')}}</b>
            </div>
            <div>
              v{{updateInfo.current_version}}
            </div>
          </div>

          <div class="is-flex is-align-items-center pl-55 is-size-7" v-if="!updateInfo.is_need">
            {{$t(latestText)}}
            <b-icon type="is-success" icon="check" class="ml-1" custom-size="mdi-18px"></b-icon>
          </div>
          <div class="is-flex is-align-items-center is-justify-content-end update-container pl-5 " v-else>
            <div class="flex1 is-size-7">{{$t(updateText)}}</div>
            <b-button type="is-dark" size="is-small" class="ml-2" rounded @click="showUpdateModal">{{$t('Update')}}</b-button>
          </div>
          <!-- Update End -->

        </b-dropdown-item>
      </b-dropdown>
      <!-- Settings Dropmenu End -->

      <!-- Terminal  Start -->
      <div class="is-flex is-align-items-center ml-3">
        <b-tooltip :label="$t('Terminal & Logs')" :active="!$store.state.isMobile" position="is-right" type="is-dark">
          <p role="button" @click="showTerminalPanel">
            <b-icon class="picon" icon="console"></b-icon>
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

export default {
  name: "top-bar",
  mixins: [mixin],
  data() {
    return {
      timer: 0,
      barData: {
        auto_update: false,
        background: "",
        background_type: "",
        search_engine: "https://duckduckgo.com/?q=",
        search_switch: false,
        shortcuts_switch: false,
        widgets_switch: false,
        lang: this.getInitLang(),
      },
      updateInfo: {
        current_version: '0',
        is_need: false,
        version: Object
      },
      isUpdating: false,
      latestText: "Currently the latest version",
      updateText: "A new version is available!",
      userInfo: this.$store.state.userinfo,
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
  created() {
    this.getConfig();
    this.getPort();

  },
  mounted() {
    this.checkVersion();
    this.getUserInfo();
    this.getUsbMountState();
    this.getHardwareInfo();
  },

  methods: {
    /*************************************************
    * PART 0  Common
    **************************************************/
    /**
     * @description: Get CasaOs Configs
     * @param {*}
     * @return {*}
     */
    getConfig() {
      this.$api.info.systemConfig().then(res => {
        if (res.data == undefined || res.data == '') {
          this.barData.lang = this.getLangFromBrowser()
          this.$api.info.saveSystemConfig(this.barData).then(res => {
            if (res.data.success == 200) {
              this.getConfig()
            }
          });
        }
        if (res.data.success == 200) {
          this.barData = res.data.data
          let lang = res.data.data.lang
          lang = lang.includes("_") ? lang : "en_us";
          this.setLang(lang)
          this.updateStoreSearchEngine()
          this.$emit('changeSiteLoading')
        }
      })
    },

    /**
     * @description: Save CasaOs Configs
     * @param {*}
     * @return {*}
     */
    saveData() {
      this.$api.info.saveSystemConfig(this.barData);
      let lang = this.barData.lang
      lang = lang.includes("_") ? lang : "en_us";
      this.setLang(lang);
      this.updateStoreSearchEngine();
    },

    /**
     * @description: Handle Dropmenu state
     * @param {Boolean} isOpen
     * @return {*}
     */
    onOpen(isOpen) {
      if (isOpen) {
        this.$store.commit('closeSideBar')
        this.checkVersion()
      }
    },

    /**
     * @description: Show SideBar
     * @param {*}
     * @return {*}
     */
    showSideBar() {
      this.$store.commit('changeSideBarState')
    },


    /*************************************************
    * PART 1-1  Dashboard Setting - Search Engine
    **************************************************/
    /**
     * @description: Update search Engine in store
     * @param {*}
     * @return {*}
     */
    updateStoreSearchEngine() {
      this.$store.commit('changeSearchEngine', this.barData.search_engine);
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
      this.$api.info.getSystemPort().then(res => {
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


    /*************************************************
    * PART 1-4  Dashboard Setting - Auto USB Mount Switch
    **************************************************/
    /**
     * @description: Get Auto USB Mount State
     * @return {*} 
     */
    getUsbMountState() {
      this.$api.info.getUsbMountState().then(res => {
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
        this.$api.info.setUsbMountOn()
        // Show 
        if (this.isRaspberryPi) {
          this.$buefy.snackbar.open({
            message: this.$t('Enabling this function may cause boot failures when the Raspberry Pi device is booted from USB'),
            type: 'is-warning',
            position: 'is-top',
          })
        }

      } else {
        this.$api.info.setUsbMountOff()
      }
    },
    /**
     * @description: Get Hardware Info etc. Board Info
     * @param {*}
     * @return {*}
     */
    getHardwareInfo() {
      this.$api.info.hardwareInfo().then(res => {
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
      this.$api.info.checkVersion().then(res => {
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
    getUserInfo() {
      this.$store.commit('closeSideBar')
      this.$api.user.getUserInfo().then((res) => {
        if (res.data.success == 200) {
          this.$store.commit('changeUserInfo', res.data.data)
          this.userInfo = res.data.data
        }
      })
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
      this.$store.commit('closeSideBar')
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
