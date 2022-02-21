<!--
 * @Author: JerryK
 * @Date: 2022-02-18 12:42:06
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-21 10:43:00
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\FilePanel.vue
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
            <b-input placeholder="Search in folder..." size="is-small" rounded></b-input>
          </div>
          <div class="is-flex is-align-items-center">
            <b-upload class="mr-3">
              <a class="button is-primary is-rounded is-small">
                <b-icon icon="upload" size="is-small"></b-icon>
                <span>{{ "Upload"}}</span>
              </a>
            </b-upload>

            <b-button icon-left="folder-plus-outline" size="is-small" label="New folder" @click="currentSlide = 1" rounded />

            <div class="is-flex is-align-items-center modal-close-container ">
              <button type="button" class="delete" @click="$emit('close')" />
            </div>

          </div>
        </header>
        <!-- Header End -->

      </div>

      <!-- Main Content End -->
    </section>
    <!-- Modal-Card Body End -->
  </div>
</template>

<script>
// import trimStart from 'lodash/trimStart'
// import dropRight from 'lodash/dropRight'
export default {
  data() {
    return {
      isDragIn: false,
      rootPath:"/DATA/"
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    //   Init Funtion
    init() {
      this.getFileList(this.rootPath);
    },
    // Get Tree List
    getFileList(path) {
      this.$api.file.dirPath(
          
      ).then(res => {
        if (res.data.success == 200) {
          console.log(res.data.data);
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