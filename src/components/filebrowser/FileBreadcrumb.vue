<!--
 * @Author: JerryK
 * @Date: 2022-03-01 15:40:34
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-01 19:16:48
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/FileBreadcrumb.vue
-->
<template>

  <b-breadcrumb size="is-medium" id="bbb">
    <template v-if="isMore">
      <b-breadcrumb-item>DATA</b-breadcrumb-item>
      <b-breadcrumb-item tag="div">
      <b-dropdown aria-role="list" :triggers="['click']" class="file-dropdown" animation="fade1" :mobile-modal="false" append-to-body>
        <template #trigger>
          <p role="button" class="is-clickable">
            <b-icon icon="dots-horizontal" custom-size="mdi-18px" id="das">
            </b-icon>
          </p>
        </template>
        <b-dropdown-item aria-role="menuitem">
          Download
        </b-dropdown-item>
      </b-dropdown>
    </b-breadcrumb-item>
      <b-breadcrumb-item active>0b7c2cbb-d1d6-431e-8386-ff387f943173</b-breadcrumb-item>
    </template>
    <template v-else>
      <b-breadcrumb-item v-for="(item,index) in pathArray" :key="item+index" :active="index == (listLen-1)" :id="index == (listLen-1)?'lastNode':''">{{item}}</b-breadcrumb-item>
    </template>
    <!-- <b-breadcrumb-item>DATA</b-breadcrumb-item>
    <b-breadcrumb-item tag="div">
      <b-dropdown aria-role="list" :triggers="['click']" class="file-dropdown" animation="fade1" :mobile-modal="false" append-to-body>
        <template #trigger>
          <p role="button" class="is-clickable">
            <b-icon icon="dots-horizontal" custom-size="mdi-18px" id="das">
            </b-icon>
          </p>
        </template>
        <b-dropdown-item aria-role="menuitem">
          Download
        </b-dropdown-item>
      </b-dropdown>
    </b-breadcrumb-item>
    <b-breadcrumb-item active>01. 僕たちがやりました（DISH__オリジナルver.）.flac</b-breadcrumb-item> -->
  </b-breadcrumb>

</template>

<script>
import last from 'lodash/last'
import drop from 'lodash/drop'
export default {
  data() {
    return {
      listLen: 0,
      lastWidth: 0,
      pathArray: [],
      isMore: false
    }
  },
  watch: {
    '$store.state.currentPath': {
      handler(val) {
        this.pathArray = drop(val.split("/"))
         setTimeout(() => { this.onResize(); }, 100)
      },
      deep: true
    },
  },
  created() {
    this.pathArray = drop(this.$store.state.currentPath.split("/"))
  },
  mounted() {
    // window.addEventListener('resize', this.onResize);
      setTimeout(() => { this.onResize(); }, 100)

  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onResize() {
      let ww = document.getElementById("bbb")
      let list = ww.getElementsByTagName("li")
      console.log(list);
      let lastList = document.getElementById("lastNode")
      console.log(lastList);
      this.listLen = this.pathArray.length
      this.lastWidth = lastList.clientWidth
      console.log(this.listLen, this.lastWidth);
      this.isMore = (this.listLen > 2) && (this.lastWidth < 50)
      console.log(this.isMore);
    },
  }
}
</script>

<style>
</style>