<!--
 * @Author: zhanghengxin ezreal.ice@icloud.com
 * @Date: 2022-09-06 14:42:24
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-06 15:31:14
 * @FilePath: /CasaOS-UI/src/components/Storage/noticeBlock.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 *
-->

<template>
  <div class="common-card">
    <div class="blur-background"></div>
    <div class="content widget _card is-flex is-flex-direction-column">
      <!-- start of section head-->
      <div class="widget-header is-flex is-flex-shrink-0">
        <div class="image is-24x24 is-flex-shrink-0">
          <img :src="require('@/assets/img/logo/casa-white.svg')"/>
        </div>
        <div class="header-title pl-2 is-flex-grow-1">
          {{ $t("Find New Drive") }}
        </div>
        <b-icon icon="close-xs" custom-size="casa-24px" class="is-flex-shrink-0" @click="close" pack="casa"></b-icon>
      </div>
      <!-- end of section head-->

      <!-- start of section body-->
      <div
          class="info is-flex is-flex-direction-column is-justify-content-space-between is-flex-grow-1">
        <div class="_widget-body is-flex mr-0">
          <div class="image is-24x24 is-flex-shrink-0">
            <img :src="require('@/assets/img/logo/casa-white.svg')"/>
          </div>
          <div class="body-title is-flex-grow-1 nowarp ml-2">
            {{ $t("Find New Drive") }}
          </div>
          <div class="has-text-left is-size-14px mt-1 is-flex-shrink-0">
            <span class="op65">100G/1000G</span>
          </div>
        </div>
        <div class="line _ml-2rem"></div>
        <div class="_widget-body is-flex mr-0">
          <div class="image is-24x24 is-flex-shrink-0">
            <img :src="require('@/assets/img/logo/casa-white.svg')"/>
          </div>
          <div class="body-title is-flex-grow-1 nowarp ml-2">
            {{ $t("Find New Drive") }}
          </div>
          <p class="has-text-left is-size-14px mt-1 is-flex-shrink-0">
            <span class="op65">100G/1000G</span>
          </p>
        </div>
      </div>
      <!-- end of section body-->

      <!-- start of section footer-->
      <div class="is-flex is-flex-direction-row-reverse is-flex-shrink-0 is-align-items-end">
        <b-button :disabled="false" class="width" rounded size="is-small" type="is-primary" @click="close">
          {{ $t('Cancel') }}
        </b-button>
        <b-button :disabled="false" class="width" rounded size="is-small" type="is-primary" @click="TODO">
          {{ $t('Set MainStorage') }}
        </b-button>
        <div class="is-flex-grow-1 footer-hint">{{ $t('{num}Items', {num: 3}) }}</div>
      </div>
      <!-- end of section footer-->
    </div>
  </div>
</template>

<script>
import events from '@/events/events';

export default {
  name: "notice-block",
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
  computed: {},

  methods: {
    close() {
      this.$emit('close');
    },
    TODO() {
      // this.$refs.mySwiper.$swiper.slideNext()
    },
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
                }
              })
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
._card {
  height: 11.5rem;

  .widget-header {
    .header-title {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 500;
      font-size: 1.125rem;
      line-height: 1.75rem;
      color: hsla(208, 16%, 96%, 1);
    }
  }

  ._widget-body {
    align-items: center;
    position: relative;

    .body-title {
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: hsla(208, 16%, 96%, 1);
    }
  }

  .footer-hint {
    height: 16px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.125rem;
    //vertical-align: text-bottom;
    //margin-bottom: -1rem;
  }
}

.content {
  z-index: 10;
  padding: 1rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;

  .info {
    margin: 1.5rem 2rem;

    ._ml-2rem {
      margin-left: 2rem;
    }

    .line {
      width: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
