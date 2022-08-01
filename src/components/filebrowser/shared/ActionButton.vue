<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-30 19:40:20
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-31 19:34:15
 * @FilePath: \CasaOS-UI\src\components\filebrowser\shared\ActionButton.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="action-btn">
    <b-dropdown aria-role="list" append-to-body close-on-click ref="dropDown" :id="'dr-'+index" class="file-dropdown" :position="'is-'+verticalPos+'-left'" animation="fade1">
      <template #trigger>
        <p role="button">
          <b-icon icon="dots-horizontal" custom-size="mdi-18px" id="das">
          </b-icon>
        </p>
      </template>
      <b-dropdown-item aria-role="menuitem" @click="getShareLink(item)">
        {{ $t('Get Share Link') }}
      </b-dropdown-item>
      <b-dropdown-item aria-role="menuitem" @click="goto">
        {{ $t('Go to') }}
      </b-dropdown-item>
      <hr class="dropdown-divider">
      <b-dropdown-item aria-role="menuitem" class="has-text-danger" @click="unShare">
        {{ $t('UnShare') }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import ShareDetial from './ShareDetial.vue'
import events from '@/events/events';
export default {
  props: {
    index: Number,
    item: Object
  },
  components: {

  },
  data() {
    return {
      verticalPos: "bottom"
    }
  },
  methods: {
    getShareLink(item) {
      this.$buefy.modal.open({
        parent: this,
        component: ShareDetial,
        hasModalCard: true,
        customClass: 'share-detial-panel file-modal',
        trapFocus: true,
        canCancel: [''],
        scroll: "keep",
        animation: "zoom-in",
        events: {

          'close': () => {
            // this.isModalOpen = false
          }
        },
        props: {
          item: item
        }
      })
    },
    unShare() {
      this.$EventBus.$emit(events.UN_SHARE, this.item);
    },

    goto() {
      this.$EventBus.$emit(events.GOTO, this.item);
    }

  },
}
</script>

<style>
</style>