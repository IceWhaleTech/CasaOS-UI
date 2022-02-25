<!--
 * @Author: JerryK
 * @Date: 2022-02-25 11:03:08
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-25 15:35:21
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/filebrowser/RenameModal.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">{{$t('Rename')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class="cover">
          <div :class="item | coverType">
            <img alt="folder" :src="getIconFile(item)" :class="item | iconType" />
          </div>
        </div>
        <b-field class="mb-3 mt-5 has-text-light" :type="errorType" :message="errors" expanded>
          <b-input v-model="fileName" v-on:keyup.enter.native="saveNewName" @input.native="fileName = fileName.replace(/\//g,'')"></b-input>
        </b-field>
      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1"></div>
      <div>
        <b-button :label="$t('Submit')" type="is-primary" rounded expaned @click="saveNewName" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  props: {
    item: Object
  },
  data() {
    return {
      fileName: this.item.name,
      errorType: "is-success",
      errors: ""
    }
  },
  methods: {

    saveNewName() {
      let newPath = this.item.path.replace(this.item.name, this.fileName);
      if (this.item.name === this.fileName) {
        this.$emit("close")
        return false
      }
      this.$api.file.renamePath(this.item.path, newPath).then(res => {
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