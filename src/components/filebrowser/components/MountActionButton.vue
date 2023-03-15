<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-08-03 14:10:43
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-15 14:09:13
 * @FilePath: /CasaOS-UI/src/components/filebrowser/components/MountActionButton.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div class="action-btn">
    <b-dropdown aria-role="list" append-to-body close-on-click ref="dropDown" id="location-drop" class="file-dropdown"
      position="is-bottom-left" animation="fade1">
      <template #trigger>
        <p role="button" class=" is-clickable">
          <b-icon icon="plus" custom-size="mdi-18px"></b-icon>
        </p>
      </template>
      <b-dropdown-item aria-role="menuitem" @click="showDiskManagement">
        <div class="is-flex is-align-items-center">
          <div class="img-container mr-1"></div>
          {{ $t('New Local Storage') }}
        </div>

      </b-dropdown-item>
      <hr class="dropdown-divider" v-if="platforms.length > 0">
      <b-dropdown-item aria-role="menuitem" v-for="(driver, index) in platforms" :key="index + 'platform'"
        @click="auth(driver)">
        <div class="is-flex is-align-items-center">
          <div class="img-container mr-1">
            <b-image :src="getDriverIcon(driver)" class="is-16x16"></b-image>
          </div>
          {{ $t("Connect " + driver.name) }}
        </div>
      </b-dropdown-item>
      <hr class="dropdown-divider" v-if="platforms.length > 0">
      <b-dropdown-item aria-role="menuitem" @click="showNewNetworkStorage">
        <div class="is-flex is-align-items-center">
          <div class="img-container mr-1"></div>
          {{ $t('Connect Network Storage') }}
        </div>

      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import StorageManagerPanel from '@/components/Storage/StorageManagerPanel.vue'
import NewNetworkStorage from '@/components/filebrowser/modals/NewNetworkStorage.vue'
export default {
  data() {
    return {
      platforms: []
    }
  },

  created() {
    this.getPlatformList()
  },

  methods: {
    // get platforms list
    async getPlatformList() {
      try {
        const res = await this.$api.driver.getDriverList()
        const drivers = res.data.data
        Object.keys(drivers).forEach((key) => {
          const driver = drivers[key]
          driver.name = key
          this.platforms.push(driver)
        });
      } catch (error) {
        console.error(error)
      }
    },

    // get Driver Icon
    getDriverIcon(driver) {
      const icon = driver.find(({ name }) => name === 'icon')
      return icon.default
    },

    // goto auth procress
    auth(driver) {
      const newWindowDrivers = ['Dropbox', 'GoogleDrive']
      if (newWindowDrivers.includes(driver.name)) {
        this.openAuthWindow(driver)
        if(driver.name === 'Dropbox'){
          this.$messageBus('files_addlocation_dropbox')
        }else if(driver.name === 'GoogleDrive'){
          this.$messageBus('files_addlocation_googledrive')
        }
        this.$messageBus('files_filesdrop_tab')
      } else {
        console.log("open config modal");
      }
    },

    openAuthWindow(driver) {
      const customWidth = 1280;
      const customHeight = 700;
      const iTop = (window.screen.height - 30 - customHeight) / 2;
      const iLeft = (window.screen.width - 10 - customWidth) / 2;
      const authUrl = driver.find(({ name }) => name === 'auth_url').default.replace("${HOST}", encodeURI(this.$protocol + "//" + this.$baseURL)).replace("redirect_uri=http%", "redirect_uri=https%")
      window.open(authUrl, driver.name, 'height=' + customHeight + ',,innerHeight=' + customHeight + ',width=' + customWidth + ',innerWidth=' + customWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
    },
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

<style lang="scss">
.img-container {
  width: 16px;
  height: 16px;
}
</style>