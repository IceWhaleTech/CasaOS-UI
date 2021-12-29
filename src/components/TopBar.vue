<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-12-29 13:54:39
 * @Description: Top bar 
 * @FilePath: /CasaOS-UI/src/components/TopBar.vue
-->

<template>
  <div class="navbar top-bar is-flex is-align-items-center">
    <div class="navbar-brand ml-3">

      <!-- SideBar Button Start -->
      <div class="is-flex is-align-items-center mr-3 ml-3" id="sidebar-btn">
        <b-tooltip :label="sidebarIconLabel" position="is-right" type="is-dark">
          <p role="button" @click="showSideBar">
            <b-icon :icon="sidebarIcon"></b-icon>
          </p>
        </b-tooltip>
      </div>
      <!-- SideBar Button Start -->

      <!-- Account Dropmenu Start -->
      <b-dropdown aria-role="list" class="navbar-item " animation="slide-fade" @active-change="getUserInfo">
        <template #trigger>
          <b-tooltip :label="$t('Account')" position="is-right" type="is-dark">
            <p role="button">
              <b-icon icon="account-circle"></b-icon>
            </p>
          </b-tooltip>
        </template>

        <b-dropdown-item aria-role="menu-item" :focusable="false" custom>
          <h2 class="title is-4">{{$t('Account')}}</h2>

          <div class="is-flex is-align-items-center item">
            <div class="is-flex is-align-items-center flex1">
              <b-image :src="require('@/assets/img/Account.png')" class="is-40x40 mr-3" rounded></b-image>
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
              <b-button type="is-dark" size="is-small" class="ml-2" rounded @click="logout">{{$t('Logout')}}</b-button>
            </div>
          </div>

        </b-dropdown-item>
      </b-dropdown>
      <!-- Account Dropmenu End -->

      <!-- Settings Dropmenu Start -->
      <b-dropdown aria-role="list" class="navbar-item" animation="slide-fade" @active-change="onOpen">
        <template #trigger>
          <b-tooltip :label="$t('Settings')" position="is-right" type="is-dark">
            <p role="button">
              <b-icon icon="tune"></b-icon>
            </p>
          </b-tooltip>
        </template>

        <b-dropdown-item aria-role="menu-item" :focusable="false" custom>
          <h2 class="title is-4">{{$t('Dashboard Setting')}}</h2>
          <div class="is-flex is-align-items-center mb-2">
            <div class="is-flex is-align-items-center flex1">
              <b-icon icon="magnify" class="mr-1" custom-size="mdi-18px"></b-icon> <b>{{$t('Search Engine')}}</b>
            </div>
            <div>
              <b-field>
                <b-select size="is-small" class="set-select" v-model="barData.search_engine" @input="saveData">
                  <option value="https://duckduckgo.com/?q=">DuckDuckGo</option>
                  <option value="https://www.google.com/search?q=">Google</option>
                  <option value="https://www.bing.com/search?q=">Bing</option>
                </b-select>
              </b-field>
            </div>
          </div>

          <div class="is-flex is-align-items-center mb-2">
            <div class="is-flex is-align-items-center flex1">
              <b-icon icon="translate" class="mr-1" custom-size="mdi-18px"></b-icon> <b>{{ $t('Language') }}</b>
            </div>
            <div>
              <b-field>
                <b-select size="is-small" class="set-select" v-model="barData.lang" @input="saveData">
                  <option value="en">English</option>
                  <option value="zh">简体中文</option>
                </b-select>

              </b-field>
            </div>
          </div>

          <div class="is-flex is-align-items-center mb-1">
            <div class="is-flex is-align-items-center flex1">
              <b-icon icon="view-dashboard-outline" class="mr-1" custom-size="mdi-18px"></b-icon> <b>{{$t('WebUI Port')}}</b>
            </div>
            <div>
              {{port}}
            </div>
          </div>
          <div class="is-flex is-align-items-center is-justify-content-end update-container  mb-2">
            <div class="flex1"></div>
            <b-button type="is-dark" size="is-small" rounded @click="showPortPanel">{{$t('Edit')}}</b-button>
          </div>

          <div class="is-flex is-align-items-center item">
            <div class="is-flex is-align-items-center flex1">
              <b-icon icon="sync" class="mr-1" custom-size="mdi-18px"></b-icon> <b>{{$t('Update')}}</b>
            </div>
            <div>
              v{{updateInfo.current_version}}
            </div>
            <!-- <b-field>
              <b-switch v-model="barData.auto_update" type="is-dark" size="is-small" class="is-flex-direction-row-reverse mr-0" @input="saveData">
                Auto-Check
              </b-switch>
            </b-field> -->
          </div>

          <div class="is-flex is-align-items-center pl-55" v-if="!updateInfo.is_need">
            {{$t(latestText)}}
            <b-icon type="is-success" icon="check" class="ml-1" custom-size="mdi-18px"></b-icon>
          </div>
          <div class="is-flex is-align-items-center is-justify-content-end update-container pl-5" v-if="updateInfo.is_need">
            <div class="flex1">{{$t(updateText)}}</div>
            <b-button type="is-dark" size="is-small" class="ml-2" :loading="isUpdating" rounded @click="updateSystem">{{$t('Update')}}</b-button>
          </div>

        </b-dropdown-item>
      </b-dropdown>
      <!-- Settings Dropmenu End -->

      <!-- Terminal  Start -->
      <div class="is-flex is-align-items-center ml-3">
        <b-tooltip :label="$t('Terminal & Logs')" position="is-right" type="is-dark">
          <p role="button" @click="showTerminalPanel">
            <b-icon icon="console"></b-icon>
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
import AccountPanel from './AccountPanel.vue'
import TerminalPanel from './TerminalPanel.vue'
import PortPanel from './PortPanel.vue'
export default {
  name: "top-bar",
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
      port: ""
    }
  },
  created() {
    this.getConfig();
    this.getPort();

  },
  computed: {
    sidebarIcon() {
      return this.$store.state.sidebarOpen ? "close" : "menu"
    },
    sidebarIconLabel() {
      return this.$store.state.sidebarOpen ? "Hide Sidebar" : "Show SideBar"
    }
  },
  mounted() {
    this.checkVersion();
    this.getUserInfo();
  },

  methods: {
    // getInitLang
    getInitLang() {
      let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : this.getLangFromBrowser()
      return lang
    },
    // Get Default Lang from browser
    getLangFromBrowser() {
      var lang = navigator.language || navigator.userLanguage;
      lang = lang.substr(0, 2);
      return lang
    },

    setLang(lang) {
      localStorage.setItem('lang', lang)
      this.$i18n.locale = lang;
    },
    /**
     * @description: Get CasaOs Configs
     * @return {*} void
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
          this.setLang(res.data.data.lang)
          this.updateStore()

          this.$emit('changeSiteLoading')
        }
      })
    },

    /**
     * @description: Save CasaOs Configs
     * @return {*} void
     */
    saveData() {
      this.$api.info.saveSystemConfig(this.barData);
      this.setLang(this.barData.lang);
      this.updateStore();
    },
    /**
     * @description: Update search Engine in store
     * @return {*} void
     */
    updateStore() {
      this.$store.commit('changeSearchEngine', this.barData.search_engine);
    },

    /**
     * @description: Get CasaOs WebUI port
     * @return {*} void
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
     * @return {*} void
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
        animation: "zoom-out",
        events: {

        },
        props: {
          initPort: this.port
        }
      })
    },

    /**
     * @description: Handle Dropmenu state
     * @param {Boolean} isOpen
     * @return {*} void
     */
    onOpen(isOpen) {
      if (isOpen) {
        this.checkVersion()
      }
    },


    checkVersion() {
      this.$api.info.checkVersion().then(res => {
        if (res.data.success == 200) {
          this.updateInfo = res.data.data
        }
      })
    },

    /**
     * @description: Update System Version and check update state
     * @return {*} void
     */
    updateSystem() {
      this.isUpdating = true;
      this.$api.info.updateSystem().then(res => {
        if (res.data.success == 200) {
          console.log(res.data.data);
        }
      });
      this.checkUpdateState();
    },
    /**
     * @description: check update state if is_need is false then reload page
     * @return {*} void
     */
    checkUpdateState() {
      this.timer = setInterval(() => {
        this.$api.info.checkVersion().then(res => {
          if (res.data.success == 200) {
            if (!res.data.data.is_need) {
              clearInterval(this.timer);
              location.reload();
            }
          }
        })
      }, 3000)
    },
    /**
     * @description: Logout
     * @return {*} void
     */
    logout() {
      this.$router.push("/logout");
    },
    /**
     * @description: Get user info
     * @return {*} void
     */

    getUserInfo() {
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
        animation: "zoom-out",
        events: {

        },
        props: {

        }
      })
    },
    /**
     * @description: Show Terminal panel
     * @return {*} void
     */
    showTerminalPanel() {
      this.$buefy.modal.open({
        parent: this,
        component: TerminalPanel,
        hasModalCard: true,
        customClass: 'terminal-modal',
        trapFocus: true,
        canCancel: [],
        scroll: "keep",
        animation: "zoom-out",
      })
    },

    /**
     * @description: Show SideBar
     * @return {*} void
     */
    showSideBar() {
      this.$store.commit('changeSideBarState')
    },



  },

}
</script>
