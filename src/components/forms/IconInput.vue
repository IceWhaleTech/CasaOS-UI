<template>
  <b-input :placeholder="placeholder" v-model="path" expanded @input="handleInput" icon-right="image-filter-center-focus-strong" icon-right-clickable @icon-right-click="selectFile"></b-input>
  <!-- <b-input :placeholder="placeholder" v-model="path" expanded @input="handleInput"></b-input> -->
</template>

<script>
import FilePanel from '../fileList/FilePanel.vue'
const DATA_PATH = "/DATA"
const DEV_PATH = "/dev"
export default {
  name: "iconInput",
  props: {
    vdata: String,
    type: String,
    placeholder: String
  },
  model: {
    prop: 'vdata',
    event: 'change'
  },
  data() {
    return {
      path: this.vdata
    }
  },

  computed: {

    initPath() {
      if (this.type == "device") {
        return (this.path == "") ? DEV_PATH : this.path
      } else {
        return (this.path == "") ? DATA_PATH : this.path
      }
    },
    rootPath() {
      if (this.type == "device") {
        return DEV_PATH
      } else {
        return DATA_PATH
      }
    }
  },
  watch: {
    vdata(val) {
      this.path = val
    }
  },
  methods: {
    handleInput() {
      this.$emit('change', this.path)
      this.$emit('input', this.path)
    },
    selectFile() {
      this.showFileModal();
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
            this.path = e
            this.$emit('change', this.path)
            this.$emit('input', this.path)
          }
        },
        props: {
          initPath: this.initPath,
          rootPath: this.rootPath
        }
      })
    }
  },
}
</script>

<style>
</style>