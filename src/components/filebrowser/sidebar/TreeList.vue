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
    <li>
      <div class="is-flex list-item" :class="{'active': isHome()}" @click="open">
        <div class="cover mr-2 is-flex-shrink-0">
          <div :class="homeItem | coverType">
            <img alt="folder" :src="getIconFile(homeItem)" :class="homeItem | iconType" />
          </div>
        </div>
        <span>{{homeItem.name}}</span>
      </div>
    </li>

    <tree-list-item v-for="(item,index) in dirListData" :key="item.name+index" :item="item" :level="level"></tree-list-item>
  </ul>
</template>

<script>
import filter from 'lodash/filter'
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  inject: ['filePanel'],
  components: {
    TreeListItem: () => import('./TreeListItem.vue')
  },
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
      homeItem: {
        path: "/DATA",
        is_dir: true,
        type: "home",
        name: "DATA"
      }
    }
  },
  computed: {
    level() {
      return this.path.split("/").length + 1
    }
  },
  mounted() {
    if (this.autoLoad) {
      this.getDirList();
    }

  },
  methods: {
    isHome() {
      return this.homeItem.path == this.$store.state.currentPath
    },
    open() {
      this.filePanel.getFileList(this.homeItem.path);
    },
    getDirList() {
      this.$api.file.dirPath("/DATA").then(res => {
        if (res.data.success == 200) {
          this.dirListData = filter(res.data.data, (o) => {
            return o.is_dir;
          })
          this.$emit("update", this.dirListData.length)
        }
      })
    }
  },
}
</script>

<style>
</style>