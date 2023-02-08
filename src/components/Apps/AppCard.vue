<!--
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-08 00:22:01
 * @FilePath: \CasaOS-UI-0.4.2\src\components\Apps\AppCard.vue
  * @Description:
  *
  * Copyright (c) 2022 by IceWhale, All Rights Reserved.
  -->
<template>
  <div class="common-card is-flex is-align-items-center is-justify-content-center p-55 app-card"
       @mouseleave="hover = true" @mouseover="hover = true">

    <!-- Action Button Start -->
    <div v-if="item.type !== 'system' && isCasa && !isUninstalling" class="action-btn">
      <b-dropdown ref="dro" :mobile-modal="false" :triggers="['contextmenu', 'click']" animation="fade1"
                  append-to-body aria-role="list" class="app-card-drop" position="is-bottom-left"
                  @active-change="setDropState">
        <template #trigger>
          <p role="button">
            <b-icon class="is-clickable" icon="dots-horizontal"></b-icon>
          </p>
        </template>

        <b-dropdown-item :focusable="false" aria-role="menu-item" custom>
          <b-button expanded tag="a" type="is-text" @click="openApp(item)">{{ $t('Open') }}</b-button>
          <b-button expanded type="is-text" @click="configApp">{{ $t('Setting') }}</b-button>
          <b-button v-if="item.appstore_id != 0 && item.appstore_id != undefined" :loading="isCloning"
                    expanded type="is-text" @click="quickInstall(item.appstore_id)">{{
              $t('Clone')
            }}
          </b-button>

          <b-button expanded type="is-text" @click="checkAppVersion">{{
              $t('Check then update')
            }}
            <b-loading :active="isCheckThenUpdate || isUpdating" :is-full-page="false">
              <img :src="require('@/assets/img/loading/waiting.svg')" alt="pending"
                   class="ml-4 is-24x24"/>
            </b-loading>
          </b-button>


          <b-button v-if="item.appstore_id != undefined" class="mb-1 has-text-red" expanded type="is-text"
                    @click="uninstallConfirm">
            {{ $t('Uninstall') }}
            <b-loading v-model="isUninstalling" :is-full-page="false">
              <img :src="require('@/assets/img/loading/waiting.svg')" alt="pending"
                   class="ml-4 is-24x24"/>
            </b-loading>
          </b-button>

          <b-button v-else class="mb-1" expanded type="is-text" @click="uninstallApp(true)">
            {{ $t('Delete') }}
            <b-loading v-model="isUninstalling" :is-full-page="false">
              <img :src="require('@/assets/img/loading/waiting.svg')" alt="pending"
                   class="ml-4 is-24x24"/>
            </b-loading>
          </b-button>

          <div v-if="item.type !== 'LinkApp'" class="gap">
            <div class="columns is-gapless _b-bor is-flex">
              <div class="column is-flex is-justify-content-center is-align-items-center">
                <b-button :loading="isRestarting" expanded type="is-text" @click="restartApp">
                  <b-icon custom-size="mdi-18px" icon="sync"></b-icon>
                </b-button>
              </div>
              <div class="column is-flex is-justify-content-center is-align-items-center">
                <b-button :class="item.state" :loading="isStarting" class="has-text-red" expanded
                          type="is-text" @click="toggle(item)">
                  <b-icon custom-size="mdi-18px" icon="power-standby"></b-icon>
                </b-button>
              </div>
            </div>
          </div>

        </b-dropdown-item>
      </b-dropdown>
    </div>
    <!-- Action Button End -->
    <div class="blur-background"></div>
    <div class="cards-content">
      <!-- Card Content Start -->
      <b-tooltip :always="isActiveTooltip" :animated="true" :label="tooltipLabel" :triggers="tooltipTriger"
                 animation="fade1" type="is-white">

        <div
            class="has-text-centered is-flex is-justify-content-center is-flex-direction-column pt-5 pb-3px img-c">
          <div class="is-flex is-justify-content-center">
            <b-image :class="item.state, isLoading | dotClass" :src="item.icon"
                     :src-fallback="require('@/assets/img/app/default.png')" class="is-64x64"
                     webp-fallback=".jpg" @click.native="openApp(item)"></b-image>
            <!-- Unstable-->
            <cTooltip v-if="newAppIds.includes(item.id)" class="__position" content="NEW"></cTooltip>

            <!-- Loading Bar Start -->
            <b-loading v-model="isLoading" :can-cancel="false" :is-full-page="false"
                       class="has-background-gray-800 op80 is-64x64"
                       style="top: auto;bottom: auto; right: auto; left: auto; border-radius: 11.5px">
              <img :src="require('@/assets/img/loading/waiting-white.svg')" alt="loading"
                   class="is-20x20"/>
            </b-loading>
            <!-- Loading Bar End -->
          </div>

          <p class="mt-3 one-line">
            <a class="one-line" style="cursor:default">
              {{ item.name }}
            </a>
          </p>

        </div>
      </b-tooltip>
      <!-- Card Content End -->

      <!-- Loading Bar Start -->
      <!--			<b-loading v-model="isLoading" :can-cancel="false" :is-full-page="false"></b-loading>-->
      <!-- Loading Bar End -->
    </div>
  </div>

</template>

<script>
import events from '@/events/events';
import cTooltip from '@/components/basicComponents/tooltip/tooltip.vue';
import business_ShowNewAppTag from "@/mixins/app/Business_ShowNewAppTag";
import business_OpenThirdApp from "@/mixins/app/Business_OpenThirdApp";
import isNull from "lodash/isNull";
// import {patch} from "@/service/service.js";

export default {
  name: "app-card",
  components: {
    cTooltip
  },
  mixins: [business_ShowNewAppTag, business_OpenThirdApp],
  inject: ["homeShowFiles", "openAppStore"],
  data() {
    return {
      hover: false,
      dropState: false,
      isUninstalling: false,
      isCloning: false,
      isCheckThenUpdate: false,
      isUpdating: false,
      isRestarting: false,
      isStarting: false,
      // isStoping: false,
      // isSaving: false,
      isActiveTooltip: false,
    }
  },
  props: {
    item: {
      type: Object
    },
    isCasa: {
      type: Boolean
    }
  },
  computed: {
    tooltipLabel() {
      if (!this.isCasa) {
        return this.$t('Import to CasaOS')
      } else {
        if (this.item.type === "system") {
          return this.$t('Open')
        } else {
          if (this.isUpdating) {
            return this.$t('Updating')
          } else if (this.isUninstalling) {
            return this.$t('Uninstalling')
          } else if (this.isCloning) {
            return this.$t('Cloning')
          } else if (this.isCheckThenUpdate || this.isActiveTooltip) { // this.isCheckThenUpdate !!!
            return this.$t('CheckThenUpdate')
          } else if (this.item.state === 'running') {
            return this.$t('Open')
          }
        }
        return ""
      }
    },
    tooltipTriger() {
      if (!this.isCasa) {
        return ['hover']
      } else {
        if (this.item.type === "system") {
          return ['hover']
        } else {
          switch (this.item.state) {
            case 'running':
              return ['hover']
              // case 'stopped':
              // 	return ['hover']
            default:
              return []
          }
        }
      }
    },
    isLoading() {
      let active = this.isUninstalling || this.isUpdating // || this.isRestarting || this.isStarting || this.isStoping || this.isSaving

      // design :: The first display is three seconds long
      if ((active === true || this.isCheckThenUpdate) && this.activeTimer === undefined) {
        this.activeTimer = setTimeout(() => {
          this.isActiveTooltip = false;
          clearTimeout(this.activeTimer);
          this.activeTimer = undefined;
        }, 3000)
        this.isActiveTooltip = true;
      } else if (active === false && this.isCheckThenUpdate === false) {
        clearInterval(this.activeTimer);
        this.activeTimer = undefined;
        this.isActiveTooltip = false;
      }

      return active
    },

  },
  watch: {
    hover(val) {
      if (!val && this.dropState)
        this.$refs.dro.toggle();
    },
  },
  methods: {
    /**
     * @description: Open app in new windows
     * @param {String} state App state
     * @param {String} port App access port
     * @param {String} index App access index
     * @return {*} void
     */
    openApp(item) {
      if (!this.isCasa) {
        this.$emit("importApp", item, false)
        return false
      }
      if (item.type === "system") {
        this.openSystemApps(item)
      } else if (item.type === "LinkApp") {
        window.open(item.host, '_blank');
      } else {
        this.$refs.dro.isActive = false
        if (item.state === 'running') {
          this.openAppToNewWindow(item)
        }
      }
    },

    openSystemApps(item) {
      switch (item.name) {
        case "App Store":
          this.openAppStore()
          break;
        case "Files":
          this.homeShowFiles()
          break;
        default:
          break;
      }
    },

    /**
     * @description: Set drop-down menu status
     * @param {Boolean} e
     * @return {*} void
     */
    setDropState(e) {
      this.dropState = e
    },

    /**
     * @description: Restart Application
     * @return {*} void
     */
    restartApp() {
      this.$messageBus('apps_restart', this.item.name);
      this.isRestarting = true
      this.$api.container.updateState(this.item.id, "restart").then((res) => {
        if (res.data.success === 200) {
          this.updateState()
        }
        this.isRestarting = false;
      }).catch((err) => {
        this.isRestarting = false;
        this.$buefy.toast.open({
          message: err.response.data.data || err.response.data.message,
          type: 'is-danger',
          position: 'is-top',
          duration: 5000
        })
      })
    },

    /**
     * @description: Confirm before uninstall
     * @return {*} void
     */
    uninstallConfirm() {
      this.$messageBus('apps_uninstall', this.item.name);
      this.$refs.dro.isActive = false
      this.$buefy.dialog.confirm({
        title: this.$t('Attention'),
        message: this.$t(`Data cannot be recovered after deletion! <br/>Continue on to uninstall this application?<br/>{divS}Delete userdata ( config folder ){divE}`, {
          divS: `<div class="is-flex is-align-items-center mt-4"><input type="checkbox" checked id="checkDelConfig">`,
          divE: `</input></div>`
        }),
        type: 'is-dark',
        confirmText: this.$t('Uninstall'),
        cancelText: this.$t('Cancel'),
        onConfirm: () => {
          let checkDelConfig = document.getElementById("checkDelConfig") ? document.getElementById("checkDelConfig").checked : false;
          this.uninstallApp(checkDelConfig)
        }
      })
    },

    /**
     * @description: Uninstall app
     * @return {*} void
     */
    uninstallApp(checkDelConfig) {
      this.isUninstalling = true
      this.removeIdFromSessionStorage(this.item.id);
      if (this.item.type === "LinkApp") {
        let listLinkApp = JSON.parse(localStorage.getItem("listLinkApp"))
        listLinkApp = listLinkApp.filter((o) => o.name !== this.item.name)
        this.$api.users.saveLinkAppDetail(listLinkApp).then((res) => {
          if (res.data.success === 200) {
            localStorage.setItem("listLinkApp", JSON.stringify(res.data.data))
            this.$EventBus.$emit(events.RELOAD_APP_LIST);
          }
          // this.isUninstalling = false;
        })
      } else {
        this.$api.container.uninstall(this.item.id, {'delete_config_folder': checkDelConfig}).then((res) => {
          if (res.data.success === 200) {
            this.$EventBus.$emit(events.UPDATE_SYNC_STATUS);
          }
        }).catch((err) => {
          this.$buefy.toast.open({
            message: err.response.data.data,
            type: 'is-danger',
            position: 'is-top',
            duration: 5000
          })
        })
      }

    },

    /**
     * @description: Emit the event that the app has been updated
     * @return {*} void
     */
    updateState() {
      this.$refs.dro.isActive = false
      this.$emit("updateState")
      this.$EventBus.$emit(events.UPDATE_SYNC_STATUS);
    },

    /**
     * @description: Emit the event that the app has been updated with custom_id
     * @return {*} void
     */
    configApp() {
      this.$messageBus('apps_setting', this.item.name);
      this.$refs.dro.isActive = false
      this.$emit("configApp", this.item, true)
    },

    /**
     * @description: Start or Stop App
     * @param {Object} item the app info object
     * @return {*} void
     */
    toggle(item) {
      this.$messageBus('apps_stop', item.name);
      this.isStarting = true;
      const state = item.state === "running" ? "stop" : "start"

      this.$api.container.updateState(item.id, state).then((res) => {
        this.isStarting = false
        if (res.data.success === 200) {
          item.state = res.data.data
          this.updateState()
        } else {
          this.$refs.dro.isActive = false
          this.$buefy.dialog.alert({
            title: 'Error',
            message: res.data.data || res.data.message,
            type: 'is-danger',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        }
      }).catch((err) => {
        this.isStarting = false
        this.$refs.dro.isActive = false
        this.$buefy.toast.open({
          message: err.response.data.data || err.response.data.message,
          type: 'is-danger',
          position: 'is-top',
          duration: 3000
        })
      })
    },

    quickInstall(id) {
      this.isCloning = true;
      this.$api.apps.getAppInfo(id).then(resp => {
        if (resp.data.success == 200) {
          let respData = resp.data.data
          // messageBus :: installApp
          this.$messageBus('appstore_install', respData.title.toString());

          let initData = {}
          initData.protocol = respData.protocol
          initData.host = respData.host
          initData.port_map = respData.port_map
          initData.cpu_shares = 50
          initData.memory = respData.max_memory
          initData.restart = "always"
          initData.label = respData.title
          initData.position = true
          initData.index = respData.index
          initData.icon = respData.icon
          initData.network_model = respData.network_model
          initData.image = respData.image
          initData.description = respData.description
          initData.origin = respData.origin
          initData.ports = isNull(respData.ports) ? [] : respData.ports
          initData.volumes = isNull(respData.volumes) ? [] : respData.volumes
          initData.envs = isNull(respData.envs) ? [] : respData.envs
          initData.devices = isNull(respData.devices) ? [] : respData.devices
          initData.cap_add = isNull(respData.cap_add) ? [] : respData.cap_add
          initData.cmd = isNull(respData.cmd) ? [] : respData.cmd
          initData.privileged = respData.privileged
          initData.host_name = respData.host_name
          initData.appstore_id = id

          this.$api.container.install(initData).catch((err) => {
            this.$buefy.toast.open({
              message: err.response.data.message,
              type: 'is-warning'
            })
          }).then(() => {
            this.isCloning = false;
            this.$refs.dro.isActive = false
          })
        }
      }).catch(() => {
        this.$buefy.toast.open({
          message: this.$t(`There was an error loading the data, please try again!`),
          type: 'is-danger'
        })
      })
    },

    checkAppVersion() {
      this.isCheckThenUpdate = true;
      // patch(`/v2/app_management/container/${this.item.id}`).then(resp => {
      const params = `${this.item.id}?name=${this.item.name}&pull=true&cid=${this.item.id}`

      this.$api.apps.checkAppVersion(params).then(resp => {
        if (resp.status === 200) {
          // this.isUpdating = true;
        } else {
          this.$buefy.toast.open({
            message: this.$t(`Unable to update at the moment!`),
            type: 'is-warning'
          })
        }
      }).catch(() => {
        this.$buefy.toast.open({
          message: this.$t(`Unable to update at the moment!`),
          type: 'is-danger'
        })
      }).finally(() => {
        this.$refs.dro.isActive = false
      })
    }

  },
  filters: {
    /**
     * @description: Format Dot Class
     * @param {String} state
     * @return {String}
     */
    dotClass(state, loadState) {
      // For updating
      if (loadState) {
        if (state === "0" || state === "running") {
          return 'disabled start'
        }
        return 'disabled stop'
      }
      if (state === "0") {
        return "start"
      } else {
        return state === 'running' ? 'start' : 'stop'
      }

    },
  },

  sockets: {
    /**
     * @description: Update App Status
     * @param {Object} data
     * @return {void}
     */
    'app:update-begin'(data) {
      // if (data.Properties.cid === this.item.id) {
      // 	this.loadState = true;
      // }
    },

    'docker:image:pull-end'(data) {
      if (data.Properties.cid === this.item.id) {
        if (data.Properties['docker:image:updated'] === 'true') {
          this.isUpdating = true;
        }
        this.isCheckThenUpdate = false;
      }
    },

    'docker:image:pull-error'(data) {
      if (data.Properties.cid === this.item.id) {
        this.isCheckThenUpdate = false;
      }
    },

    /**
     * @description: Update App Version
     * @param {Object} data
     * @return {void}
     */
    'app:update-end'(data) {
      if (data.Properties['docker:image:updated'] === 'true') {
        return
      }
      this.isUpdating = false;
      this.$buefy.toast.open({
        message: this.$t(`Currently is the latest version!`),
        type: 'is-success',
        duration: 5000
      })
    },

    "app:uninstall-error"(res) {
      if (res.Properties['id'] === this.item.id) {
        this.isUninstalling = false;
      }
    },
  }

}
</script>

<style lang="scss">
.pb-3px{
  padding-bottom: 3px;
}
.app-card-drop {
  .dropdown-menu {
    min-width: 10rem;

    .dropdown-content {
      padding: 4px !important;
      width: 160px;
      background: none;
      padding: 0;
      background: hsla(0, 0%, 100%, 1);
      border-radius: 10px;

      .dropdown-item {
        padding: 0;
      }

      .button {
        border-radius: 0;
        padding-left: 1rem;
        padding-right: 1rem;
        border-radius: 5px;

        &.is-text {
          text-decoration: none;
          justify-content: flex-start;
          outline: none;
          transition: all 0.2s;
          border: none !important;
          height: 2rem;
          font-size: 0.875rem;
          color: hsla(208, 20%, 20%, 1);

          &.running {
            color: #779e2a !important;
          }

          &.exited {
            color: #ff1616 !important;
          }
        }

        &.has-text-red {
          &:hover {
            background: hsla(18, 98%, 94%, 1);
          }

          &:active {
            background: hsla(18, 100%, 80%, 1);
          }
        }

        &:focus {
          background: none;
          box-shadow: none;
          outline: none;
        }

        &:hover {
          background-color: hsla(208, 16%, 96%, 1);
        }

        &:active {
          /* Gary/200 */
          background-color: hsla(208, 16%, 94%, 1);
        }
      }

      .gap {
        margin-left: -4px;
        margin-right: -4px;
      }

      ._b-bor {
        border-top: hsla(208, 16%, 94%, 1) 1px solid;

        .is-text {
          text-decoration: none;
          justify-content: center !important;
        }

        .column {
          margin-bottom: -4px;

          .button {
            margin: 4px;
            height: 2rem;
          }
        }

        .column:first-child {
          border-right: hsla(208, 16%, 94%, 1) 1px solid;
        }
      }

      /*common*/
      .loading-overlay {
        &.is-active {
          background: hsla(208, 16%, 96%, 1) !important;
          justify-content: flex-start;
        }

        .loading-background {
          background: none;
        }
      }


      .is-24x24 {
        width: 1.5rem;
        height: 1.5rem;
      }

    }
  }
}

.b-tooltip {
  &.is-top .tooltip-content {
    bottom: auto;
    top: -15%;
  }

  .tooltip-content {
    box-shadow: none;
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;

    /* Text 400Regular/Text03 */

    font-family: 'Roboto';
    font-style: normal;
    line-height: 1.25rem;
    /* identical to box height, or 143% */

    font-feature-settings: 'pnum' on, 'lnum' on;

    /* Gary/800 */

    color: hsla(208, 20%, 20%, 1);

  }

}

.__position {
  position: absolute !important;
  top: 0.75rem !important;
  left: 3rem !important;
  z-index: 30;
}
</style>
<style lang="scss">
// TODO Style libraries
.dialog {
  .modal-card-head {
    padding-top: 1.25rem;
    padding-left: 1.5rem;
    padding-top: 1.5rem;
    padding-bottom: 0.75rem;
    border: 1px solid hsla(208, 16%, 94%, 1);
  }

  .modal-card-body {
    padding: 1rem 1.5rem 1.5rem;

    #checkDelConfig {
      margin-right: 0.5rem;
      height: 1.25rem;
      width: 1.25rem;
    }

    border: 1px solid hsla(208, 16%, 94%, 1);
  }

  .modal-card-foot {
    padding-top: 0.75rem;
    padding-bottom: 1.5rem;
    padding-right: 1.5rem;

    //styleName: Text 400Regular/Text03;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    text-align: left;

    .button {
      margin-right: 0;
    }

    .is-dark {
      margin-left: 1rem;
      background: hsla(208, 100%, 45%, 1);
    }
  }
}
</style>
