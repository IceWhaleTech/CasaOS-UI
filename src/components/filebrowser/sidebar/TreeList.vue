<!--
 * @Author: JerryK
 * @Date: 2022-03-03 13:10:35
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-01 18:38:25
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/sidebar/TreeList.vue
-->
<template>
  <ul>
    <li v-for="item in rootDataList" :key="item.path">
      <div class="is-flex list-item new-list-item" :class="{'active':checkActive(item)}" @click="open(item.path)">
        <div class="cover mr-2 is-flex-shrink-0">
          <b-icon :pack="item.pack" :icon="item.icon" custom-size="casa-28px" class="casa-color-blue"></b-icon>
        </div>
        <span>{{item.name}}</span>
      </div>
    </li>
    <li v-for="item in initFolders" :key="item.path">
      <div class="is-flex list-item new-list-item" :class="{'active':checkActive(item)}" @click="open(item.path)" v-if="item.visible">
        <div class="cover mr-2 is-flex-shrink-0">
          <b-icon :pack="item.pack" :icon="item.icon" custom-size="casa-28px" class="casa-color-blue"></b-icon>
        </div>
        <div class=" is-flex-grow-1">{{item.name}}</div>
        <div class=" is-flex-shrink-0" v-if="checkSharevisibility(item)">
          <b-icon :pack="item.pack" icon="share" custom-size="casa-14px" class="casa-color-green casa-shape-rounded casa-shape-16px"></b-icon>
        </div>
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

<style>
</style>