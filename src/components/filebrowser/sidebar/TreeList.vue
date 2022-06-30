<!--
 * @Author: JerryK
 * @Date: 2022-03-03 13:10:35
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-30 14:27:54
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\sidebar\TreeList.vue
-->
<template>
  <ul>
    <li v-for="item in rootDataList" :key="item.path">
      <div class="is-flex list-item new-list-item" :class="{'active':checkActive(item)}" @click="open(item.path)">
        <div class="cover mr-4 is-flex-shrink-0">
          <b-icon :icon="item.icon"></b-icon>
        </div>
        <span>{{item.name}}</span>
      </div>
    </li>
    <li v-for="item in initFolders" :key="item.path">
      <div class="is-flex list-item new-list-item" :class="{'active':checkActive(item)}" @click="open(item.path)" v-if="item.visible">
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
      rootDataList: [
        {
          name: 'Root',
          icon: 'folder-home-outline',
          path: '/'
        },
      ],

      initFolders: [
        {
          name: 'DATA',
          icon: 'folder-pound-outline',
          path: '/DATA',
          visible: true
        },
        {
          name: 'Documents',
          icon: 'folder-text-outline',
          path: '/DATA/Documents',
          visible: true
        },
        {
          name: 'Downloads',
          icon: 'folder-download-outline',
          path: '/DATA/Downloads',
          visible: true
        },
        {
          name: 'Gallery',
          icon: 'folder-star-outline',
          path: '/DATA/Gallery',
          visible: true
        },
        {
          name: 'Media',
          icon: 'folder-music-outline',
          path: '/DATA/Media',
          visible: true
        },

      ],
      dataList: [],
    }
  },
  created() {
    this.dataList = this.initFolders;
  },

  mounted() {
    this.$EventBus.$on("reloadFileList", () => {
      this.getNewList()
    });

  },
  methods: {
    async getNewList() {
      const newList = await this.$api.file.dirPath("/")
      const dataList = await this.$api.file.dirPath("/DATA")
      const contactList = []
      contactList.push(...newList.data.data, ...dataList.data.data)
      this.initFolders.forEach(dir => {
        dir.visible = contactList.some(item => item.path == dir.path && item.is_dir)
      })
    },

    open(path) {
      this.filePanel.getFileList(path);
    },
    checkVisibility(path) {
      return this.dataList.some(item => item.path == path)
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