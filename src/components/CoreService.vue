<!--
 * @Author: JerryK
 * @Date: 2021-11-10 17:50:18
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-24 17:09:42
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/CoreService.vue
-->
<template>
  <div class=" home-section has-text-left mt-55">
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
import SmartBlock from './SmartBlock.vue'
import SyncBlock from './SyncBlock.vue'
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