<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-03-11 22:15:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-30 17:28:54
 * @FilePath: \CasaOS-UI\src\components\AcquaintanceShare\components\ContextMenu.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->

<template>
  <div>

    <div class="action-btn context-menu" :style="{top:y + 'px',left:x+'px'}">
      <b-dropdown aria-role="list" :close-on-click="false" ref="dropDown" id="dr1" class="file-dropdown" :position="'is-'+verticalPos+'-'+horizontalPos" :animation="ani" :mobile-modal="false" @active-change="dorpActiveChange($event,'dr1')">
        <!-- Blank Start -->
        <template v-if="!showDetial">
          <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" key="system-context5" @click="$refs.dropDown.toggle();filePanel.reload()">
            <b-icon icon="refresh" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Refresh') }}
          </b-dropdown-item>
        </template>
        <!-- Blank End -->

        <!-- Item Start -->
        <template v-else>
          <b-dropdown-item class="is-flex is-align-items-center" aria-role="menuitem" key="file-context1" v-if="!item.is_dir" @click="downloadFile">
            <b-icon icon="download" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Download') }}
          </b-dropdown-item>
          <b-dropdown-item class="is-flex is-align-items-center" aria-role="menuitem" key="file-context2" v-else @click="openFolder">
            <b-icon icon="folder-open-outline" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Open') }}
          </b-dropdown-item>
        </template>
        <!-- Item End -->
      </b-dropdown>

    </div>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  inject: ['filePanel'],
  data() {
    return {
      verticalPos: "bottom",
      horizontalPos: "right",
      isConfirmed: false,
      x: Number,
      y: Number,
      showDetial: false,
      ani: "fade1",
      item: {},
      user: {},
      
    }
  },

  computed: {
    close() {
      return this.item == undefined
    }
  },

  methods: {
    open(event, item) {
      let bounced = event.target.getAttribute('class').includes('dropdown-menu')
      if (!bounced) {
        this.showDetial = (item != undefined)
        this.item = item
        this.$refs.dropDown.isActive = false
        this.$nextTick(() => {
          this.x = event.clientX
          this.y = event.clientY
          const rightOffset = window.innerWidth - event.clientX - 184
          this.horizontalPos = rightOffset > 0 ? "right" : "left"
          this.$refs.dropDown.isActive = true;
        })
      }
    },

    dorpActiveChange($event, el) {
      if ($event) {
        this.isConfirmed = false
      }
      const trigger = document.getElementById(el);
      const bottomOffset = window.innerHeight - trigger.getBoundingClientRect().y - 216
      this.verticalPos = bottomOffset > 0 ? "bottom" : "top"
    },
    downloadFile() {
      this.$refs.dropDown.toggle()
      this.filePanel.showDownloadModal(this.filePanel.currentUser, this.item);
    },
    openFolder() {
      this.$refs.dropDown.toggle()
      this.filePanel.getUserFiles(this.filePanel.currentUser, this.item.path);
    }
  },
}
</script>

<style>
</style>