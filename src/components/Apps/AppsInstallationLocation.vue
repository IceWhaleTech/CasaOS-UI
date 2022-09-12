<!--
 * @Author: zhanghengxin ezreal.ice@icloud.com
 * @Date: 2022-09-07 17:35:02
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-07 17:57:11
 * @FilePath: /CasaOS-UI/src/components/Apps/AppsInstallationLocation.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 the file not be used
-->

<template>
  <div>
    <!--    header-->
    <header class="modal-card-head b-line">
      <div class="is-flex-grow-1">
        <h3 class="is-flex-grow-1 title is-3">apps installation location</h3>
      </div>
      <button class="delete" type="button" @click="TODO"/>
    </header>
    <section>
      <storage-item v-for="(item,index) in storageData" :key="'storage'+index" :item="item"
                    @getDiskList="getDiskList"></storage-item>
    </section>
  </div>
</template>

<script>
import storageItem from "@/components/Storage/StorageItem";

export default {
  name: "AppsInstallationLocation",
  components: {
    storageItem
  },
  props: {},
  data() {
    return {
      storageData: [{
        name: 12,
        isSystem: true,
        fsType: 'fsType',
        diskName: 'diakname',
        availSize: '1024',
        disk_type: 'type',
        path: 'path',
        mount_point: 'mount_point',
        usePercent: '20',
        model: 'model',
        size: 123,
        health: true,
        temperature: 100,
      }],
      diskData: [{
        name: 12,
        disk_type: 'type',
        model: 'model',
        size: 1234567,
        health: true,
        temperature: 100,
      }]
    }
  }
}
</script>

<style scoped>

</style>
