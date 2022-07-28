<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-28 15:48:34
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-28 16:24:21
 * @FilePath: \CasaOS-UI\src\components\filebrowser\shared\ShareListPage.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="content is-flex-grow-1">
    <!-- Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1 is-flex breadcrumb-container" id="bread-container">
      </div>
      <div class="is-flex is-align-items-center">
        <!--  Close Button Start -->
        <div class="is-flex is-align-items-center modal-close-container  ">
          <button type="button" class="delete" @click="$emit('close')" />
        </div>
        <!--  Close Button End -->

      </div>
    </header>
    <!-- Header End -->
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>