<!--
 * @Author: JerryK
 * @Date: 2021-10-14 14:08:40
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-07 11:18:29
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\fileList\FilePanel.vue
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
            <a v-if="showItem" @click="getParentList()">
              <b-icon icon="arrow-up"></b-icon>
            </a>
          </li>
          <li v-if="showItem"><a @click="getFileList(rootPath)">{{rootName}}</a></li>
          <li v-if="showItem & showDots"><a @click="getParentList()">...</a></li>
          <li class="is-active ">
            <div>{{lastFolder}}</div>
          </li>
        </ul>
      </nav>
      <ul class="filelist scrollbars-light">
        <list-item v-for="(item) in fileList" :item="item" :id="item.path" :key="item.path" :name="item.name" :IsDir="item.is_dir" :path="item.path" :state="checkActive(item.path)" @active="activeFile" @expand="getFileList"></list-item>
      </ul>
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1">
        <div v-if="rootPath == '/DATA'">
          <b-tooltip label="Create Folder" type="is-dark" position="is-right">
            <a class="add-button" @click="showCreatePanel(true)">
              <b-icon icon="folder-plus"></b-icon>
            </a>
          </b-tooltip>
          <template v-if="rootPath != path && showFile">
            <b-tooltip label="Create File" type="is-dark" position="is-right">
              <a class="add-button" @click="showCreatePanel(false)">
                <b-icon icon="file-plus-outline"></b-icon>
              </a>
            </b-tooltip>
          </template>
        </div>
      </div>
      <div>
        <b-button label="Cancel" type="is-grey" @click="$emit('close')" rounded />
        <b-button label="Select" type="is-dark" @click="selectFile()" rounded />
      </div>
    </footer>
    <!-- Modal-Card Footer End-->
  </div>
</template>

<script>
import ListItem from "./ListItem.vue"
import CreatePanel from './CreatePanel.vue'
import trimStart from 'lodash/trimStart'
import dropRight from 'lodash/dropRight'

export default {
  name: "file-panel",
  components: {
    ListItem,
  },
  data() {
    return {
      path: this.initPath,
      activePath: this.initPath,
      fileList: [],
    }
  },
  props: {
    initPath: String,
    rootPath: String,
    showFile: {
      type: Boolean,
      default: true
    },
  },
  computed: {
    // get Last foler name for breadcrumb
    lastFolder() {
      return this.path.split("/").pop()
    },
    // check show breadcrumb item
    showItem() {
      return this.path != this.rootPath
    },
    // check show breadcrumb dots
    showDots() {
      return this.path.split("/").length > 3
    },
    // Root Name
    rootName() {
      return trimStart(this.rootPath, '/');
    },
  },
  created() {
    this.path = (this.path == this.rootPath) ? this.path : dropRight(this.path.split("/"), 1).join("/")
    this.getFileList(this.path, true);
  },

  methods: {
    // get file list from api
    getFileList(path, locate = false) {
      this.$api.file.dirPath(path).then(res => {
        if (res.data.success == 200) {
          this.path = path
          if (this.showFile) {
            this.fileList = res.data.data;
          } else {
            this.fileList = res.data.data.filter((item) => {
              return item.is_dir
            });
          }
          if (locate) {
            this.locateFile();
          } else {
            this.activePath = path
          }
        }
      })
    },

    locateFile() {
      this.$nextTick(() => {
        const activeItem = document.getElementById(this.activePath)
        if (activeItem != null) {
          activeItem.scrollIntoView()
        }
      })
    },

    // get parent list
    getParentList() {
      let backDir = dropRight(this.path.split("/"), 1).join("/");
      if (backDir === "/")
        return false
      this.getFileList(backDir);
    },
    selectFile() {
      this.$emit('close');
      this.$emit('updatePath', this.activePath);
    },
    activeFile(val) {
      this.activePath = (this.activePath == val) ? this.path : val;
    },
    checkActive(val) {
      return this.activePath == val
    },
    // show create folder or file panel
    showCreatePanel(isFolder) {
      console.log("create panel");
      this.$buefy.modal.open({
        parent: this,
        component: CreatePanel,
        hasModalCard: true,
        customClass: 'fileModal',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        events: {
          'reloadPath': (path) => {

            this.getFileList(this.path);
            this.activePath = path;
          }
        },
        props: {
          initPath: (this.path == "") ? this.rootPath : this.path,
          isDir: isFolder
        }
      })
    }
  },
}
</script>

<style>
</style>