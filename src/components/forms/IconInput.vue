<template>
  <b-input :placeholder="placeholder" v-model="path" expanded @input="handleInput" icon-right="image-filter-center-focus-strong" icon-right-clickable @icon-right-click="selectFile"></b-input>
  <!-- <b-input :placeholder="placeholder" v-model="path" expanded @input="handleInput"></b-input> -->
</template>

<script>
import FilePanel from '../fileList/FilePanel.vue'
export default {
  name: "iconinput",
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
        console.log(this.path);
        return (this.path == "") ? "/dev/" : this.path
      } else {
        return (this.path == "") ? "/DATA/" : this.path
      }
    },
    rootPath() {
      if (this.type == "device") {
        return "/dev/"
      } else {
        return "/DATA/"
      }
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
        animation: "zoom-out",
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