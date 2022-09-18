<!--
 * @Author: JerryK
 * @Date: 2022-02-25 14:26:30
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-20 23:30:34
 * @Description:
 * @FilePath: /CasaOS-UI/src/components/filebrowser/modals/NewFolderModal.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{ $t('New Folder') }}</h3>
      </div>
      <div>
        <button class="delete" type="button" @click="$emit('close')"/>
      </div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class="cover">
          <div class="folder-cover">
            <img :src="require('@/assets/img/filebrowser/folder-default.svg')" alt="folder" class="folder-icon"/>
          </div>
        </div>
        <b-field :message="errors" :type="errorType" class="mb-3 mt-5 has-text-light" expanded>
          <b-input v-model="folderName" v-on:keyup.enter.native="createFolder"
                   @input.native="folderName = folderName.replace(/\//g,'')"></b-input>
        </b-field>
        <div class="notification pl-4 pri-height">
          <b-field>
            <b-checkbox v-model="shortcut"
                        type="is-info">
              {{ $t('Add a shortcut') }}
            </b-checkbox>
          </b-field>
          <b-field>
            <b-checkbox v-model="shared"
                        type="is-info">
              {{ $t('Shared') }}
            </b-checkbox>
          </b-field>
        </div>

      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Submit')" :loading="isloading" expaned rounded type="is-primary" @click="createFolder"/>
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import {mixin} from '@/mixins/mixin';
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
      errors: "",
      shortcut: true,
      shared: false,
      isloading: false,
    }
  },
  methods: {

    async createFolder() {
      this.isloading = true
      console.log(this)

      // shortcut
      // src/components/filebrowser/components/ActionButton.vue:121
      let newPath = path.join(this.currentPath, this.folderName)

      this.$api.folder.create(newPath).then(async (res) => {
        if (res.data.success == 200) {
          try {
            if (this.shortcut) {
              // get shortcut detail
              // let shortcut = await this.$api.users.getShutcutDetail().then(v => v.data.data);
              // let shortcut = await this.$store.dispatch('SET_SHORTCUT_DATA').then(v => v.data.data);
              let shortcut = this.$store.state['shortcutData'];
              // shortcut data preprocess
              if (!shortcut) {
                shortcut = []
              }
              // add new shortcut
              shortcut.push({
                name: this.folderName,
                path: newPath,
                type: 'folder'
              })
              // save shortcut
              // await this.$api.users.saveShutcutDetail(shortcut);
              // LURK BUG: shortcut data not update
              await this.$store.dispatch('SET_SHORTCUT_DATA', shortcut);
            }

            if (this.shared) {
              // set shared data
              const data = [{
                path: newPath,
                anonymous: true
              }]
              // save shared data
              await this.$api.samba.createShare(data)
            }
          } catch (e) {
            console.log(e)
          }
          this.$emit("reload")
          this.$emit("close")
        } else {
          this.errorType = "is-danger"
          this.errors = res.data.message
        }
        this.isloading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // TODO refresh file list
    // reload() {
    //   this.$EventBus.$on(events.RELOAD_FILE_LIST, this.getNewList);
    // }
  },

}
</script>

<style lang="scss">
//$background: hsl(0, 0%, 97%);
//$notification-background-color: $background;
.pri-height {
  height: 5.625rem;
}
</style>
