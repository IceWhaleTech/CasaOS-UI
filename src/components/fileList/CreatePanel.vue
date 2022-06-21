<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2021-10-27 15:44:17
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-21 11:29:39
 * @FilePath: \CasaOS-UI\src\components\fileList\CreatePanel.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-4 has-text-weight-normal">{{title}}</h3>
      </div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body">
      <b-field label="Name" :type="errorType" :message="message">
        <b-input v-model="name" maxlength="255"  expanded></b-input>
      </b-field>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button label="Cancel" type="is-grey" @click="$emit('close')" rounded />
        <b-button label="Submit" type="is-dark" @click="create()" rounded />
      </div>
    </footer>
    <!-- Modal-Card Footer End-->
  </div>
</template>

<script>
export default {

  props: {
    initPath: String,
    isDir: Boolean,
  },
  data() {
    return {
      name: "",
      message: "",
      errorType: ""
    }
  },

  computed: {
    title() {
      return this.isDir ? "Create Folder" : "Create File";
    }
  },
  methods: {
    create() {
      let path = `${this.initPath}/${this.name}`
      if (this.isDir) {
        this.$api.file.mkdir(path).then(res => {
          if (res.data.success == 200) {
            this.successCallBack(path);
          } else {
            this.errorCallBack(res.data.message);
          }
        })
      } else {
        this.$api.file.create(path).then(res => {
          if (res.data.success == 200) {
            this.successCallBack(path);
          } else {
            this.errorType = "is-danger"
            this.errorCallBack(res.data.message);
          }
        })
      }
    },
    successCallBack(path) {
      this.message = ""
      this.errorType = ""
      this.$emit('close');
      this.$emit("reloadPath",path)
    },
    errorCallBack(message) {
      this.errorType = "is-danger"
      this.message = message
    },
    btKeyUp(e){
        console.log(e);
    }
  },
}
</script>
