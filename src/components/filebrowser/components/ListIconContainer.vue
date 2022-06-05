<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-05-11 15:21:54
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-30 09:23:02
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\ListIconContainer.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div :class="item | coverType">
    <transition name="fade">
      <img alt="folder" :src="imageData" key="thumb" v-if="showThumb" class="has-absolute" :class="isWide?'thumb-w':'thumb-h'" />
      <img alt="folder" :src="getIconFile(item)" :class="item | iconType" key="icon" v-else />
    </transition>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import IconContainerMixin from '@/mixins/IconContainerMixin'
export default {
  mixins: [mixin, IconContainerMixin],
}
</script>

<style>
</style>