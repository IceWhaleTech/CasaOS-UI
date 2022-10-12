<!--
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-08-03 14:08:02
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-29 20:43:45
 * @FilePath: /CasaOS-UI/src/components/filebrowser/sidebar/MountList.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->
<template>
  <div>
    <ul>
      <!-- merge fs storage item -->
      <li v-if="hasMergerFunction">
        <div class="is-flex list-item new-list-item">
          <div class="cover mr-2 is-flex-shrink-0 is-relative">
            <div @mouseover="hover = true" @mouseleave="hover = false" class="icon" @click="warning">
              <i :class="{'casa-storage-merger': !dorpdown && !hover || mergeStorageList.length === 0, 'casa-expand': hover && !dorpdown && mergeStorageList.length !== 0, 'casa-expand-down': dorpdown && mergeStorageList.length !== 0}"
                 class="casa casa-28px">
              </i>
            </div>
            <div class="hint" v-show="!dorpdown && !hover && mergeStorageList.length != 0">{{
                mergeStorageList.length
              }}
            </div>
          </div>
          <div class=" is-flex-grow-1 one-line" @click="filePanel.getFileList('/DATA')">CasaOS HD
          </div>
          <div class="is-flex is-align-items-center" v-if="testMergeMiss > 0">
            <b-icon icon="danger-outline" pack="casa" class="warn" custom-size="casa-16px"></b-icon>
          </div>
        </div>
        <ul v-show="dorpdown">
          <tree-list-item v-for="item in mergeStorageList" :key="item.path" :isActive="isActive"
                          :item="item"></tree-list-item>
        </ul>
      </li>

      <!-- Local Storage List Start -->
      <tree-list-item v-for="item in localStorageList" :key="item.path" :isActive="isActive"
                      :item="item"></tree-list-item>
      <!-- Local Storage List End -->

      <!-- Network Storage List Start -->
      <tree-list-item v-for="item in networkStorageList" :key="item.path" :isActive="isActive" :item="item"
                      iconName="eject" @rightIconClick="umountNetwork"></tree-list-item>
      <!-- Network Storage List End -->

      <!-- USB List Start -->
      <tree-list-item v-for="item in usbStorageList" :key="item.path" :isActive="isActive" :item="item" iconName="eject"
                      @rightIconClick="umountUsb"></tree-list-item>
      <!-- USB List End -->

    </ul>
    <b-loading v-model="isLoading" :is-full-page="false"></b-loading>
  </div>

</template>

<script>
import {mixin} from '@/mixins/mixin';
import events from '@/events/events';
import TreeListItem from './TreeListItem.vue';

export default {
  components: {TreeListItem},
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
    hasMergerFunction: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      usbStorageList: [],
      localStorageList: [],
      networkStorageList: [],
      dorpdown: false,
      mergeStorageList: [],
      testMergeMiss: 0,
      hover: false,
    }
  },
  created() {
    this.getStorageList()
  },

  async mounted() {
    this.$EventBus.$on(events.RELOAD_MOUNT_LIST, this.getStorageList);

  },
  methods: {
    async getStorageList() {
      this.isLoading = true;
      // Merge Storage
      let mergeRes;
      try {
        mergeRes = await this.$api.local_storage.getMergerfsInfo().then(res => res.data.data[0].source_volume_paths)
      } catch (error) {
        mergeRes = []
        console.log(error)
      }

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
            icon: 'storage-USB',
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
        const storageRes = await this.$api.storage.list()
        const storageArray = []
        storageRes.data.data.forEach(item => {
          item.children.forEach(part => {
            if (!mergeRes.find(mp => mp === part.path))
              storageArray.push(part)
          })
        })
        this.localStorageList = storageArray.map((storage) => {
          return {
            name: storage.label,
            icon: 'storage-other',
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
        this.networkStorageList = networkRes.data.data.map((storage) => {
          return {
            id: storage.id,
            name: storage.host,
            icon: 'storage-network',
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

      try {
        this.mergeStorageList = [];
        const storageRes = await this.$api.storage.list()
        const storageList = storageRes.data.data
        // mergeRes.push('test');
        mergeRes.forEach(item => {
          let storage = storageList.find(storage => {
            return storage.children[0].path === item
          })
          if (storage) {
            this.mergeStorageList.push({
              name: storage.children[0].label,
              icon: '',
              pack: 'casa',
              path: storage.children[0].mount_point,
              visible: true,
              selected: true,
              extensions: null
            })
          } else {
            this.testMergeMiss += 1
            this.mergeStorageList.push({
              name: item,
              icon: 'danger',
              pack: 'casa',
              path: item,
              visible: true,
              selected: true,
              extensions: null
            })
          }
        })
      } catch
          (error) {
        this.isLoading = false;
        console.log(error.reponse.message)
      }

      this.isLoading = false;

    }
    ,

    // umount usb storage
    umountUsb(item) {
      this.$api.disks.umountUsb({mount_point: item.path}).then(() => {
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
    }
    ,

    // umount network storage
    umountNetwork(item) {
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


    }
    ,

    // go to DATA folder
    goToDataFolder(item) {
      if (this.$store.state.currentPath.startsWith(item.path)) {
        this.filePanel.getFileList('/DATA')
      }
    },

    async warning() {
      if (this.dorpdown) {
        this.dorpdown = false
        return
      }
      let notFirst = await this.$api.users.getCustomStorage('notFirstOpenMergerStorage').then(res => res.data.data)
      if (notFirst) {
        this.dorpdown = !this.dorpdown
        return
      }
      this.$buefy.dialog.confirm({
        title: this.$t('Data Protected'),
        message: this.$t('Changing internal files may break the structure of the CasaOS HD'),
        confirmText: this.$t('Continue'),
        cancelText: this.$t('Cancel'),
        iconPack: 'casa',
        icon: 'danger',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.dorpdown = !this.dorpdown
          this.$api.users.setCustomStorage('notFirstOpenMergerStorage', true)
        }
      })
    },

  },
  sockets: {

    sys_usb() {
      setTimeout(() => {
        this.$api.disks.getUsbs().then((res) => {
          const usbStorageArray = []
          res.data.data.forEach(item => {
            item.children.forEach(part => {
              usbStorageArray.push(part)
            })
          })
          this.usbStorageList = usbStorageArray.map((storage) => {
            return {
              name: storage.name,
              icon: 'storage-USB',
              pack: 'casa',
              path: storage.mount_point,
              visible: true,
              selected: true,
              extensions: null
            }
          })
        }).catch((error) => {
          console.log(error.reponse.message)
        })
      }, 500)
    },
    storage_status() {
      setTimeout(() => {
        this.$api.storage.list().then((res) => {
          const storageArray = []
          res.data.data.forEach(item => {
            item.children.forEach(part => {
              storageArray.push(part)
            })
          })
          this.localStorageList = storageArray.map((storage) => {
            return {
              name: storage.label,
              icon: 'storage-other',
              pack: 'casa',
              path: storage.mount_point,
              visible: true,
              selected: true,
              extensions: null
            }
          })
        }).catch((error) => {
          console.log(error.reponse.message)
        })
      }, 500)
    }
  }

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

.warn {
  color: hsla(348, 86%, 61%, 1);
}

.hint {
  position: absolute;
  color: white;
  font-size: 10px;
  background-color: black;
  width: 15px;
  height: 15px;
  line-height: 13px;
  text-align: center;
  -webkit-border-radius: 24px;
  border-radius: 24px;
  border: 1px solid #FFFFFF;
  top: -0.5rem;
  left: 0.9rem;
}
</style>
