<!--
 * @Author: JerryK
 * @Date: 2022-03-11 22:13:30
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-11 22:13:30
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\AcquaintanceShare\modals\DownloadModal.vue
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="flex1">
        <h3 class="title is-4 has-text-weight-normal">{{$t('Download')}}</h3>
      </div>
      <div><button type="button" class="delete" @click="$emit('close')" /></div>
    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <div class="node-card">
        <div class="is-flex is-flex-grow-1 is-align-items-center mb-4">
          <div class="cover is-unselectable download-cover">
            <div :class="item | coverType" class="is-flex is-align-items-center">
              <i18n path="Download to" tag="div" class="is-flex is-align-items-center one-line">
                <template v-slot:file>
                  <img alt="folder" :src="getIconFile(item)" :class="item | iconType" />{{item.name}}
                </template>
              </i18n>
            </div>
          </div>
        </div>
        <b-field class="mb-3 mt-3 has-text-light" :label="$t('Download path')" :type="errorType" :message="errors" grouped expanded>
          <b-input v-model="savePath" v-on:keyup.enter.native="download" expanded></b-input>
          <p class="control">
            <b-button type="is-ghost" :label="$t('Change')" @click="showFileModal" />
          </p>
        </b-field>
      </div>

    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="flex1">
        <b-field>
          <b-radio size="is-small" v-model="isDefault" :native-value="true">
            {{ $t('Set as default download path') }}
          </b-radio>
        </b-field>
      </div>
      <div>
        <b-button :label="$t('Download')" type="is-primary" rounded expaned @click="download" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import FilePanel from '@/components/fileList/FilePanel.vue'
const DATA_PATH = "/DATA"
export default {
  mixins: [mixin],
  data() {
    return {
      savePath: "",
      initPath: "",
      errorType: "is-success",
      errors: "",
      isDefault: false,
      rootPath: DATA_PATH
    }
  },
  components: {

  },

  watch: {
    savePath(val) {
      console.log("dpath", val);
      this.isDefault = val == this.initPath ? true : false
    }
  },
  props: {
    user: {},
    item: {}
  },
  created() {
    this.getSavePath()
  },
  methods: {
    getFileIcon(item) {
      return "<img alt='folder' src='" + this.getIconFile(item) + "'/>" + item.name
    },
    download() {
      this.updateSavePath()
      this.$api.person.downloadFile(this.user.token, this.item.path, this.savePath, this.item.name).then(res => {
        let message = ""
        let type = ""
        if (res.data.success == 200) {
          message = this.$t('Download has started')
          type = "is-success"
          this.$emit("update")
          this.$emit("close")
        } else {
          message = this.$t('Download failed')
          type = "is-danger"
        }
        this.$buefy.toast.open({
          message: message,
          type: type
        })
      })

    },

    showFileModal() {
      this.$buefy.modal.open({
        parent: this,
        component: FilePanel,
        hasModalCard: true,
        customClass: 'fileModal',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-in",
        events: {
          'updatePath': (e) => {
            this.savePath = e
          }
        },
        props: {
          initPath: this.savePath,
          rootPath: this.rootPath,
          showFile: false
        }
      })
    },

    getSavePath() {
      this.$api.person.getSavePath().then(res => {
        if (res.data.success == 200) {
          this.savePath = res.data.data
          this.initPath = res.data.data
        }
      })
    },
    updateSavePath() {
      if (!this.isDefault) return false
      this.$api.person.updateSavePath(this.savePath)
    }


  },
}
</script>

<style>
</style>