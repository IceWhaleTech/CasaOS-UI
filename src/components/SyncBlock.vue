<!--
 * @Author: JerryK
 * @Date: 2021-11-10 17:48:25
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-10 18:25:35
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\SyncBlock.vue
-->
<template>
  <div class="column is-one-half">
    <div class="wuji-card">
      <!-- Init State Start -->
      <h6 class="title is-6 mb-2 has-text-white">Sync your data</h6>
      <div class="is-flex is-align-items-center">
        <div class="info ">
          <div class="des two-line">
            Follow the guide to start syncing your files across multiple devices.
          </div>
        </div>
        <b-image :src="require('@/assets/img/sync_icon.png')" class="is-64x64"></b-image>
      </div>
      <div class="buttons">
        <b-button type="is-primary" size="is-small" rounded @click="openSyncPanel">Go !</b-button>
      </div>
      <!-- Init State End -->

    </div>
  </div>
</template>

<script>
import SyncPanel from './SyncPanel.vue'
export default {
  name: "sync-block",
  components: {

  },
  data() {
    return {
      isLoading: false,
    }
  },

  mounted() {

  },

  methods: {
    openSyncPanel() {
      this.$buefy.modal.open({
        parent: this,
        component: SyncPanel,
        hasModalCard: true,
        customClass: '',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-out",
        events: {
          'updateState': () => {
            this.getList()
          }
        },
        props: {
          id: "0",
          state: "install",
        }
      })
    }
  },
}
</script>

<style>
</style>