<!--
 * @Author: JerryK
 * @Date: 2021-11-10 17:48:25
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 11:55:57
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\syncthing\SyncBlock.vue
-->
<template>
  <div class="column is-one-half">
    <div class="common-card">

      <div class="blur-background"></div>
      <div class="wuji-content">
        <!-- Init State Start -->
        <h6 class="title is-4 mb-0 has-text-white">{{$t(`Sync your data`)}}</h6>
        <div class="is-flex is-align-items-center">
          <div class="info ">
            <div class="des two-line is-size-14px">
              {{$t(`Follow the guide to start syncing your files across multiple devices.`)}}
            </div>
          </div>
          <b-image :src="require('@/assets/img/syncthing/syncthing.svg')" class="is-80x80"></b-image>
        </div>
        <div class="buttons">
          <b-button type="is-primary" size="is-small" rounded @click="openSyncPanel">{{$t(actionText)}}</b-button>
        </div>
        <!-- Init State End -->

      </div>
    </div>
  </div>
</template>

<script>
import  events  from '@/events/events';
export default {
  name: "sync-block",
  data() {
    return {
      isLoading: false,
      syncBaseURL: "",
      isSyncInstalled: false,
      isSyncRunning: false,
      syncPort: ""
    }
  },
  created() {
    this.checkSyncStatus()
  },
  computed: {
    actionText() {
      return !this.isSyncInstalled ? "Install" : "Open"
    }
  },

  methods: {
    async checkSyncStatus() {
      const res = await this.$api.sys.getSystemApps()
      const systemApps = res.data.data
      this.isSyncInstalled = systemApps.some(item => {
        return item.image.includes('syncthing')
      })

      if (this.isSyncInstalled) {
        this.isSyncRunning = systemApps.some(item => {
          return item.image.includes('syncthing') && item.state === "running"
        })

        this.syncPort = systemApps.find(item => {
          return item.image.includes('syncthing')
        }).port
        this.syncBaseURL = `http://${this.$baseIp}:${this.syncPort}`
      }
    },
    async openSyncPanel() {
      await this.checkSyncStatus()
      if (!this.isSyncInstalled) {
        this.$EventBus.$emit(events.OPEN_APP_STORE_AND_GOTO_SYNCTHING);
      } else {
        if (this.isSyncRunning) {
          const arg = `\u003cscript\u003elocation.replace("${this.syncBaseURL}")\u003c/script\u003e`;
          window.open('javascript:window.name;', arg);
        } else {
          console.log("openModal");
        }
      }
    },

  },
}
</script>

<style>
</style>