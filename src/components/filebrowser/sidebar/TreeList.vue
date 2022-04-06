<!--
 * @Author: JerryK
 * @Date: 2022-03-03 13:10:35
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-08 20:40:34
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\sidebar\TreeList.vue
-->
<template>
  <ul>
    <li v-for="item in initFolders" :key="item.path">
      <div class="is-flex list-item new-list-item" :class="{'active':checkActive(item)}" @click="open(item.path)">
        <div class="cover mr-4 is-flex-shrink-0">
          <b-icon :icon="item.icon"></b-icon>
        </div>
        <span>{{item.name}}</span>
      </div>
    </li>

  </ul>
</template>

<script>

import { mixin } from '@/mixins/mixin';
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
    }
  },
  data() {
    return {
      dirListData: [],
      initFolders: [
        {
          name: 'Root',
          icon: 'folder-home-outline',
          path: '/'
        },
        {
          name: 'DATA',
          icon: 'folder-pound-outline',
          path: '/DATA'
        },
        {
          name: 'Documents',
          icon: 'folder-text-outline',
          path: '/DATA/Documents'
        },
        {
          name: 'Downloads',
          icon: 'folder-download-outline',
          path: '/DATA/Downloads'
        },
        {
          name: 'Gallery',
          icon: 'folder-star-outline',
          path: '/DATA/Gallery'
        },
        {
          name: 'Media',
          icon: 'folder-music-outline',
          path: '/DATA/Media'
        },

      ]
    }
  },

  mounted() {


  },
  methods: {

    open(path) {
      this.filePanel.getFileList(path);
    },
    checkActive(item) {
      if (item.path == this.$store.state.currentPath) {
        return true
      } else if (item.path != this.$store.state.currentPath && item.path != "/" && item.path != "/DATA") {
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

<style>
</style>