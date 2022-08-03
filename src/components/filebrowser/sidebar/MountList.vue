<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-08-03 14:08:02
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-03 17:57:32
 * @FilePath: /CasaOS-UI/src/components/filebrowser/sidebar/MountList.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <ul>

    <li v-for="item in initFolders" :key="item.path">
      <div class="is-flex list-item new-list-item" :class="{'active':checkActive(item)}" @click="open(item.path)" v-if="item.visible">
        <div class="cover mr-2 is-flex-shrink-0 is-relative">
          <b-icon :pack="item.pack" :icon="item.icon" custom-size="casa-28px"></b-icon>
        </div>
        <div class=" is-flex-grow-1">{{item.name}}</div>

      </div>
    </li>

  </ul>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import events from '@/events/events';
import has from 'lodash/has'
export default {
  mixins: [mixin],
  inject: ['filePanel'],

  props: {
    path: {
      type: String,
      default: ""
    },
    autoLoad: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      rootDataList: [
        {
          name: 'Root',
          icon: 'folder-root',
          pack: 'casa',
          path: '/',
          visible: true,
          selected: true,
          extensions: null
        },
      ],

      initFolders: [
        {
          name: 'DATA',
          icon: 'folder-data',
          pack: 'casa',
          path: '/DATA',
          visible: true,
          selected: true,
          extensions: null
        },
        {
          name: 'Documents',
          icon: 'folder-documents',
          pack: 'casa',
          path: '/DATA/Documents',
          visible: true,
          selected: true,
          extensions: null
        },
        {
          name: 'Downloads',
          icon: 'folder-downloads',
          pack: 'casa',
          path: '/DATA/Downloads',
          visible: true,
          selected: true,
          extensions: null
        },
        {
          name: 'Gallery',
          icon: 'folder-gallery',
          pack: 'casa',
          path: '/DATA/Gallery',
          visible: true,
          selected: true,
          extensions: null
        },
        {
          name: 'Media',
          icon: 'folder-media',
          pack: 'casa',
          path: '/DATA/Media',
          visible: true,
          selected: true,
          extensions: null
        },

      ],
      dataList: [],
    }
  },
  created() {
    this.dataList = this.initFolders;
    this.getNewList()
  },

  mounted() {
    this.$EventBus.$on(events.RELOAD_FILE_LIST, this.getNewList);

  },
  methods: {
    async getNewList() {

      const newList = await this.$api.folder.getList(this.rootDataList[0].path)
      const dataList = await this.$api.folder.getList(this.initFolders[0].path)
      const contactList = []
      contactList.push(...newList.data.data, ...dataList.data.data)
      this.initFolders.forEach(dir => {
        dir.visible = contactList.some(item => item.path == dir.path && item.is_dir)
        dir.extensions = contactList.find(item => item.path == dir.path && item.is_dir).extensions;
      })
    },

    open(path) {
      this.filePanel.getFileList(path);
    },
    checkVisibility(path) {
      return this.dataList.some(item => item.path == path)
    },
    checkSharevisibility(item) {
      const extensions = item.extensions
      if (extensions === null) {
        return false
      } else {
        if (has(extensions, 'share')) {
          return extensions.share.shared === "true"
        } else {
          return false
        }
      }
    },
    checkActive(item) {
      if (!this.isActive) {
        return false
      }
      if (item.path == this.$store.state.currentPath) {
        return true
      } else if (item.path != this.$store.state.currentPath && item.path != this.rootDataList[0].path && item.path != this.initFolders[0].path) {
        if (this.$store.state.currentPath.indexOf(item.path) != -1) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },

  },
}
</script>

<style lang="scss" scoped>
.overlay-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  .icon {
    position: absolute;
    right: -0.15rem;
    bottom: -0.1rem;
  }
}
</style>