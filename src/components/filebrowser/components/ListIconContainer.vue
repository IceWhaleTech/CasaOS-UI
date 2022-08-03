<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-05-11 15:21:54
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-02 12:15:00
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\ListIconContainer.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div :class="item | coverType">
    <transition name="fade">
      <img alt="folder" :src="imageData" key="thumb" v-if="showThumb" class="is-absolute" :class="isWide?'thumb-w':'thumb-h'" />
      <img alt="folder" :src="getIconFile(item)" :class="item | iconType" key="icon" v-else />
    </transition>
    <div class="overlay-layer" >
      <b-icon pack="casa" icon="share" custom-size="casa-12px" class="share-icon casa-color-green casa-shape-rounded casa-shape-16px" v-if="isShared"></b-icon>
    </div>
  </div>
</template>

<script>
import { mixin } from '@/mixins/mixin';
import IconContainerMixin from '@/mixins/IconContainerMixin'
export default {
  mixins: [mixin, IconContainerMixin],
}
</script>

<style lang="scss" scoped>
.folder-cover{
  position: relative;
}
.overlay-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  left: 0;
  top: 0;

  .share-icon {
    position: absolute;
    right: -0.5rem;
    bottom: 0.25rem;
  }
}
</style>