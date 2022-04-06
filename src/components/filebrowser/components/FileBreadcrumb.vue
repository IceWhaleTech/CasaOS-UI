<!--
 * @Author: JerryK
 * @Date: 2022-03-01 15:40:34
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-07 16:04:41
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\FileBreadcrumb.vue
-->
<template>
  <div>
    <b-breadcrumb size="is-medium">
      <b-breadcrumb-item v-for="(item,index) in pathCollection" :key="item+index" :active="checkActive(index)" @click.stop="open(item)" v-show="item.show || item == activeHide">
        <template v-if="item == activeHide">
          <b-dropdown aria-role="list" append-to-body :triggers="['']" ref="breadDrop" class="file-dropdown" animation="fade1" :mobile-modal="false">
            <template #trigger>
              <p role="button">
                <b-icon icon="dots-horizontal" custom-size="mdi-18px" id="das">
                </b-icon>
              </p>
            </template>
            <b-dropdown-item aria-role="menuitem" :key="'ff'+index" v-for="(sitem,index) in hideItems" @click="subOpen(sitem)">
              {{sitem.name}}
            </b-dropdown-item>

          </b-dropdown>
        </template>
        <template v-else>
          {{item.name}}
        </template>
      </b-breadcrumb-item>
    </b-breadcrumb>
    <b-breadcrumb size="is-medium" class="shadow" id="shadowBread">
      <b-breadcrumb-item v-for="(item,index) in pathCollection" :key="'fake'+item+index">
        {{item.name}}
      </b-breadcrumb-item>
    </b-breadcrumb>
  </div>

</template>

<script>
import slice from 'lodash/slice'
import map from 'lodash/map'
import sum from 'lodash/sum'
import remove from 'lodash/remove'
import findLast from 'lodash/findLast'
export default {
  inject: ['filePanel'],
  data() {
    return {
      pathCollection: [],
      hideItems: [],
      activeHide: {}
    }
  },
  watch: {
    '$store.state.currentPath': {
      handler(val) {
        this.pathCollection = this.buildPathArray(val)
        this.onResize()
      },
      deep: true
    },
  },
  computed: {
    dropMenu() {
      return this.$refs.breadDrop[0]
    }
  },
  created() {
    this.pathCollection = this.buildPathArray(this.$store.state.currentPath)
  },
  mounted() {

  },
  methods: {
    open(item) {
      if (item == this.activeHide) {
        this.$refs.breadDrop[0].isActive = !this.$refs.breadDrop[0].isActive
        return false
      }
      this.filePanel.getFileList(item.path);
    },
    subOpen(item) {
      this.filePanel.getFileList(item.path);
      // this.onResize(this.pathArray)
    },
    checkActive(index) {
      return index == this.pathCollection.length - 1
    },
    onResize() {
      let shadowBread = document.getElementById("shadowBread")
      let containerWidth = document.getElementById("bread-container").clientWidth
      this.$nextTick(() => {
        this.hideItems = []
        let shadowBreadWidth = shadowBread.clientWidth
        if (shadowBreadWidth > containerWidth) {
          let shadowBreadList = shadowBread.getElementsByTagName("li")
          let shadowBreadListWidth = map(shadowBreadList, item => {
            return item.clientWidth
          })
          this.pathCollection.forEach((item, index) => {
            if (index > 0 && sum(shadowBreadListWidth) + 50 > containerWidth && index < this.pathCollection.length - 1) {
              remove(shadowBreadListWidth, (item, index) => {
                return index == 1
              })
              item.show = false
              this.hideItems.push(item)
            }
          })
          this.activeHide = findLast(this.pathCollection, (item) => {
            return !item.show
          })
        }
      })
    },

    buildPathArray(path) {
      if (path == "/") {
        path = path.substr(1);
      }
      let arr = path.split("/")
      let collection = arr.map((item, index) => {
        return {
          name: item == "" ? "Root" : item,
          show: true,
          path: item == "" ? "/" : slice(arr, 0, index + 1).join("/")
        }
      })
      return collection
    }
  }
}
</script>

<style>
</style>