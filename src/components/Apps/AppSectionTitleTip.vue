<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-28 13:24:25
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-12 17:45:45
 * @FilePath: \CasaOS-UI-0.4.2\src\components\Apps\AppSectionTitleTip.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->
<template>
  <h1 class="title is-3  has-text-grey-100 is-flex-shrink-1 is-flex-grow-1 mb-0 contextmenu-canvas home-app-tip">
    <b-tooltip type="is-dark" position="is-right" :active="active" always>
      <template v-slot:content>
        <div class="mr-1">{{ $t(label) }}</div>
        <div class="is-clickable" @click="hideTip">
          <b-icon pack="casa" icon="close-xs"></b-icon>
        </div>
      </template>
      <span class="mr-2">{{ $t(title) }}</span>
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
  .is-clickable {
    line-height: 1rem;
  }
}
</style>
