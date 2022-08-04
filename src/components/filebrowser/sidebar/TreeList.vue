<!--
 * @Author: JerryK
 * @Date: 2022-03-03 13:10:35
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-04 22:08:47
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\sidebar\TreeList.vue
-->
<template>
  <ul>
    <!-- Root List Start -->
    <tree-list-item v-for="item in rootDataList" :key="item.path" :item="item" iconColor="casa-color-blue" :isActive="isActive"></tree-list-item>
    <!-- Root List End -->

    <!-- Data List Start -->
    <tree-list-item v-for="item in initFolders" :key="item.path" :item="item" iconColor="casa-color-blue" :isShare="checkSharevisibility(item)" :isActive="isActive"></tree-list-item>
    <!-- Data List End -->

  </ul>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import events from '@/events/events';
import has from 'lodash/has'

import TreeListItem from './TreeListItem.vue';
export default {
  mixins: [mixin],
  inject: ['filePanel'],
  components: {
    TreeListItem,
  },
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
        dir.visible = contactList.some(item => item.path == dir.path && item.is_dir);
        const isInArray = contactList.find(item => item.path == dir.path && item.is_dir)
        dir.extensions = isInArray ? isInArray.extensions : null;
      })
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

  },
}
</script>

