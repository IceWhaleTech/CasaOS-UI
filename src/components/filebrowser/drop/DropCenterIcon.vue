<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2023-03-03 00:10:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-15 14:50:48
 * @FilePath: /CasaOS-UI/src/components/filebrowser/drop/DropCenterIcon.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="container">
    <div class="has-text-centered">
      <b-image
        :src="require('@/assets/img/drop/drop_icon.svg')"
        class="is-80x80 ml-auto mr-auto mb-2"
      ></b-image>
      <p class="has-text-emphasis-02 has-text-grey-800 mb-2">
        {{ $t("FilesDrop") }}
      </p>
      <p class="has-text-full-04 has-text-grey-600">
        {{ $t("Drop files to another device anytime, anywhere") }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "drop-center-icon",
};
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 11.5rem;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
</style>
