<template>
  <!-- <b-input :placeholder="placeholder" v-model="path" expanded @input="handleInput" icon-right="image-filter-center-focus-strong" icon-right-clickable @icon-right-click="selectFile"></b-input> -->
  <b-input :placeholder="placeholder" v-model="path" expanded @input="handleInput"></b-input>
</template>

<script>
import FilePanel from '../fileList/FilePanel.vue'
export default {
  name: "iconinput",
  props: {
    vdata: String,
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
  methods: {
    handleInput() {
      this.$emit('change', this.vdata)
      this.$emit('input', this.vdata)
    },
    selectFile() {
      this.showFileModal();
    },
    showFileModal() {
      this.$buefy.modal.open({
        parent: this,
        component: FilePanel,
        hasModalCard: true,
        customClass: '',
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
          initPath: this.path
        }
      })
    }
  },
}
</script>

<style>
</style>