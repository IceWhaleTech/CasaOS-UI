<!--
 * @Author: JerryK
 * @Date: 2022-03-03 13:27:35
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-08 20:40:45
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\sidebar\TreeListItem.vue
-->
<template>

  <li>
    <div class="is-flex list-item" :class="{'active': isActive()}" @click="open" :style="styleObj">

      <div class="cover mr-2 is-flex-shrink-0">
        <div :class="item | coverType">
          <img alt="folder" :src="getIconFile(item)" :class="item | iconType" />
        </div>
      </div>
      <span>{{item.name}}</span>
    </div>
    <!-- Sub List Start -->
    <tree-list ref="subList" :path="item.path" @update="subListUpdate" :style="subListStyleObj"></tree-list>
    <!-- Sub List End -->
  </li>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import slice from 'lodash/slice'

export default {
  mixins: [mixin],
  inject: ['filePanel'],
  components: {
    TreeList: () => import('./TreeList.vue')
  },
  props: {
    item: {
      type: Object,
      default: null
    },
    level: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dirListData: [],
      isLoading: false,
      hasChild: true,
      isExpand: false,
      subListLen: 0,
      styleObj: {
        paddingLeft: this.level * 0.5 + "rem"
      }
    }
  },
  computed: {
    arrowIcon() {
      return this.isExpand ? "menu-down" : "menu-right"
    },
    subListStyleObj() {
      if (this.isExpand) {
        return {
          height: this.subListLen * 32 + "px"
        }
      } else {
        return {
          height: "0px"
        }
      }
    }
  },

  methods: {
    isActive() {
      let pathArray = slice(this.$store.state.currentPath.split("/"), 0, 3)
      return this.item.path == pathArray.join("/")
    },
    open() {
      this.filePanel.getFileList(this.item.path);
    },
    getDirList() {
      if (!this.hasChild) {
        return false
      }
      if (!this.isExpand && !this.isLoading) {
        this.isLoading = true
        this.$refs.subList.getDirList()
      } else {
        this.isExpand = !this.isExpand
      }

    },
    subListUpdate(val) {
      this.subListLen = val
      this.hasChild = val > 0
      this.isLoading = false
      if (val > 0) {
        this.isExpand = true
      }


    }
  },
}
</script>

<style>
</style>