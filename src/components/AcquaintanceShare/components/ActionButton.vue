<!--
 * @Author: JerryK
 * @Date: 2022-03-11 22:15:20
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-11 22:15:21
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\AcquaintanceShare\components\ActionButton.vue
-->
<template>
  <div class="action-btn">
    <b-dropdown aria-role="list" append-to-body :close-on-click="false" :triggers="['click']" ref="dropDown" :id="'dr-'+index" class="file-dropdown" :position="'is-'+verticalPos+'-'+horizontalPos" animation="fade1" :mobile-modal="false" @active-change="dorpActiveChange($event,'dr-'+index)">
      <template #trigger>
        <p role="button">
          <b-icon icon="dots-horizontal" custom-size="mdi-18px" id="das">
          </b-icon>
        </p>
      </template>
      <b-dropdown-item aria-role="menuitem" v-if="!item.is_dir" @click="downloadFile">
        <b-icon icon="download" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Download') }}
      </b-dropdown-item>
      <b-dropdown-item aria-role="menuitem" v-else @click="openFolder">
        <b-icon icon="folder-open-outline" class="mr-1" custom-size="mdi-18px"></b-icon> {{ $t('Open') }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  inject: ['filePanel'],
  props: {
    cols: Number,
    index: Number,
    item: Object
  },
  data() {
    return {
      verticalPos: "bottom",
    }
  },
  computed: {
    horizontalPos() {
      return (this.index + 1) % this.cols == 0 ? "left" : "right"
    }
  },
  mounted() {
    document.addEventListener('contextmenu', this.hideContextMenu);
  },
  destroyed() {
    document.removeEventListener('contextmenu', this.hideContextMenu)
  },

  methods: {
    dorpActiveChange($event, el) {
      const trigger = document.getElementById(el);
      const bottomOffset = window.innerHeight - trigger.getBoundingClientRect().y - 216
      this.verticalPos = bottomOffset > 0 ? "bottom" : "top"
    },
    hideContextMenu() {
      this.$refs.dropDown.isActive = false
    },
    downloadFile() {
      this.$refs.dropDown.toggle()
      this.$emit("showDetailModal")
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