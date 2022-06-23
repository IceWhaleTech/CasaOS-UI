<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-22 22:20:20
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-22 22:24:50
 * @FilePath: \CasaOS-UI\src\components\background\BackgroundModal.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="modal-card">
    <!-- Modal-Card Header Start -->
    <header class="modal-card-head">
      <div class="is-flex-grow-1">
        <h3 class="title is-3">{{$t('Change Wallpaper')}}</h3>
      </div>

    </header>
    <!-- Modal-Card Header End -->
    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      text
    </section>
    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Cancel')" @click="$emit('close')" rounded />
        <b-button :label="$t('Submit')" type="is-primary" rounded expaned @click="saveChange" />
      </div>
    </footer>
    <!-- Modal-Card Footer End -->
    <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isLoading: false,

    }
  },
  components: {

  },
  methods: {
    saveChange(){
        console.log("save");
    }
  }
}
</script>

<style>
</style>