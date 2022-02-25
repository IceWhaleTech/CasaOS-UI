<!--
 * @Author: JerryK
 * @Date: 2022-02-18 12:42:06
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-25 18:29:35
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
          dsa
        </div>
      </div>
      <!-- NavBar Start -->

      <!-- Main Content Start -->

      <div class="content flex1" @dragover="dragover" @dragleave="dragleave" @drop="drop">
        <!-- Drag and Drop Mask Start -->
        <div class="drag-mask" v-if="isDragIn"></div>
        <!-- Drag and Drop Mask End -->
        <!-- Header Start -->
        <header class="modal-card-head">
          <div class="flex1 is-flex ">
            <!-- <b-input placeholder="Search in folder..." size="is-small" rounded></b-input> -->
          </div>
          <div class="is-flex is-align-items-center">
            <b-upload class="mr-3">
              <a class="button is-primary is-rounded is-small">
                <b-icon icon="upload" size="is-small"></b-icon>
                <span>{{ "Upload"}}</span>
              </a>
            </b-upload>

            <b-button icon-left="folder-plus-outline" size="is-small" label="New folder" @click="showNewFolderModal" rounded />

            <div class="is-flex is-align-items-center modal-close-container ">
              <button type="button" class="delete" @click="$emit('close')" />
            </div>

          </div>
        </header>
        <!-- Header End -->

        <!-- Tool Bar Start -->
        <div class="tool-bar is-flex" >
          <div class="flex1">My Space</div>
          <div class="view-btns">
            <b-tooltip label="Change View" position="is-left" type="is-dark">
              <p role="button" class="is-clickable" @click="changeView">
                <b-icon :icon="viewIcon"></b-icon>
              </p>
            </b-tooltip>
          </div>
        </div>
        <!-- Tool Bar End -->

        <!-- List View Start -->
        <component :is="listView" v-model="listData" @showDetailModal="showDetailModal" @gotoFolder="getFileList" @reload="getFileList(currentPath)"></component>
        
        <!-- List View End -->

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

export default {
  mixins: [mixin],
  data() {
    return {
      isDragIn: false,
      rootPath: "/DATA",
      currentPath: "",
      isViewGird: true,
      listData: [],
    }
  },
  components: {
    ListView,
    GirdView,
  },
  computed: {
    viewIcon() {
      return this.isViewGird ? "view-grid-outline" : "format-list-bulleted"
    },
    listView() {
      return this.isViewGird ? "gird-view" : "list-view"
    }
  },
  mounted() {
    this.init();
  },

  methods: {
    //   Init Funtion
    init() {
      this.currentPath = this.rootPath
      this.getFileList(this.currentPath);
    },
    // Get Tree List
    getFileList(path) {
      this.$api.file.dirPath(path).then(res => {
        if (res.data.success == 200) {
          console.log(res.data.data);
          this.listData = orderBy(res.data.data, ['is_dir'], ['desc'])
        }
      })
    },

    // Change View
    changeView() {
      this.isViewGird = !this.isViewGird
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


    //   Drag and Dorp Upload
    dragover(event) {
      event.preventDefault();
      this.isDragIn = true
    },
    dragleave() {
      this.isDragIn = false
    },
    drop(event) {
      event.preventDefault();
      console.log("drop");
    }
  },

}
</script>

<style>
</style>