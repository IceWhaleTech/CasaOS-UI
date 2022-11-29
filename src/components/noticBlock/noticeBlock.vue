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
          {{ $t(noticeData.prelude.title) }}
        </div>
        <div class="is-flex-shrink-0" @click="close">
          <b-icon icon="close-xs" custom-size="casa-24px" pack="casa"></b-icon>
        </div>
      </div>
      <!-- end of section head-->

      <!-- start of section body-->
      <div
          class="info is-flex is-flex-direction-column is-justify-content-space-around is-flex-grow-1">
        <div class="_widget-body is-flex mr-0">
          <div class="image is-24x24 is-flex-shrink-0">
            <img :src="require('@/assets/img/logo/casa-white.svg')"/>
          </div>
          <div class="body-title is-flex-grow-1 nowarp ml-2">
            {{ $t(noticeData.content[Object.keys(noticeData.content)[0]].title) }}
          </div>
          <div class="has-text-left is-size-14px mt-1 is-flex-shrink-0">
            <span class="op65">{{ noticeData.content[Object.keys(noticeData.content)[0]].value }}</span>
          </div>
        </div>
        <div class="line _ml-2rem" v-if="Object.keys(noticeData.content).length > 1"></div>
        <div class="_widget-body is-flex mr-0" v-if="Object.keys(noticeData.content).length > 1">
          <div class="image is-24x24 is-flex-shrink-0">
            <img :src="require('@/assets/img/logo/casa-white.svg')"/>
          </div>
          <div class="body-title is-flex-grow-1 nowarp ml-2">
            {{ $t(noticeData.content[Object.keys(noticeData.content)[1]].title) }}
          </div>
          <p class="has-text-left is-size-14px mt-1 is-flex-shrink-0">
            <span class="op65">{{ noticeData.content[Object.keys(noticeData.content)[1]].value }}</span>
          </p>
        </div>
      </div>
      <!-- end of section body-->

      <!-- start of section footer-->
      <div class="is-flex is-flex-direction-row-reverse is-flex-shrink-0 is-align-items-end">
        <b-button :disabled="false" class="width" rounded size="is-small" type="is-primary" @click="close"
                  v-if="!noticeData.operate">
          {{ $t('Cancel') }}
        </b-button>
        <b-button :disabled="false" class="width" rounded size="is-small" type="is-primary"
                  @click="$EventBus.$emit(noticeData.operate.event, noticeData.operate.path)"
                  v-else-if="'casaUI:eventBus'">
          {{ $t(noticeData.operate.title) }}
        </b-button>
        <div class="is-flex-grow-1 footer-hint" v-if="Object.keys(noticeData.content).length > 1">
          {{ $t('{num}Items', {num: Object.keys(noticeData.content).length}) }}
        </div>
      </div>
      <!-- end of section footer-->
    </div>
  </div>
</template>

<script>

export default {
  name: "notice-block",
  props: {
    noticeData: {
      type: Object,
      default: () => {
        return {
          prelude: {
            title: 'Find New USB Drive',
            icon: 'mdi-usb',
          },
          content: {
            123: {
              title: 'Find New Drive',
              icon: 'mdi-usb',
              color: 'is-primary',
              path: '/storage',
              uuid: '123',
              value: '100G/1000G'
            },
            345: {
              title: 'Find New Drive',
              icon: 'mdi-usb',
              color: 'is-primary',
              path: '/storage',
              uuid: '456',
              value: '100G/1001G'
            },
          },
          contentType: 'list',
          operate: {
            type: 'casaUI:eventBus',
            event: 'openFile',
            title: 'More',
            path: '/storage',
            icon: 'mdi-arrow-right',
          },
        };
      },
    },
    noticeType: {
      type: String,
      default: 'usb',
    },
  },
  data() {
    return {}
  },
  inject: ['homeShowFiles'],
  created() {
    this.$EventBus.$on('casaUI:openInFiles', (path) => {
      this.homeShowFiles(path);
    });
  },
  beforeDestroy() {
  },
  computed: {},

  methods: {
    close() {
      let promises = [];
      for (const contentKey in this.noticeData.content) {
        promises.push(this.$api.users.delLetter(this.noticeData.content[contentKey].messageUUID));
      }
      Promise.all(promises).then(() => {
        this.$emit('deleteNotice', this.noticeData, this.noticeType);
      });
    },
    TODO() {
      // this.$refs.mySwiper.$swiper.slideNext()
    },
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
