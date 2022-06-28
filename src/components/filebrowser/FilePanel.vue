<!--
 * @Author: JerryK
 * @Date: 2022-02-18 12:42:06
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-28 09:26:59
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\FilePanel.vue
-->
<template>
  <div class="modal-card">

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body is-flex">

      <!-- Viewer Start -->
      <transition name="c-zoom-in">
        <component :is="panelType" v-if="isShowDetial" @close="isShowDetial = false; isModalOpen = false" :item="currentItem" :list="listData" ref="previewPanel"></component>
      </transition>
      <!-- Viewer End -->

      <template>
        <!-- NavBar Start -->
        <div class="nav-bar">
          <h3 class="title is-3 mb-0 pb-3 has-text-left">{{ $t('Files') }}</h3>
          <div class="list-container scrollbars-light pt-0">
            <tree-list ref="navBar" :path="rootPath" :autoLoad="true"></tree-list>
          </div>
        </div>
        <!-- NavBar Start -->

        <!-- Main Content Start -->
        <div class="content is-flex-grow-1">
          <uploader ref="uploader" :options="options" class="uploader-example">
            <uploader-unsupport></uploader-unsupport>
            <!-- Header Start -->
            <header class="modal-card-head">
              <div class="is-flex-grow-1 is-flex breadcrumb-container" id="bread-container">
                <file-breadcrumb></file-breadcrumb>
                <!-- <b-input placeholder="Search in folder..." size="is-small" rounded></b-input> -->
              </div>
              <div class="is-flex is-align-items-center">

                <!-- Paste Button Start -->
                <b-button icon-left="content-paste" type="is-success" size="is-small" :label="$t('Paste')" class="mr-3" :loading="isPasting" @click="paste('overwrite')" v-if="hasPasteData" rounded />
                <!-- Paste Button End -->

                <!-- Operation Status Start-->
                <operation-status-bar></operation-status-bar>
                <!-- Operation Status End-->

                <!-- Upload Button Start -->
                <global-action-button @showNewFileModal="showNewFileModal" @showNewFolderModal="showNewFolderModal"></global-action-button>
                <!-- Upload Button End -->

                <!--  Close Button Start -->
                <div class="is-flex is-align-items-center modal-close-container modal-close-container-line ">
                  <button type="button" class="delete" @click="$emit('close')" />
                </div>
                <!--  Close Button End -->

              </div>
            </header>
            <!-- Header End -->

            <!-- Tool Bar Start -->
            <div class="tool-bar is-flex mb-2">
              <div class=" is-flex-grow-1 has-text-left is-flex  is-align-items-center">
                <b-field class="ml-3 is-flex is-size-14px mb-0">
                  <b-checkbox size="is-small" v-model="isSelectAll" :class="selectState" @input="handleSelect">{{selectLabel}}</b-checkbox>
                </b-field>
              </div>
              <div class="view-btns is-flex-shrink-0">
                <b-tooltip :label="$t('Change View')" position="is-left" type="is-dark">
                  <p role="button" class="is-clickable none-line-height" @click="changeView">
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

              <component :is="listView" v-model="listData" ref="listview" @showDetailModal="showDetailModal" @gotoFolder="getFileList" @reload="reload" @change="handelListChange" :isLoading="isLoading">
                <empty-holder @newFolder="showNewFolderModal" @newFile="showNewFileModal"></empty-holder>
              </component>

            </div>
            <!-- List View End -->

            <!-- Upload List Start-->
            <div class="upload-list" v-show="showUploadList">
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
          <!-- Toolbar Start -->
          <operation-toolbar v-model="isToolbarShow" @download="handleDownload" @copy="handleCopy" @move="handleMove" @remove="handleRemove" @close="handleClose"></operation-toolbar>
          <!-- Toolbar End -->
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
import RenameModal from './modals/RenameModal.vue';

import Uploader from './uploader/components/uploader.vue'
import UploaderUnsupport from './uploader/components/unsupport.vue'
import UploaderList from './uploader/components/list.vue'
import OperationToolbar from './components/OperationToolbar.vue';
import OperationStatusBar from './components/OperationStatusBar.vue';
import GlobalActionButton from './components/GlobalActionButton.vue';



export default {
  name: "file-panel",
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
    CodeEditor: () => import("./viewers/CodeEditor.vue"),
    VideoPlayer: () => import("./viewers/VideoPlayer.vue"),
    ImageViewer: () => import("./viewers/ImageViewer.vue"),
    EmptyHolder,
    OperationToolbar,
    RenameModal,
    OperationStatusBar,
    GlobalActionButton
  },
  data() {
    return {
      isLoading: true,
      isModalOpen: false,
      isDragIn: false,
      isPasting: false,
      isShowDetial: false,
      panelType: null,
      currentItem: null,
      rootPath: "/DATA",
      currentPath: "",
      currentPathName: "",
      isViewGird: true,
      listData: [],
      selectedArray: [],
      file: null,
      timeout: null,
      uploadPercentage: 0,
      hasPasteData: this.$store.state.operateObject != null,
      uploaderInstance: {},
      selectState: "none",
      isSelectAll: false,
      selectLabel: "",
      isToolbarShow: false,
      options: {
        target: this.getTargetUrl(),
        testChunks: true,
        uploadMethod: "POST",
        successStatuses: [200, 201, 202, 2002],
        allowDuplicateUploads: true,
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
    },
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
      this.paste('overwrite')
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
    /*************************************************
     * PART 0  Self
    **************************************************/

    /**
     * @description: Init Funtion
     * @return {*}
     */
    init() {
      this.getFileList(this.rootPath);
    },

    /**
     * @description: Get File Tree List
     * @param {String} path
     * @return {*}
     */
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
          const fileList = res.data.data
          const newFileList = fileList.map(item => {
            return {
              date: item.data,
              isSelected: false,
              is_dir: item.is_dir,
              name: item.name,
              path: item.path,
              size: item.size,
              write: item.write
            }
          })
          this.listData = orderBy(newFileList, ['is_dir'], ['desc'])
          this.handelListChange(this.listData)
        }
      })
    },

    /**
     * @description: Reload current folder
     * @return {*}
     */
    reload() {
      this.getFileList(this.currentPath);
    },

    /**
     * @description: Change View List/Gird
     * @return {*}
     */
    changeView() {
      this.isViewGird = !this.$store.state.isViewGird
      this.$store.commit('changeViewGird', this.isViewGird)
    },

    /**
     * @description: Handle Select All Action
     * @param {*} bool
     * @return {*}
     */
    handleSelect(bool) {
      if (bool) {
        this.listData.forEach((item, index) => {
          item.isSelected = true
          this.$refs.listview.selectList.push(index)
        })
      } else {
        this.listData.forEach(item => {
          item.isSelected = false
        })
        this.$refs.listview.selectList = []
      }
      this.handelListChange(this.listData)
    },


    /**
     * @description: Handle List data change (Selected State)
     * @param {*} list
     * @return {*}
     */
    handelListChange(list) {
      this.selectedArray = list.filter(item => {
        return item.isSelected
      })
      if (this.selectedArray.length == list.length && list.length > 0) {
        this.selectState = "all"
        this.isSelectAll = true
        this.selectLabel = this.$t("select-items", { num: list.length })
        this.isToolbarShow = true
      } else if (this.selectedArray.length < list.length && this.selectedArray.length > 0) {
        this.selectState = "part"
        this.isSelectAll = false
        this.selectLabel = this.$t("select-items", { num: this.selectedArray.length })
        this.isToolbarShow = true
      } else {
        this.selectState = "none"
        this.isSelectAll = false
        this.selectLabel = this.$t("total-items", { num: list.length })
        this.isToolbarShow = false
      }
    },

    /**
     * @description: Handle Backspace Event Back to upper level
     * @return {*}
     */
    backLevel() {
      if (this.isModalOpen) return false
      let pathArr = this.$store.state.currentPath.substr(1).split("/")
      if (pathArr.length == 1) {
        return false
      }
      let newPath = "/" + dropRight(pathArr).join("/")
      this.getFileList(newPath)
    },

    /**
     * @description: Paste Files
     * @return {*}
     */
    paste(style = "overwrite") {
      this.isPasting = true
      let operateObject = this.$store.state.operateObject
      operateObject.to = this.$store.state.currentPath
      operateObject.style = style

      this.$api.file.operate(operateObject).then(res => {
        this.isPasting = false
        if (res.data.success == 200) {
          this.$store.commit('changeOperateObject', null)
        } else {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-danger'
          })
        }
      })
    },

    /**
     * @description: Hide Context Menu
     * @return {*}
     */
    hideContextMenu() {
      if (this.$refs.moreBtn) {
        this.$refs.moreBtn.isActive = false
      }
    },

    /*************************************************
     * PART 1  Uploader
    **************************************************/

    /**
     * @description: Get Uploader Target URL
     * @return {*}
     */
    getTargetUrl() {
      return `http://${this.$baseURL}/v1/file/upload?token=${this.$store.state.token}`
    },

    /**
     * @description: Set Uploader Options
     * @return {*}
     */
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
    },

    /**
     * @description: Close Uploader List 
     * @return {*}
     */
    closeUploaderList() {
      this.showUploadList = false
      this.uploaderInstance.cancel()
    },


    /**
     * @description: Assig nUpload Buttons
     * @return {*}
     */
    assignUploadButtons() {
      this.uploaderInstance.assignDrop(document.getElementById('dropTarget'));

    },

    /*************************************************
     * PART 2  Modals
    **************************************************/

    /**
     * @description: Show Detail Modal
     * @param {Object} item
     * @return {*}
     */
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

    /**
     * @description: Show New Folder Modal
     * @return {*}
     */
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

    /**
     * @description: Show New File Modal
     * @return {*}
     */
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

    /**
     * @description: Show Rename Modal
     * @param {Object} item
     * @return {*}
     */
    showRenameModal(item) {
      this.isModalOpen = true
      this.$buefy.modal.open({
        parent: this,
        component: RenameModal,
        hasModalCard: true,
        customClass: 'rename-panel file-modal',
        trapFocus: true,
        canCancel: [''],
        scroll: "keep",
        animation: "zoom-in",
        events: {
          'reload': () => {
            this.reload()
          },
          'close': () => {
            this.isModalOpen = false
          }
        },
        props: {
          item: item
        }
      })
    },

    /*************************************************
     * PART 3  Toolbar Action
    **************************************************/

    /**
     * @description: handle Toolbar Close
     * @return {*}
     */
    handleClose() {
      this.isSelectAll = false
      this.handleSelect(this.isSelectAll)
    },

    /**
     * @description: handle Toolbar Remove
     * @return {*}
     */
    handleRemove() {
      this.$buefy.dialog.confirm({
        title: this.$t('Deleting files'),
        message: this.$t('Are you sure you want to <b>delete</b> these files? This action cannot be undone.'),
        confirmText: this.$t('Delete'),
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.deleteItem(this.selectedArray)
          this.handleClose()
        }
      })
    },

    /**
     * @description: Handle Toolbar Move
     * @return {*}
     */
    handleMove() {
      this.operate('move', this.selectedArray)
      this.handleClose()
    },

    /**
     * @description: Handle Toolbar copy
     * @return {*}
     */
    handleCopy() {
      this.operate('copy', this.selectedArray)
      this.handleClose()
    },

    /**
     * @description: handle Toolbar Download
     * @return {*}
     */
    handleDownload() {
      const downItem = (this.selectedArray.length == 1) ? this.selectedArray[0] : this.selectedArray
      this.downloadFile(downItem)
      this.handleClose()
    }
  },
  sockets: {
    file_operate(data) {
      const taskList = data.body.file_operate.data
      taskList.forEach(task => {
        if (task.finished && task.to === this.currentPath) {
          this.reload()
        }
      })
    }
  }

}
</script>