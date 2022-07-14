<!--
 * @Author: JerryK
 * @Date: 2022-02-25 14:26:30
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 12:14:38
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\modals\NewFolderModal.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{$t('New Folder')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class="cover">
          <div class="folder-cover">
            <img alt="folder" :src="require('@/assets/img/filebrowser/folder-default.svg')" class="folder-icon" />
          </div>
        </div>
        <b-field class="mb-3 mt-5 has-text-light" :type="errorType" :message="errors" expanded>
          <b-input v-model="folderName" v-on:keyup.enter.native="createFolder" @input.native="folderName = folderName.replace(/\//g,'')"></b-input>
        </b-field>
      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Submit')" type="is-primary" rounded expaned @click="createFolder" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import path from 'path'
export default {
  mixins: [mixin],
  props: {
    currentPath: String
  },
  data() {
    return {
      folderName: 'New Folder',
      errorType: "is-success",
      errors: ""
    }
  },
  methods: {

    createFolder() {
      let newPath = path.join(this.currentPath, this.folderName)
      this.$api.folder.create(newPath).then(res => {
        if (res.data.success == 200) {
          this.$emit("reload")
          this.$emit("close")
        } else {
          this.errorType = "is-danger"
          this.errors = res.data.message
        }
      })
    }
  },

}
</script>

<style>
</style>