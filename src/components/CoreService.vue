<!--
 * @Author: JerryK
 * @Date: 2021-11-10 17:50:18
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-17 18:48:10
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/CoreService.vue
-->
<template>
  <div class=" home-section has-text-left mt-5">
    <div class="columns is-variable is-2 is-multiline suggestion-list">
      <template v-if="!isLoading">
        <sync-block v-if="isSyncConfigLoaded"></sync-block>
        <smart-block></smart-block>
      </template>
      <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
    </div>
  </div>

</template>

<script>
import SmartBlock from './smartHome/SmartBlock.vue'
import SyncBlock from './syncthing/SyncBlock.vue'
export default {
  components: { SyncBlock, SmartBlock },
  name: "core-service",
  data() {
    return {
      isLoading: false,
      isSyncConfigLoaded:false,
    }
  },
  created () {
    this.$api.sync.getConfig().then((res) => {
      this.$store.commit('changeSyncthingInfo', res.data.data);
      this.isSyncConfigLoaded = true;
    });
  },
}
</script>

<style>

</style>