<!--
 * @Author: zhanghengxin hengxin.zhang@icewhale.org
 * @Date:  2022-09-13 17:01:37
 * @LastEditors: zhanghengxin hengxin.zhang@icewhale.org
 * @LastEditTime: 2022-09-13 17:01:37
 * @FilePath: src/components/Storage/StorageSettings.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->
<template>
  <div class="modal-card">
    <!--    head-->
    <header class="modal-card-head b-line">
      <div class="is-flex-grow-1">
        <h3 class=" title is-3">{{ $t('MainStorage Settings') }}</h3>
      </div>
      <button class="delete" type="button" @click="$emit('close')"/>
    </header>
    <!--remind-->
    <div class="ml-6">
      {{ $t('Please choose a location with enough storage space and stable connection.') }}
    </div>
    <div class="ml-6">
      {{ $t('All the checked Storage will be merged into one big Storage.') }}
    </div>
    <div class="pri-message-alert ml-6 mr-6 is-flex is-align-items-center">
      <div class="left ml-4 mr-2">
        <b-icon class="is-16x16" icon="danger" pack="casa"></b-icon>
      </div>
      {{ $t('Please select at least 2 Storages.') }}
    </div>
    <!--    body-->
    <!--    <section class="modal-card-body">-->
    <!--    <section class="notification is-overlay pri-margin">-->
    <section class="notification is-overlay mt-2 mr-6 mb-6 ml-6 pr-0">
      <div class="is-flex">
        <b-image :src="require('@/assets/img/storage/storage.png')" class="is-64x64"></b-image>
        <div class="is-flex is-flex-grow-1 is-flex-direction-column is-justify-content-center">
          <span class="is-uppercase">TODO drive item</span>
        </div>
        <div class="is-flex is-flex-shrink-0 is-flex-direction-column is-justify-content-center">
          <span class="is-uppercase">TODO drive capacity</span>
        </div>
        <b-checkbox :native-value="TODO-origin-value" class="ml-2" type="is-info"></b-checkbox>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "StorageSettings"
}
</script>

<style lang="scss" scoped>
.pri-margin {
  margin: 2rem;
}
</style>
