<!--
 * @Author: JerryK
 * @Date: 2021-10-14 16:39:02
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-18 14:56:11
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/fileList/ListItem.vue
-->
<template>
  <li class="ficon" :class="[icon,{active:state}]" @click="activeSelf" @dblclick="expandDir">{{name}}</li>
</template>

<script>
export default {
  name: "list-item",
  data() {
    return {
      isActive: this.state
    }
  },
  props: {
    name: String,
    path: String,
    state: Boolean,
    IsDir: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    icon() {
      if (this.IsDir) {
        return "folder"
      } else {
        return "file"
      }
    }
  },
  methods: {
    activeSelf() {
      this.isActive = true;
      this.$emit("active", this.path)
    },
    expandDir() {
      if (this.IsDir) {
        this.$emit("expand", this.path)
      }
    }
  },

}
</script>

<style>
</style>