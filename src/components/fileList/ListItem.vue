<!--
 * @Author: JerryK
 * @Date: 2021-10-14 16:39:02
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-18 14:56:11
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/fileList/ListItem.vue
-->
<template>
  <li class="ficon is-flex is-align-items-center" :class="[{active:state}]" @click="activeSelf" @dblclick="expandDir">
    <div class="cover">
      <div :class="item | coverType">
        <img alt="folder" :src="getIconFile(item)" :class="item | iconType" />
      </div>
    </div>
    <div class="one-line">
      {{name}}
    </div>

  </li>
</template>

<script>
import { mixin } from '@/mixins/mixin';
export default {
  name: "list-item",
  mixins: [mixin],
  data() {
    return {
      isActive: this.state
    }
  },
  props: {
    item:{},
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