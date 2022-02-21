<!--
 * @Author: JerryK
 * @Date: 2022-02-18 12:44:03
 * @LastEditors: JerryK
 * @LastEditTime: 2022-02-18 12:58:53
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\filebrowser\FileEntryCard.vue
-->
<template>
  <div class="column is-narrow is-3">
    <div class="wuji-card is-flex is-align-items-center is-justify-content-center p-55 app-card">
      <!-- Card Content Start -->
      <div class="has-text-centered is-flex is-justify-content-center is-flex-direction-column pt-3 pb-3 img-c">
        <a class="is-flex is-justify-content-center" @click="showFilePanel">
          <b-image :src="require('@/assets/img/file-icon.svg')" class="is-72x72"></b-image>
        </a>
        <p class="mt-4 one-line">
          <a class="one-line" @click="showFilePanel">
            File Manager
          </a>
        </p>
      </div>
      <!-- Card Content End -->
    </div>
  </div>
</template>

<script>
import FilePanel from './FilePanel.vue'
export default {

  methods: {
    /**
   * @description: SHow FileBrowser Panel
   * @return {*} void
   */
    showFilePanel() {
      this.$buefy.modal.open({
        parent: this,
        component: FilePanel,
        hasModalCard: true,
        customClass: 'file-panel',
        trapFocus: true,
        canCancel: ['escape'],
        scroll: "keep",
        animation: "zoom-out",
        props: {

        }
      })
    }
  },
}
</script>

<style>
</style>