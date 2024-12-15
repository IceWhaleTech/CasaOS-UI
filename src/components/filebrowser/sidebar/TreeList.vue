<script>
import events from '@/events/events'
import { mixin } from '@/mixins/mixin'
import { has } from 'lodash-es'
import TreeListItem from './TreeListItem.vue'

export default {
  components: {
    TreeListItem,
  },
  mixins: [mixin],
  inject: ['filePanel'],
  props: {
    path: {
      type: String,
      default: '',
    },
    autoLoad: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      rootDataList: [
        {
          name: 'Root',
          icon: 'root-outline',
          pack: 'casa',
          path: '/',
          visible: true,
          selected: true,
          extensions: null,
        },
      ],

      initFolders: [
        {
          name: 'DATA',
          icon: 'data-outline',
          pack: 'casa',
          path: '/DATA',
          visible: true,
          selected: true,
          extensions: null,
        },
        {
          name: 'Documents',
          icon: 'files-outline',
          pack: 'casa',
          path: '/DATA/Documents',
          visible: true,
          selected: true,
          extensions: null,
        },
        {
          name: 'Downloads',
          icon: 'downloads-outline',
          pack: 'casa',
          path: '/DATA/Downloads',
          visible: true,
          selected: true,
          extensions: null,
        },
        {
          name: 'Gallery',
          icon: 'gallery-outline',
          pack: 'casa',
          path: '/DATA/Gallery',
          visible: true,
          selected: true,
          extensions: null,
        },
        {
          name: 'Media',
          icon: 'media-outline',
          pack: 'casa',
          path: '/DATA/Media',
          visible: true,
          selected: true,
          extensions: null,
        },

      ],
      dataList: [],
      shortcutList: [],
    }
  },
  async created() {
    // Get the shortcut detail for the first time and save it to store
    try {
      await this.$store.dispatch('GET_SHORTCUT_DATA')
    }
    catch (e) {
      console.error(e)
    }
    this.getNewList()
  },

  mounted() {
    this.$EventBus.$on(events.RELOAD_FILE_LIST, this.getNewList)

    this.shortcutList = this.$store.state.shortcutData
    this.dataList = [...this.initFolders, ...this.shortcutList]
  },
  methods: {
    async getNewList() {
      const newList = await this.$api.folder.getList(this.rootDataList[0].path)
      const dataList = await this.$api.folder.getList(this.initFolders[0].path)

      this.shortcutList = this.$store.state.shortcutData

      this.dataList = [...this.initFolders, ...this.shortcutList]
      const contactList = []
      contactList.push(...newList.data.data.content, ...dataList.data.data.content, ...this.shortcutList)
      this.dataList.forEach((dir) => {
        dir.icon = dir.icon === 'folder' ? 'folder-outline' : dir.icon
        dir.visible = contactList.some(item => item.path === dir.path && item.is_dir)
        const isInArray = contactList.find(item => item.path === dir.path && item.is_dir)
        dir.extensions = isInArray ? isInArray.extensions : null
      })
    },

    checkSharevisibility(item) {
      const extensions = item.extensions
      if (extensions === null) {
        return false
      }
      else {
        if (has(extensions, 'share')) {
          return extensions.share.shared === 'true'
        }
        else {
          return false
        }
      }
    },

  },
}
</script>

<template>
  <div class="ul">
    <!-- Root List Start -->
    <TreeListItem
      v-for="item in rootDataList" :key="item.path" :is-active="isActive" :item="item"
      icon-color="casa-color-blue"
    />
    <!-- Root List End -->

    <!-- Data List Start -->
    <TreeListItem
      v-for="item in dataList" :key="item.path" :is-active="isActive" :is-share="checkSharevisibility(item)"
      :item="item" icon-color="casa-color-blue"
    />
    <!-- Data List End -->
  </div>
</template>
