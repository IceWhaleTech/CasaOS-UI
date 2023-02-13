<!--
 * @Author: zhanghengxin ezreal.ice@icloud.com
 * @Date: 2022-09-06 14:42:24
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-12 18:31:56
 * @FilePath: \CasaOS-UI-0.4.2\src\components\Storage\StorageBlock.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 *
-->

<template>
  <div class="column">
    <div class="common-card">

      <div class="blur-background"></div>
      <div class="content widget">
        <!-- Init State Start -->
        <div class="widget-header is-flex">
          <div class="image is-24x24">
            <img :src="require('@/assets/img/logo/casa-white.svg')"/>
          </div>
          <div class="widget-title pl-2">
            {{ $t("Find New Drive") }}
          </div>
        </div>

        <div class="is-flex is-align-items-center">
          <div class="info">
            <div class="widget-header is-flex scrpe-margin">
              <div class="image is-24x24">
                <img :src="require('@/assets/img/logo/casa-white.svg')"/>
              </div>
              <div class="b-line is-flex is-flex-grow-1 ml-2">
                <div class="widget-title is-flex-grow-1 nowrap">
                  {{ $t("Find New Drive") }}
                </div>
                <div class="has-text-left is-size-14px mt-1 is-flex-shrink-0">
                  <span class="op65">100G/1000G</span>
                </div>
              </div>
            </div>
            <div class="widget-header is-flex scrpe-margin">
              <div class="image is-24x24">
                <img :src="require('@/assets/img/logo/casa-white.svg')"/>
              </div>
              <div class="b-line is-flex is-flex-grow-1 ml-2">
                <div class="widget-title is-flex-grow-1 nowrap">
                  {{ $t("Find New Drive") }}
                </div>
                <p class="has-text-left is-size-14px mt-1 is-flex-shrink-0">
                  <span class="op65">100G/1000G</span>
                </p>
              </div>
            </div>

          </div>
        </div>
        <div class="is-flex is-flex-direction-row-reverse">
          <b-button :disabled="false" class="width" rounded size="is-small" type="is-primary" @click="TODO">
            {{ $t('Storage Manager') }}
          </b-button>
        </div>
        <!-- Init State End -->

      </div>
    </div>
  </div>
</template>

<script>
import events from '@/events/events';

export default {
  name: "storage-block",
  data() {
    return {}
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
    // actionText() {
    // }
  },

  methods: {
    async checkSyncStatus() {
      // const res = await this.$api.sys.getSystemApps()
      const listRes = await this.$api.container.getMyAppList();
      const systemApps = listRes.data.data.casaos_apps
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
                  console.error(`Failed to start, please try again.`)
                }
              })
            }
          })
        }
      }
    },
    TODO() {

    }
  },
  sockets: {
    "app:install-end"() {
      // res.Properties['app:name']
      this.checkSyncStatus();
    },
    "app:install-error"() {
      this.checkSyncStatus();
    },
  }
}
</script>

<style lang="scss" scoped>
// copy from src/assets/scss/common/_others.scss:102
.content {
  position: relative;
  z-index: 10;
  padding: 1rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-bottom: 0.75rem;

  .info {
    //margin: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    margin-left: 2rem;
    margin-right: 0rem;

    .scrpe-margin {
      margin: 0.75rem;
      padding-bottom: 0.75rem;
    }

    //src/assets/scss/common/_others.scss:24
    .b-line {
      border-bottom: #cfcfcf 1px solid;
      margin-right: 2rem;

      .nowrap {
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}
</style>
