<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-29 18:01:00
 * @Description: App Card item
 * @FilePath: /CasaOS-UI/src/components/Apps/AppCard.vue
-->

<template>
  <div class="wuji-card is-flex is-align-items-center is-justify-content-center p-55 app-card" @mouseover="hover = true" @mouseleave="hover = false">
    <!-- Action Button Start -->
    <div class="action-btn">
      <b-dropdown aria-role="list" position="is-bottom-left" class="ii" ref="dro" @active-change="setDropState" :mobile-modal="false">
        <template #trigger>
          <p role="button">
            <b-icon icon="dots-vertical">
            </b-icon>
          </p>
        </template>

        <b-dropdown-item aria-role="menu-item" :focusable="false" custom paddingless>
          <b-button type="is-text" tag="a" :target="(item.state == 'running') ?'_blank':'_self'" :href="(item.state == 'running') ? siteUrl(item.port,item.index) :'javascript:void(0)'" expanded>Open</b-button>
          <b-button type="is-text" @click="configApp" expanded>Setting</b-button>
          <b-button type="is-text" expanded @click="uninstallConfirm" :loading="isUninstalling">Unistall</b-button>
          <div class="columns is-gapless bbor is-flex">
            <div class="column is-flex is-justify-content-center is-align-items-center">
              <b-button icon-left="sync" type="is-text" expanded :loading="isRestarting" @click="restartApp"></b-button>
            </div>
            <div class="column is-flex is-justify-content-center is-align-items-center">
              <b-button icon-left="power-standby" type="is-text" expanded @click="toggle(item)" :loading="isStarting" :class="item.state"></b-button>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <!-- Action Button End -->

    <!-- Card Content Start -->
    <div class="has-text-centered is-flex is-justify-content-center is-flex-direction-column pt-3 pb-3">
      <a :target="siteUrlTarget(item.state,item.port)" class="is-flex is-justify-content-center" :href="siteUrl(item.state,item.port,item.index)">
        <b-image :src="item.icon" :src-fallback="require('@/assets/img/default.png')" webp-fallback=".jpg" class="is-72x72" :class="item.state | dotClass"></b-image>
      </a>
      <p class="mt-4 one-line">
        <a class="one-line" :target="siteUrlTarget(item.state,item.port)" :href="siteUrl(item.state,item.port,item.index)">
          {{item.name}}
        </a>
      </p>

    </div>
    <!-- Card Content End -->

    <!-- Loading Bar Start -->
    <b-loading :is-full-page="false" v-model="isUninstalling" :can-cancel="false"></b-loading>
    <!-- Loading Bar End -->
  </div>

</template>

<script>

export default {
  name: "app-card",
  data() {
    return {
      hover: false,
      dropState: false,
      isUninstalling: false,
      isRestarting: false,
      isStarting: false,
      isStoping: false,
      isSaving: false,
    }
  },
  props: {
    item: {
      type: Object
    },
  },
  methods: {
    /**
     * @description: Create application access link
     * @param {String} state App state
     * @param {String} port App access port
     * @param {String} index App access index page
     * @return {String}
     */
    siteUrl(state, port, index) {
      if (port == "" && index == "") {
        return 'javascript:void(0)';
      } else {
        if (state == 'running') {
          return 'javascript:void(0)';
        } else {
          return (process.env.NODE_ENV === "'dev'") ? `http://${this.$store.state.devIp}:${port}${index}` : `http://${document.domain}:${port}${index}`
        }
      }
    },
    /**
     * @description: Create application access target
     * @param {String} state App state
     * @param {String} port App access port
     * @return {String}
     */
    siteUrlTarget(state, port) {
      if (port == "") {
        return '_self';
      } else {
        return (state == 'running') ? '_blank' : '_self';
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
      this.isRestarting = true
      this.$api.app.startContainer(this.item.custom_id, { state: "restart" }).then((res) => {
        if (res.data.success == 200) {
          this.updateState()
        }
        this.isRestarting = false;
      })
    },

    /**
     * @description: Confirm before uninstall
     * @return {*} void
     */
    uninstallConfirm() {
      let _this = this
      this.$buefy.dialog.confirm({
        title: 'Attention',
        message: 'Data cannot be recovered after deletion! <br>Continue on to uninstall this application?',
        type: 'is-dark',
        confirmText: 'Uninstall',
        onConfirm: () => {
          _this.isUninstalling = true
          _this.uninstallApp()
        }
      })
    },

    /**
     * @description: Uninstall app
     * @return {*} void
     */
    uninstallApp() {
      this.isUninstalling = true
      this.$api.app.uninstall(this.item.custom_id).then((res) => {
        if (res.data.success == 200) {
          console.log(res.data.data);
          this.updateState()
        }
        this.isUninstalling = false;
      })
    },

    /**
     * @description: Emit the event that the app has been updated
     * @return {*} void
     */
    updateState() {
      this.$emit("updateState")
    },

    /**
     * @description: Emit the event that the app has been updated with custom_id
     * @return {*} void
     */
    configApp() {
      this.$emit("configApp", this.item.custom_id,this.item.state)
    },

    /**
     * @description: Start or Stop a App
     * @param {Object} item the app info object
     * @return {*} void
     */
    toggle(item) {
      this.isStarting = true;
      let data = {
        state: item.state == "running" ? "stop" : "start"
      }
      this.$api.app.startContainer(item.custom_id, data).then((res) => {
        this.isStarting = false
        if (res.data.success == 200) {
          item.state = res.data.data
          this.updateState()
        } else {
          this.$buefy.dialog.alert({
            title: 'Error',
            message: res.data.data,
            type: 'is-danger',
            ariaRole: 'alertdialog',
            ariaModal: true
          })
        }

      })
    },

  },
  watch: {
    hover(val) {
      if (!val && this.dropState)
        this.$refs.dro.toggle();
    }
  },
  filters: {
    /**
     * @description: Format Dot Class
     * @param {String} state
     * @return {String}
     */
    dotClass(state) {
      return state == 'running' ? 'start' : 'stop'
    },
  }
}
</script>

<style>
</style>