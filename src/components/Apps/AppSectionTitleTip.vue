<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-28 13:24:25
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-28 13:39:36
 * @FilePath: \CasaOS-UI\src\components\Apps\AppSectionTitleTip.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <h1 class="title is-4  has-text-white is-flex-shrink-1 is-flex-grow-1 mb-0 contextmenu-canvas home-app-tip">
    <b-tooltip type="is-dark" position="is-right" :active="active" always>
      <template v-slot:content>
        <div class="mr-1">{{ $t(label) }}</div>
        <div class="is-clickable" @click="hideTip">
          <b-icon pack="casa" icon="close-xs"></b-icon>
        </div>
      </template>
      {{ $t(title) }}
    </b-tooltip>

  </h1>
</template>

<script>
export default {
  name: "app-section-title-tip",
  props: {
    title: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      active: localStorage.getItem(this.id) ? false : true,
    }
  },
  methods: {
    hideTip() {
      localStorage.setItem(this.id, "hide");
      this.active = false
    }
  },

}
</script>

<style lang="scss">
.home-app-tip {
  .tooltip-content {
    display: flex;
    align-items: center;
    padding-right: 0.25rem;
  }
}
</style>