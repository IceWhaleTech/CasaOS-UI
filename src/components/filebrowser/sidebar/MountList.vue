<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-08-03 14:08:02
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-04 22:38:43
 * @FilePath: \CasaOS-UI\src\components\filebrowser\sidebar\MountList.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
-->
<template>
  <div>
    <ul>
      <!-- USB List Start -->
      <tree-list-item v-for="item in usbStorageList" :key="item.path" :item="item" :isActive="isActive" iconName="disc" @rightIconClick="umountUsb"></tree-list-item>
      <!-- USB List End -->

      <!-- Local Storage List Start -->
      <tree-list-item v-for="item in localStorageList" :key="item.path" :item="item" :isActive="isActive"></tree-list-item>
      <!-- Local Storage List End -->

      <!-- Network Storage List Start -->
      <tree-list-item v-for="item in networkStorageList" :key="item.path" :item="item" :isActive="isActive" iconName="disc" @rightIconClick="umountNetwork"></tree-list-item>
      <!-- Network Storage List End -->

    </ul>
    <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
  </div>

</template>

<script>
import { mixin } from '@/mixins/mixin';
import TreeListItem from './TreeListItem.vue';
export default {
  components: { TreeListItem },
  mixins: [mixin],
  inject: ['filePanel'],

  props: {
    path: {
      type: String,
      default: ""
    },
    autoLoad: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      isLoading: false,
      usbStorageList: [],
      localStorageList: [],
      networkStorageList: [],
    }
  },
  created() {
    this.getStorageList()
  },

  mounted() {


  },
  methods: {
    async getStorageList() {
      this.isLoading = true;
      // USB Storage
      try {
        const usbListRes = await this.$api.disks.getUsbs()
        const usbStorageArray = []
        usbListRes.data.data.forEach(item => {
          item.children.forEach(part => {
            usbStorageArray.push(part)
          })
        })
        this.usbStorageList = usbStorageArray.map((storage) => {
          return {
            name: storage.name,
            icon: 'folder-media',
            pack: 'casa',
            path: storage.mount_point,
            visible: true,
            selected: true,
            extensions: null
          }
        })
      } catch (error) {
        this.isLoading = false;
        console.log(error.reponse.message)
      }

      // Local Storage
      try {
        const storageRes = await this.$api.storage.list({ system: "show" })
        const storageArray = []
        storageRes.data.data.forEach(item => {
          item.children.forEach(part => {
            storageArray.push(part)
          })
        })
        this.localStorageList = storageArray.map((storage) => {
          return {
            name: storage.label,
            icon: 'folder-media',
            pack: 'casa',
            path: storage.mount_point,
            visible: true,
            selected: true,
            extensions: null
          }
        })
      } catch (error) {
        this.isLoading = false;
        console.log(error.reponse.message)
      }

      // Network Storage

      try {

        const networkRes = await this.$api.samba.getConnections()
        console.log(networkRes.data.data);
        this.networkStorageList = networkRes.data.data.map((storage) => {
          return {
            id: storage.id,
            name: storage.host,
            icon: 'folder-media',
            pack: 'casa',
            path: storage.mount_point,
            visible: true,
            selected: true,
            extensions: null
          }
        })

      } catch (error) {
        this.isLoading = false;
        console.log(error.reponse.message)
      }

      this.isLoading = false;

    },

    // umount usb storage
    umountUsb(item) {
      console.log(item);
      this.goToDataFolder(item)
    },

    // umount network storage
    umountNetwork(item) {
      console.log(item);
      this.$api.samba.deleteConnection(item.id).then(() => {
        this.getStorageList()
        this.goToDataFolder(item)
        this.$buefy.toast.open({
          message: this.$t('Eject Success'),
          type: 'is-success'
        })
      }).catch(() => {
        this.$buefy.toast.open({
          message: this.$t('Eject Failed'),
          type: 'is-danger'
        })
      })


    },

    // go to DATA folder
    goToDataFolder(item) {
      if (this.$store.state.currentPath.startsWith(item.path)) {
        this.filePanel.getFileList('/DATA')
      }
    }
  },

}
</script>

<style lang="scss" scoped>
.overlay-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;

  .icon {
    position: absolute;
    right: -0.15rem;
    bottom: -0.1rem;
  }
}
</style>