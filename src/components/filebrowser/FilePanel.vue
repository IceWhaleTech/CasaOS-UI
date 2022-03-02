<!--
 * @Author: JerryK
 * @Date: 2022-02-18 12:42:06
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-02 19:12:14
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/FilePanel.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body is-flex">
      <!-- <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading> -->

      <!-- NavBar Start -->
      <div class="nav-bar">
        <h2 class="title is-4">Files</h2>
        <div class="list-container">

        </div>
      </div>
      <!-- NavBar Start -->

      <!-- Main Content Start -->

      <div class="content flex1">
        <uploader ref="uploader" :options="options" class="uploader-example">
          <uploader-unsupport></uploader-unsupport>
          <!-- Drag and Drop Mask Start -->

          <!-- Drag and Drop Mask End -->

          <!-- Header Start -->
          <header class="modal-card-head">
            <div class="flex1 is-flex ">
              <!-- <b-input placeholder="Search in folder..." size="is-small" rounded></b-input> -->
            </div>
            <div class="is-flex is-align-items-center">

              <!-- Paste Button Start -->
              <transition name="fade">
                <b-button icon-left="content-paste" type="is-success" size="is-small" label="Paste" class="mr-3" @click.once="paste" v-if="hasPasteData" rounded />
              </transition>
              <!-- Paste Button End -->

              <!-- Upload Button Start -->

              <uploader-btn class="button is-small is-rounded ">upload files</uploader-btn>
              <uploader-btn class="button is-small is-rounded" :directory="true">upload folder</uploader-btn>
              <!-- Upload Button End -->

              <!-- Create Button Start -->
              <b-button icon-left="folder-plus-outline" size="is-small" label="New folder" @click="showNewFolderModal" rounded />
              <!-- Create Button End -->

              <div class="is-flex is-align-items-center modal-close-container ">
                <button type="button" class="delete" @click="$emit('close')" />
              </div>

            </div>
          </header>
          <!-- Header End -->

          <!-- Tool Bar Start -->
          <div class="tool-bar is-flex">
            <div class="breadcrumb-container  flex1" @click="init">
              <file-breadcrumb></file-breadcrumb>
            </div>
            <div class="view-btns is-flex-shrink-0">
              <b-tooltip label="Change View" position="is-left" type="is-dark">
                <p role="button" class="is-clickable" @click="changeView">
                  <b-icon :icon="viewIcon"></b-icon>
                </p>
              </b-tooltip>
            </div>
          </div>
          <!-- Tool Bar End -->

          <!-- List View Start -->
          <div id="dropTarget">
            <div class="drag-mask is-flex" v-if="isDragIn">
              <div>
                <div class="upload-icon">
                  <b-icon icon="arrow-up" size="is-medium" type="is-white"></b-icon>
                </div>
                <p class="has-text-primary">
                  Upload to {{currentPathName}}
                </p>

              </div>

            </div>
            <component :is="listView" v-model="listData" @showDetailModal="showDetailModal" @gotoFolder="getFileList" @reload="getFileList(currentPath)" @upload="$emit('upload')" @newFolder="showNewFolderModal"></component>

          </div>
          <!-- List View End -->
          <!-- Upload List Start-->
          <div class="upload-list" v-if="showUploadList">
            <b-collapse class="card" animation="slide1" aria-id="contentIdForA11y3">
              <template #trigger="props">
                <div class="card-header" role="button" aria-controls="contentIdForA11y3" :aria-expanded="props.open">
                  <p class="card-header-title">
                    {{uploaderListHeaderText}}
                  </p>
                  <a class="card-header-icon" @click.prevent="closeUploaderList">
                    <b-icon icon="close"></b-icon>
                  </a>
                </div>
              </template>

              <div class="card-content">
                <div class="content">
                  <uploader-list></uploader-list>
                </div>
              </div>
              <footer class="card-footer">
                <a class="card-footer-item">Close</a>
              </footer>
            </b-collapse>

          </div>
          <!-- Upload List End-->

        </uploader>
      </div>

      <!-- Main Content End -->
    </section>
    <!-- Modal-Card Body End -->
  </div>
</template>

<script>
// import trimStart from 'lodash/trimStart'
// import dropRight from 'lodash/dropRight'
import orderBy from 'lodash/orderBy'
import { mixin } from '@/mixins/mixin';
import GirdView from './GirdView.vue';
import ListView from './ListView.vue';
import DetailModal from './DetailModal.vue'
import NewFolderModal from './NewFolderModal.vue'
import FileBreadcrumb from './FileBreadcrumb.vue';


export default {
  mixins: [mixin],
  data() {
    return {
      isDragIn: false,

      rootPath: "/DATA",
      currentPath: "",
      currentPathName: "",
      isViewGird: true,
      listData: [],
      file: null,
      timeout: null,
      uploadPercentage: 0,
      hasPasteData: this.$store.state.operateObject != null,
      uploaderInstance: {},
      options: {
        // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
        target: (process.env.NODE_ENV === "'dev'") ? `http://${this.$store.state.devIp}:${this.$store.state.devPort}/v1/file/upload?token=${this.$store.state.token}` : `http://${document.location.host}/v1/file/upload?token=${this.$store.state.token}`,
        testChunks: false,
        chunkSize: 1024 * 1024 * 1024 * 1024
      },
      attrs: {
        accept: '*'
      },
      // Uploader List
      showUploadList: false,
      uploaderListHeaderText: "Uploading"
    }
  },
  components: {
    ListView,
    GirdView,
    FileBreadcrumb,

  },
  computed: {
    viewIcon() {
      return this.isViewGird ? "view-grid-outline" : "format-list-bulleted"
    },
    listView() {
      return this.isViewGird ? "gird-view" : "list-view"
    }
  },
  watch: {
    '$store.state.operateObject': {
      handler(val) {
        this.hasPasteData = (val != null)
      },
      deep: true
    },

  },
  mounted() {
    this.init();
    this.setUploaderOpts()
  },
  destroyed() {
    this.uploaderInstance.off('dragover')
    // this.uploaderInstance.off('dragenter')
    this.uploaderInstance.off('dragleave')
    this.uploaderInstance.off('uploadStart')
  },

  methods: {
    //   Init Funtion
    init() {
      this.getFileList(this.rootPath);
    },
    // Get Tree List
    getFileList(path) {
      this.$api.file.dirPath(path).then(res => {
        if (res.data.success == 200) {
          // console.log(res.data.data);
          this.currentPath = path
          this.currentPathName = path.split("/").pop()
          this.uploaderInstance.opts.query = {
            path: this.currentPath,
          }
          // this.uploaderInstance.bootstrap()
          this.$store.commit('changeCurrentPath', path)
          this.listData = orderBy(res.data.data, ['is_dir'], ['desc'])
        }
      })
    },
    setUploaderOpts() {
      this.uploaderInstance = this.$refs.uploader.uploader
      this.uploaderInstance.assignDrop(document.getElementById('dropTarget'));
      // Drag Over
      this.uploaderInstance.on('dragover', (event) => {
        this.isDragIn = true;
        if (this.timeout !== null) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.isDragIn = false;
          this.timeout = null;
          console.log(this.isDragIn);
        }, 120);

        event.stopPropagation();
        event.preventDefault();
      })

      this.uploaderInstance.on('uploadStart', () => {
        console.log("uploadStart");
        this.isDragIn = false;
        this.showUploadList = true;
        this.uploaderListHeaderText = "Uploading"

      })
      this.uploaderInstance.on('complete', () => {
        this.getFileList(this.currentPath)
        this.uploaderListHeaderText = "Complete"
      })
      this.uploaderInstance.on('fileProgress', (rootFile, file, chunk) => {
        console.log(rootFile, file, chunk);
      })

      console.log(this.uploaderInstance.opts);
    },
    closeUploaderList() {
      this.showUploadList = false
      this.uploaderInstance.cancel()
    },


    // Change View
    changeView() {
      this.isViewGird = !this.isViewGird
      this.uploaderInstance.assignDrop(document.getElementById('dropTarget'));
    },

    // Show Detail Modal
    showDetailModal(e) {
      this.$buefy.modal.open({
        parent: this,
        component: DetailModal,
        hasModalCard: true,
        customClass: 'detail-panel file-modal',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-out",
        props: {
          item: e,
        }
      })
    },

    // Show New Folder Modal
    showNewFolderModal() {
      this.$buefy.modal.open({
        parent: this,
        component: NewFolderModal,
        hasModalCard: true,
        customClass: 'new-folder-panel file-modal',
        trapFocus: true,
        canCancel: [''],
        scroll: "keep",
        animation: "zoom-out",
        props: {
          currentPath: this.currentPath
        },
        events: {
          'reload': () => {
            this.getFileList(this.currentPath)
          }
        }
      })
    },
    paste() {
      this.$api.file.operate(this.$store.state.operateObject.from, this.$store.state.currentPath, this.$store.state.operateObject.type).then(res => {
        if (res.data.success == 200) {
          this.$store.commit('changeOperateObject', null)
          this.getFileList(this.currentPath)
        } else {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-danger'
          })
        }
      })
    },



  },

}
</script>

<style>
</style>