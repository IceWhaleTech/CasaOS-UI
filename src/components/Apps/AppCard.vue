<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-10 15:36:34
 * @Description: App Card item
 * @FilePath: \CasaOS-UI\src\components\Apps\AppCard.vue
-->

<template>
  <div class="wuji-card is-flex is-align-items-center is-justify-content-center p-55 app-card" @mouseover="hover = true" @mouseleave="hover = true">

    <!-- Action Button Start -->
    <div class="action-btn">
      <b-dropdown aria-role="list" :triggers="['contextmenu','click']" position="is-bottom-left" class="app-card-drop" ref="dro" animation="fade1" @active-change="setDropState" :mobile-modal="false" append-to-body>
        <template #trigger>
          <p role="button">
            <b-icon icon="dots-vertical"></b-icon>
          </p>
        </template>

        <b-dropdown-item aria-role="menu-item" :focusable="false" custom>
          <b-button type="is-text" tag="a" @click="openApp(item)" expanded>{{$t('Open')}}</b-button>
          <b-button type="is-text" @click="configApp" expanded>{{$t('Setting')}}</b-button>
          <b-button type="is-text" class="mb-1" @click="uninstallConfirm" :loading="isUninstalling" expanded>
            {{$t('Uninstall')}}
          </b-button>
          <div class="gap">
            <div class="columns is-gapless bbor is-flex">
              <div class="column is-flex is-justify-content-center is-align-items-center">
                <b-button type="is-text" expanded :loading="isRestarting" @click="restartApp">
                  <b-icon icon="sync" custom-size="mdi-18px"></b-icon>
                </b-button>
              </div>
              <div class="column is-flex is-justify-content-center is-align-items-center">
                <b-button type="is-text" expanded @click="toggle(item)" :loading="isStarting" :class="item.state">
                  <b-icon icon="power-standby" custom-size="mdi-18px"></b-icon>
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
      <div class="has-text-centered is-flex is-justify-content-center is-flex-direction-column pt-3 pb-3 img-c">
        <a class="is-flex is-justify-content-center" @click="openApp(item)">
          <b-image :src="item.icon" :src-fallback="require('@/assets/img/app/default.png')" webp-fallback=".jpg" class="is-72x72" :class="item.state | dotClass"></b-image>
        </a>
        <p class="mt-4 one-line">
          <a class="one-line" @click="openApp(item)">
            {{item.name}}
          </a>
        </p>

      </div>
      <!-- Card Content End -->

      <!-- Loading Bar Start -->
      <b-loading :is-full-page="false" v-model="isUninstalling" :can-cancel="false"></b-loading>
      <!-- Loading Bar End -->
    </div>
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
     * @description: Open app in new windows
     * @param {String} state App state
     * @param {String} port App access port
     * @param {String} index App access index
     * @return {*} void
     */
    openApp(item) {
      this.$refs.dro.isActive = false
      if (item.port != "" && item.state == 'running') {
        try {
          const appName = item.name
          const action = "open"
          this.$api.analyse.analyseAppAction(appName, action)
          // eslint-disable-next-line no-empty
        } catch (err) { }
        let url = (process.env.NODE_ENV === "'dev'") ? `http://${this.$store.state.devIp}:${item.port}${item.index}` : `http://${window.location.hostname}:${item.port}${item.index}`
        if (item.image.toLowerCase().indexOf("qbittorrent") == -1) {
          window.open(url, '_blank');
        } else {
          var arg = '\u003cscript\u003elocation.replace("' + url + '")\u003c/script\u003e';
          window.open('javascript:window.name;', arg);
        }
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
      try {
        const appName = this.item.name
        const action = "uninstall"
        this.$api.analyse.analyseAppAction(appName, action)
        // eslint-disable-next-line no-empty
      } catch (err) { }
      this.$refs.dro.isActive = false
      this.$buefy.dialog.confirm({
        title: this.$t('Attention'),
        message: this.$t('Data cannot be recovered after deletion! <br>Continue on to uninstall this application?'),
        type: 'is-dark',
        confirmText: this.$t('Uninstall'),
        cancelText: this.$t('Cancel'),
        onConfirm: () => {
          this.isUninstalling = true
          this.uninstallApp()
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
          // this.updateState()
        }
        this.isUninstalling = false;
      })
    },

    /**
     * @description: Emit the event that the app has been updated
     * @return {*} void
     */
    updateState() {
      this.$refs.dro.isActive = false
      this.$emit("updateState")
    },

    /**
     * @description: Emit the event that the app has been updated with custom_id
     * @return {*} void
     */
    configApp() {
      this.$refs.dro.isActive = false
      this.$emit("configApp", this.item.custom_id, this.item.state)
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