<!--
 * @Author: JerryK
 * @Date: 2021-11-10 17:48:25
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-25 19:19:02
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/syncthing/SyncBlock.vue
-->
<template>
  <div class="column is-one-half">
    <div class="common-card">

      <div class="blur-background"></div>
      <div class="wuji-content">
        <!-- Init State Start -->
        <h6 class="title is-4 mb-0 has-text-white">{{ $t(`Sync your data`) }}</h6>
        <div class="is-flex is-align-items-center">
          <div class="info ">
            <div class="des two-line is-size-14px">
              {{ $t(`Use Syncthing to sync your files between multiple devices.`) }}
            </div>
          </div>
          <b-image :src="require('@/assets/img/syncthing/sync.svg')" class="is-80x80"></b-image>
        </div>
        <div class="buttons">
          <b-button type="is-primary" size="is-small" rounded @click="openSyncPanel">{{ $t(actionText) }}</b-button>
        </div>
        <!-- Init State End -->

      </div>
    </div>
  </div>
</template>

<script>
import events from '@/events/events';

export default {
  name: "sync-block",
  data() {
    return {
      isLoading: false,
      isStarting: false,
      syncBaseURL: "",
      isSyncInstalled: false,
      isSyncRunning: false,
      syncPort: "",
      syncId: ""
    }
  },
  created() {
    this.checkSyncStatus()

    this.$EventBus.$on(events.UPDATE_SYNC_STATUS, () => {
      this.checkSyncStatus();
    });

  },
  beforeDestroy() {
    this.$EventBus.$off(events.UPDATE_SYNC_STATUS);
  },
  computed: {
    actionText() {
      return !this.isSyncInstalled ? "Install" : "Open"
    }
  },

  methods: {
    async checkSyncStatus() {
      // const res = await this.$api.sys.getSystemApps()
      const listRes = await this.$api.container.getMyAppList();
      const systemApps = listRes.data ? listRes.data.data.casaos_apps : [];
      const is8384SyncInstalled = systemApps.some(app => {
        return app.image.includes('syncthing') && app.port === 8384
      })
      if (is8384SyncInstalled) {
        this.isSyncInstalled = true
        this.syncBaseURL = `http://${this.$baseIp}:8384`
        this.syncPort = 8384
        this.syncId = systemApps.find(app => {
          return app.image.includes('syncthing') && app.port === 8384
        }).port
        this.isSyncRunning = systemApps.some(app => {
          return app.image.includes('syncthing') && app.port === 8384 && app.state === 'running'
        })
      } else {
        this.isSyncInstalled = systemApps.some(app => {
          return app.image.includes('syncthing')
        })
        if (this.isSyncInstalled) {
          this.isSyncRunning = systemApps.some(app => {
            return app.image.includes('syncthing') && app.state === "running"
          })
          this.syncPort = systemApps.find(app => {
            return app.image.includes('syncthing')
          }).port
          this.syncId = systemApps.find(app => {
            return app.image.includes('syncthing')
          }).id
          this.syncBaseURL = `http://${this.$baseIp}:${this.syncPort}`
        }
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
          this.$buefy.dialog.confirm({
            title: ' ',
            message: this.$t('Syncthing is not running, start it?'),
            hasIcon: true,
            closeOnConfirm: false,
            confirmText: this.$t('Start'),
            cancelText: this.$t('Cancel'),
            onConfirm: (value, {close}) => {
              this.$buefy.toast.open({
                message: this.$t(`Starting Syncthing...`),
              })
              this.$api.container.updateState(this.syncId, "start").then((res) => {
                this.isStarting = false
                if (res.data.success == 200) {
                  this.$EventBus.$emit(events.RELOAD_APP_LIST);
                  const arg = `\u003cscript\u003elocation.replace("${this.syncBaseURL}")\u003c/script\u003e`;
                  setTimeout(() => {
                    close()
                    window.open('javascript:window.name;', arg);

                  }, 2000)
                } else {
                  this.$buefy.toast.open({
                    message: this.$t(`Failed to start, please try again.`),
                    type: 'is-danger'
                  })
                }
              })
            }
          })
        }
      }
    },

  },
  sockets: {
    app_install(res) {
      const data = res.body.data
      if (data.finished) {
        this.checkSyncStatus();
      }
    }
  }
}
</script>

<style>
</style>