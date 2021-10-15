<!--
 * @Author: JerryK
 * @Date: 2021-10-14 14:08:40
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-15 11:10:50
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/fileList/FilePanel.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">Select</h3>
      </div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body">

      <nav class="breadcrumb " aria-label="breadcrumbs">
        <ul>
          <li>
            <b-tooltip label="Tooltip top">
              <a>
                <b-icon icon="arrow-up"></b-icon>
              </a>
            </b-tooltip>
          </li>
          <li><a @click="getFileList(rootPath)">{{rootPath.slice(1, -1)}}</a></li>
          <li><a>...</a></li>
          <li class="is-active ">
            <div>Black.Window.2021.10.08 1080PBlack.Window.2021.10.08 1080P</div>
          </li>
        </ul>
      </nav>
      <ul class="filelist">
        <list-item v-for="item in fileList" :key="item.path" :name="item.name" :IsDir="item.is_dir" :path="item.path" :state="checkActive(item.path)" @active="activeFile" @expand="getFileList"></list-item>
      </ul>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1">
        <b-tooltip label="Create Folder" type="is-dark">
          <b-icon icon="folder-plus"></b-icon>
        </b-tooltip>

        <b-tooltip label="Create File" type="is-dark">
          <b-icon icon="file-plus-outline"></b-icon>
        </b-tooltip>

      </div>
      <div>
        <b-button label="Cancel" @click="$emit('close')" rounded />
        <b-button label="Select" type="is-dark" @click="selectFile()" rounded />
      </div>
    </footer>
    <!-- Modal-Card Footer End-->
  </div>
</template>

<script>
import ListItem from "./ListItem.vue"

const _ = require('lodash')
export default {
  name: "file-panel",
  components: {
    ListItem,
  },
  data() {
    return {
      rootPath: "/DATA/",
      path: (this.initPath == "") ? "/DATA/" : this.initPath,
      activePath: "",
      fileList: [],

    }
  },
  props: {
    initPath: String
  },
  computed: {
    queryPath() {
      return (this.path == this.rootPath) ? this.path : _.dropRight(this.path.split("/"), 2).join("/") + "/"
    },
    backPath() {
      return this.data
    }
  },
  created() {
    this.getFileList(this.queryPath);
  },

  methods: {
    getFileList(path) {
      this.$api.file.dirPath(path).then(res => {
        if (res.data.success == 200) {
          this.fileList = res.data.data;
          //console.log(this.fileList);
        }
      })
    },
    selectFile() {
      this.$emit('close');
      this.$emit('updatePath', this.path);
    },
    activeFile(val) {
      this.path = val;
      this.activePath = val;
    },
    checkActive(val) {
      return (this.activePath == val) ? true : false
    }
  },
}
</script>

<style>
</style>