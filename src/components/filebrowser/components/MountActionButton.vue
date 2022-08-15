<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-08-03 14:10:43
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-04 11:08:25
 * @FilePath: \CasaOS-UI\src\components\filebrowser\components\MountActionButton.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="action-btn">
    <b-dropdown aria-role="list" append-to-body close-on-click ref="dropDown" id="location-drop" class="file-dropdown" position="is-bottom-left" animation="fade1">
      <template #trigger>
        <p role="button" class=" is-clickable">
          <b-icon icon="plus" custom-size="mdi-18px"></b-icon>
        </p>
      </template>
      <b-dropdown-item aria-role="menuitem" @click="showDiskManagement">
        {{ $t('New Local Storage') }}
      </b-dropdown-item>
      <b-dropdown-item aria-role="menuitem" @click="showNewNetworkStorage">
        {{ $t('Connect Network Storage') }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import StorageManagerPanel from '@/components/Storage/StorageManagerPanel.vue'
import NewNetworkStorage from '@/components/filebrowser/modals/NewNetworkStorage.vue'
export default {

  methods: {
    // Show Disk Management Panel
    showDiskManagement() {
      this.$buefy.modal.open({
        parent: this,
        component: StorageManagerPanel,
        hasModalCard: true,
        customClass: 'storage-modal',
        trapFocus: true,
        canCancel: [],
        scroll: "keep",
        animation: "zoom-in",
      })
    },

    // Show New Network Storage Panel
    showNewNetworkStorage() {
      this.$buefy.modal.open({
        parent: this,
        component: NewNetworkStorage,
        hasModalCard: true,
        customClass: 'network-storage-modal',
        trapFocus: true,
        canCancel: [],
        scroll: "keep",
        animation: "zoom-in",
      })
    },
  },
}
</script>

<style>
</style>