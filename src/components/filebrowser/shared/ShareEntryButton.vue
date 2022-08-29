<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-28 15:29:40
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-25 10:25:40
 * @FilePath: \CasaOS-UI-dev\src\components\filebrowser\shared\ShareEntryButton.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div>

    <div class="is-flex list-item new-list-item" :class="{'active':active}" @click.prevent="$emit('open')">

      <popper  trigger="click" transition='fade' enter-active-class="fade-enter-active" :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,10px' } }
    }" ref="tip">
        <div class="popper  tooltip-content dark">
          <div class="is-flex ">
            {{$t('Start sharing your files on the local network.')}}
            <div class="is-clickable ml-1 is-flex is-align-items-center" @click.stop="hideTip">
              <b-icon pack="casa" icon="close-xs"></b-icon>
            </div>
          </div>
        </div>
        <div class="cover mr-2 is-flex-shrink-0 is-flex is-align-items-center none-click" s slot="reference">
          <b-icon icon="share" pack="casa" custom-size="casa-24px"></b-icon>
        </div>
      </popper>
      <div ><span>{{ $t('Shared') }}</span></div>

    </div>

  </div>

</template>

<script>

const sharedInitData = "shared_init_data";
import events from '@/events/events';
import Popper from 'vue-popperjs';

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
  },
  components: {
    Popper,
  },
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {
    this.checkInit()
    // this.showTip()
  },

  methods: {
    async checkInit() {
      try {
        const res = await this.$api.users.getCustomStorage(sharedInitData)
        const resData = res.data.data
        if (resData) {
          if (!resData.isInit) {
            this.showTip()
          }
        } else {
          this.showTip()

        }
      } catch (error) {
        console.log(error);
      }
    },
    selectShare() {
      this.$EventBus.$emit(events.SELECT_SHARE);
      // this.$tours['myTour'].skip()
    },
    showTip() {
      setTimeout(() => {
        this.$refs.tip.doShow()
      }, 500)
    },
    hideTip() {
      this.$refs.tip.doClose()
      this.$api.users.setCustomStorage(sharedInitData, {
        isInit: true
      })
    }
  },

}
</script>

<style lang="scss" scoped>
.popper {
  background-color: #505459;
  padding: 0.35rem 0.4rem 0.35rem 0.75rem;
  box-shadow: 0px 1px 2px 1px rgba(0, 1, 0, 0.2);
  border: none;
  color: #ffffff;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 400;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.none-click{
  pointer-events: none;
}
</style>

<style lang="scss">
.dark .popper__arrow {
  border-color: #505459 transparent transparent transparent !important;
}
</style>