<!--
 * @Author: JerryK
 * @Date: 2022-02-18 12:42:06
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-10 14:42:25
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\FilePanel.vue
-->
<template>
  <div class="modal-card">

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body is-flex">

      <transition name="c-zoom-in">
        <component :is="panelType" v-if="isShowDetial" @close="isShowDetial = false; isModalOpen = false" :item="currentItem" ref="previewPanel"></component>
      </transition>
      <template>
        <!-- NavBar Start -->
        <div class="nav-bar">
          <h2 class="title is-4 mb-0 pb-3">{{ $t('Files') }}</h2>
          <div class="list-container scrollbars-light pt-0">
            <tree-list ref="navBar" :path="rootPath" :autoLoad="true"></tree-list>
          </div>
        </div>
        <!-- NavBar Start -->

        <!-- Main Content Start -->
        <div class="content flex1">
          <uploader ref="uploader" :options="options" class="uploader-example">
            <uploader-unsupport></uploader-unsupport>
            <!-- Header Start -->
            <header class="modal-card-head">
              <div class="flex1 is-flex ">
                <!-- <b-input placeholder="Search in folder..." size="is-small" rounded></b-input> -->
              </div>
              <div class="is-flex is-align-items-center">

                <!-- Paste Button Start -->
                <transition name="fade">
                  <b-button icon-left="content-paste" type="is-success" size="is-small" :label="$t('Paste')" class="mr-3" @click.once="paste" v-if="hasPasteData" rounded />
                </transition>
                <!-- Paste Button End -->

                <!-- Upload Button Start -->
                <div class="action-btn">
                  <b-dropdown aria-role="list" ref="moreBtn" :triggers="['click','context']" class="file-dropdown" position="is-bottom-left" animation="fade1" :mobile-modal="false" append-to-body close-on-click>
                    <template #trigger>
                      <b-button icon-left="book-arrow-up" size="is-small" type="is-primary" :label="$t('Upload or Create')" class="mr-2" rounded />

                    </template>
                    <b-dropdown-item id="upfile-btn" aria-role="menuitem" class="is-flex is-align-items-center">
                      <b-icon icon="file-upload-outline" class="mr-1" custom-size="mdi-18px"></b-icon>
                      {{ $t('Upload Files') }}
                    </b-dropdown-item>
                    <b-dropdown-item id="upfolder-btn" aria-role="menuitem" class="is-flex is-align-items-center">
                      <b-icon icon="folder-upload-outline" class="mr-1" custom-size="mdi-18px"></b-icon>
                      {{ $t('Upload Folder') }}
                    </b-dropdown-item>
                    <hr class="dropdown-divider">
                    <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" @click="showNewFileModal">
                      <b-icon icon="file-plus-outline" class="mr-1" custom-size="mdi-18px"></b-icon>
                      {{ $t('New File') }}
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="menuitem" class="is-flex is-align-items-center" @click="showNewFolderModal">
                      <b-icon icon="folder-plus-outline" class="mr-1" custom-size="mdi-18px"></b-icon>
                      {{ $t('New Folder') }}
                    </b-dropdown-item>

                  </b-dropdown>
                </div>

                <div class="is-flex is-align-items-center modal-close-container modal-close-container-line ">
                  <button type="button" class="delete" @click="$emit('close')" />
                </div>

              </div>
            </header>
            <!-- Header End -->

            <!-- Tool Bar Start -->
            <div class="tool-bar is-flex">
              <div class="breadcrumb-container  flex1" id="bread-container">
                <file-breadcrumb></file-breadcrumb>
              </div>
              <div class="view-btns is-flex-shrink-0">
                <b-tooltip :label="$t('Change View')" position="is-left" type="is-dark">
                  <p role="button" class="is-clickable" @click="changeView">
                    <b-icon :icon="viewIcon"></b-icon>
                  </p>
                </b-tooltip>
              </div>
            </div>
            <!-- Tool Bar End -->

            <!-- List View Start -->
            <div id="dropTarget">

              <!-- Drag and Drop Mask Start -->
              <div class="drag-mask is-flex is-align-items-flex-end is-flex-direction-row" v-if="isDragIn">
                <div class="mb-6">
                  <div class="upload-icon">
                    <b-icon icon="arrow-up" size="is-medium" type="is-white"></b-icon>
                  </div>
                  <p class="has-text-primary">
                    {{ $t('Upload to') }} {{currentPathName}}
                  </p>
                </div>
              </div>
              <!-- Drag and Drop Mask End -->

              <component :is="listView" v-model="listData" @showDetailModal="showDetailModal" @gotoFolder="getFileList" @reload="reload" :isLoading="isLoading">
                <empty-holder @newFolder="showNewFolderModal" @newFile="showNewFileModal"></empty-holder>
              </component>

            </div>
            <!-- List View End -->

            <!-- Upload List Start-->
            <div class="upload-list" v-if="showUploadList">
              <b-collapse class="card" ref="uploadList" animation="slide1" aria-id="contentIdForA11y3">
                <template #trigger="props">
                  <div class="card-header" role="button" aria-controls="contentIdForA11y3" :aria-expanded="props.open">
                    <p class="card-header-title">
                      <b-icon :icon="props.open?'chevron-down':'chevron-up'" class="mr-2"></b-icon>
                      {{ $t(uploaderListHeaderText) }}
                    </p>
                    <a class="card-header-icon" @click.prevent="closeUploaderList">
                      <b-icon icon="close"></b-icon>
                    </a>
                  </div>
                </template>

                <div class="card-content scrollbars-light">
                  <div class="content">
                    <uploader-list></uploader-list>
                  </div>
                </div>

              </b-collapse>
            </div>
            <!-- Upload List End-->

          </uploader>
        </div>
      </template>
      <!-- Main Content End -->
    </section>
    <!-- Modal-Card Body End -->
  </div>
</template>

<script>

import orderBy from 'lodash/orderBy'
import dropRight from 'lodash/dropRight'

import { mixin } from '@/mixins/mixin';

import TreeList from './sidebar/TreeList.vue';

import GirdView from './components/GirdView.vue';
import ListView from './components/ListView.vue';
import FileBreadcrumb from './components/FileBreadcrumb.vue';
import EmptyHolder from './components/EmptyHolder.vue';

import DetailModal from './modals/DetailModal.vue'
import NewFolderModal from './modals/NewFolderModal.vue'
import NewFileModal from './modals/NewFileModal.vue'


import VideoPlayer from './viewers/VideoPlayer.vue'
import CodeEditor from './viewers/CodeEditor.vue';
import ImageViewer from './viewers/ImageViewer.vue';
import PdfViewer from './viewers/PdfViewer.vue';

import Uploader from './uploader/components/uploader.vue'
import UploaderUnsupport from './uploader/components/unsupport.vue'
import UploaderList from './uploader/components/list.vue'



export default {
  mixins: [mixin],
  provide() {
    return {
      filePanel: this
    }
  },
  components: {
    ListView,
    GirdView,
    FileBreadcrumb,
    TreeList,
    Uploader,
    UploaderUnsupport,
    UploaderList,
    CodeEditor,
    VideoPlayer,
    ImageViewer,
    PdfViewer,
    EmptyHolder
  },
  data() {
    return {
      isLoading: true,
      isModalOpen: false,
      isDragIn: false,
      isShowDetial: false,
      panelType: null,
      currentItem: null,
      rootPath: "/",
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
        target: this.getTargetUrl(),
        testChunks: true,
        uploadMethod: "POST",
        successStatuses: [200, 201, 202, 2002],
        // chunkSize: 1024 * 1024 * 1024 * 1024
      },
      attrs: {
        accept: '*'
      },
      // Uploader List
      showUploadList: false,
      uploaderListHeaderText: "Uploading"
    }
  },

  computed: {
    viewIcon() {
      return this.$store.state.isViewGird ? "view-grid-outline" : "format-list-bulleted"
    },
    listView() {
      return this.$store.state.isViewGird ? "gird-view" : "list-view"
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
    this.setUploaderOpts();
    document.addEventListener('contextmenu', this.hideContextMenu);
    // Listen to ESC button to exit preview
    document.onkeyup = (e) => {

      switch (e.code) {
        case 'Escape':
          if (this.isShowDetial) {
            this.$refs.previewPanel.close();
          } else {
            this.$emit('close')
          }
          break;
        case 'Backspace':
          this.backLevel()
          break;

        default:
          break;
      }
    }
    // paste
    document.onpaste = () => {
      this.paste()
    }

  },
  destroyed() {
    this.uploaderInstance.off('dragover')
    this.uploaderInstance.off('uploadStart')
    document.removeEventListener('contextmenu', this.hideContextMenu)
    this.$store.commit('changeOperateObject', null)
    document.onpaste = null;
    document.onkeyup = null;
  },

  methods: {
    //   Init Funtion
    init() {
      this.getFileList(this.rootPath);
    },
    // Get Tree List
    getFileList(path) {
      this.isLoading = true;
      // path = path.replace("//", "/")
      this.$api.file.dirPath(path).then(res => {
        if (res.data.success == 200) {
          this.isLoading = false;
          this.currentPath = path
          this.currentPathName = path.split("/").pop()
          this.uploaderInstance.opts.query = {
            path: this.currentPath,
          }
          this.$store.commit('changeCurrentPath', path)
          this.listData = orderBy(res.data.data, ['is_dir'], ['desc'])
        }
      })
    },

    // Reload current folder
    reload() {
      this.getFileList(this.currentPath);
      this.$refs.navBar.getDirList();
    },
    // Change View
    changeView() {
      this.isViewGird = !this.$store.state.isViewGird
      this.$store.commit('changeViewGird', this.isViewGird)
    },
    backLevel() {
      if (this.isModalOpen) return false
      let pathArr = this.$store.state.currentPath.substr(1).split("/")
      if (pathArr.length == 1) {
        return false
      }
      let newPath = "/" + dropRight(pathArr).join("/")
      this.getFileList(newPath)
    },
    setUploaderOpts() {
      this.uploaderInstance = this.$refs.uploader.uploader
      this.assignUploadButtons();
      // Drag Over
      this.uploaderInstance.on('dragover', (event) => {
        this.isDragIn = true;
        if (this.timeout !== null) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.isDragIn = false;
          this.timeout = null;
        }, 120);
        event.stopPropagation();
        event.preventDefault();
      })

      this.uploaderInstance.on('uploadStart', () => {
        this.isDragIn = false;
        this.showUploadList = true;
        this.uploaderListHeaderText = "Uploading"
      })

      this.uploaderInstance.on('complete', () => {
        this.getFileList(this.currentPath)
        this.uploaderListHeaderText = "Completed"

      })

      // this.uploaderInstance.on('catchAll', (evt,a,b,c) => {
      //   console.log(evt,a,b,c);

      // })
    },
    closeUploaderList() {
      this.showUploadList = false
      this.uploaderInstance.cancel()
    },
    assignUploadButtons() {
      this.uploaderInstance.assignDrop(document.getElementById('dropTarget'));
      this.uploaderInstance.assignBrowse(document.getElementById('upfile-btn'));
      this.uploaderInstance.assignBrowse(document.getElementById('upfolder-btn'), true);
    },

    // Show Detail Modal
    showDetailModal(item) {
      this.isModalOpen = true
      this.panelType = this.getPanelType(item)
      if (this.panelType !== null) {
        this.currentItem = item
        this.isShowDetial = true
      } else {
        this.$buefy.modal.open({
          parent: this,
          component: DetailModal,
          hasModalCard: true,
          customClass: 'detail-panel file-modal',
          trapFocus: true,
          canCancel: ['escape'],
          scroll: "keep",
          animation: "zoom-in",
          props: {
            item: item,
          },
          events: {
            'close': () => {
              this.isModalOpen = false
            }
          }
        })
      }
    },

    // Show New Folder Modal
    showNewFolderModal() {
      this.isModalOpen = true
      this.$buefy.modal.open({
        parent: this,
        component: NewFolderModal,
        hasModalCard: true,
        customClass: 'new-folder-panel file-modal',
        trapFocus: true,
        canCancel: [''],
        scroll: "keep",
        animation: "zoom-in",
        props: {
          currentPath: this.currentPath
        },
        events: {
          'reload': () => {
            this.reload();
          },
          'close': () => {
            this.isModalOpen = false
          }
        }
      })
    },

    // Show New File Modal
    showNewFileModal() {
      this.isModalOpen = true
      this.$buefy.modal.open({
        parent: this,
        component: NewFileModal,
        hasModalCard: true,
        customClass: 'new-folder-panel file-modal',
        trapFocus: true,
        canCancel: [''],
        scroll: "keep",
        animation: "zoom-in",
        props: {
          currentPath: this.currentPath
        },
        events: {
          'reload': () => {

            this.reload()
          },
          'close': () => {
            this.isModalOpen = false
          }
        }
      })
    },

    paste() {
      let form = this.$store.state.operateObject.from
      let to = this.$store.state.currentPath
      let type = this.$store.state.operateObject.type
      this.$api.file.operate(form, to, type).then(res => {
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

    hideContextMenu() {
      this.$refs.moreBtn.isActive = false
    },
    getTargetUrl() {
      if (process.env.NODE_ENV === "'dev'") {
        return `http://${this.$store.state.devIp}:${this.$store.state.devPort}/v1/file/upload?token=${this.$store.state.token}`
      } else {
        return `http://${document.location.host}/v1/file/upload?token=${this.$store.state.token}`
      }
    }
  },


}
</script>