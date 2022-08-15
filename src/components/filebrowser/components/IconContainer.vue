<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-05-04 17:01:10
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-02 12:10:03
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\IconContainer.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div :class="item | coverType">
    <transition name="fade">
      <img alt="folder" :src="imageData" key="thumb" v-if="showThumb" class="is-absolute" :class="isWide?'thumb-w':'thumb-h'" />
      <img alt="folder" :src="getIconFile(item)" :class="item | iconType" key="icon" class=" is-absolute" v-else />
    </transition>
    <div class="overlay-layer" >
      <b-icon pack="casa" icon="share" custom-size="casa-28px" class="share-icon casa-color-green casa-shape-rounded casa-shape-32px" v-if="isShared"></b-icon>
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
.overlay-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;

  .share-icon {
    position: absolute;
    right: 0.75rem;
    bottom: 0;
  }
}
</style>