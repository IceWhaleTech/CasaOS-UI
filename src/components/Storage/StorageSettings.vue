<!--
 * @Author: zhanghengxin hengxin.zhang@icewhale.org
 * @Date:  2022-09-13 17:01:37
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-21 01:07:18
 * @FilePath: /CasaOS-UI/src/components/Storage/StorageSettings.vue
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
    <div v-if="lessThen2" class="pri-message-alert ml-6 mr-6 is-flex is-align-items-center">
      <div class="left ml-4 mr-2">
        <b-icon class="is-16x16" icon="danger" pack="casa"></b-icon>
      </div>
      {{ $t('Please select at least 2 Storages.') }}
    </div>

    <div class="pri-message-danger ml-6 mr-6 is-flex is-align-items-center">
      <div class="left ml-4 mr-2">
        <b-icon class="is-16x16" icon="danger" pack="casa"></b-icon>
      </div>
      {{ $t('Please back up your data in storage, otherwise the data may be lost.') }}
    </div>

    <!--    body-->
    <!--    <section class="modal-card-body">-->
    <!--    <section class="notification is-overlay pri-margin">-->
    <section class="notification is-overlay mt-2 mr-6 mb-6 ml-6 pr-0">
      <div v-for="(item, index) in storageData" :key="index" class="is-flex pt-2 pb-2">
        <div>
          <b-image :src="require('@/assets/img/storage/storage.png')" class="is-64x64"></b-image>
        </div>
        <div class="is-flex is-flex-grow-1 is-flex-direction-column is-justify-content-center ">
          <span class="is-uppercase one-line is-size-14px">{{ item.name }}</span>
        </div>
        <div class="is-flex is-flex-shrink-0 is-flex-direction-column is-justify-content-center">
          <span class="is-uppercase is-size-7 pri-text-color">{{ renderSize(item.size - item.availSize) }}/{{
              renderSize(item.size)
            }}</span>
        </div>
        <b-checkbox v-model="checkBoxGroup" :native-value="item.path" class="ml-2 mr-4" type="is-info"></b-checkbox>
      </div>
    </section>

    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div>
        <b-button :label="$t('Submit')" :loading="isConnecting" expaned rounded type="is-primary" @click="submit"/>
      </div>
    </footer>
  </div>
</template>

<script>
import {mixin} from "@/mixins/mixin";
// var CasaOsLocalStorageApi = require('casa_os_local_storage_api');
// let CasaOsLocalStorageApi = require('@/codegen/local_storage/dist/index.js')
// import {MountMethodsApi} from '@/codegen/mount_methods_api/dist/index.js'

export default {
  name: "StorageSettings",
  mixins: [mixin],
  async mounted() {
    await this.getDiskList();
  },
  computed: {
    lessThen2() {
      if (this.checkBoxGroup.length < 2) {
        return true
      }
      return false
    },
    extended() {
      return this.checkBoxGroup.join(":")
    },

  },
  data() {
    return {
      storageData: [],
      storage: [{
        "Id": 0,
        "MountPoint": "/DATA",
        "FSType": "fuse.mergerfs",
        "Source": "/mnt/a:/mnt/b",
        "Options": "defaults,allow_other,use_ino,category.create=mfs,moveonenospc=true,minfreespace=1M",
        "Persist": false,
        "Extended": {
          "mergerfs.srcmounts": "/mnt/a:/mnt/b"
        }
      }],
      diskData: {},
      unDiskData: {},
      checkBoxGroup: [],
      isConnecting: false,

    }
  },
  methods: {
    /**
     * @description: Get disk list
     * @param {}
     * @return {void}
     * src/components/Storage/StorageManagerPanel.vue:234
     */
    async getDiskList() {
      // get storage list
      // TODO: the part is repetition
      //  with APPs Installation Location requirement document
      const storageRes = await this.$api.storage.list({system: "show"})
      const storageArray = []
      storageRes.data.data.forEach(item => {
        item.children.forEach(part => {
          part.disk = item.path
          part.diskName = item.disk_name
          storageArray.push(part)
        })
      })
      this.storageData = storageArray.map((storage) => {
        return {
          name: storage.label,
          isSystem: storage.diskName == "System",
          fsType: storage.type,
          size: storage.size,
          availSize: storage.avail,
          usePercent: 100 - Math.floor(storage.avail * 100 / storage.size),
          diskName: storage.drive_name,
          path: storage.path,
          mount_point: storage.mount_point,
          disk: storage.disk
        }
      })
    },

    submit() {
      // // MountMethodsApiFactory({mount_point: '/DATA', extended: this.extended}).updateMount('/DATA').then(() => {
      // //   console.log(1231231231231231231231312321312321)
      // // })
      // var host = new ApiClient('http://192.168.2.118/v2/local_storage');
      // var api = new MountMethodsApi(host);
      // var opts = {
      //   // 'id': 0,
      //   'mountPoint': '/media',
      //   // 'type': 'ext4',
      //   // 'source': '/dev/sda1'
      //   "FSType": "mergerfs",
      //   "Source": "/mnt/sdb:/mnt/sdc",
      //   "Options": "defaults,allow_other,use_ino,category.create=mfs,moveonenospc=true,minfreespace=1M",
      //   "Persist": true,
      // };
      // var callback = function (error, data, response) {
      //   if (error) {
      //     console.error(error);
      //   } else {
      //     console.log('API called successfully. Returned data: ' + data);
      //   }
      // };
      // // api.updateMount('/DATA/merged', {
      // //   "mount_point": "/DATA/merged",
      // //     "fstype": "mergerfs",
      // //     "source": "/mnt/sdb:/mnt/sdc",
      // //     "options": "defaults,allow_other,use_ino,category.create=mfs,moveonenospc=true,minfreespace=1M",
      // //     "persist": true
      // // }, callback);
      // api.updateMount('/merged', {}, callback);

      // use local_storage api
      this.$api.local_storage.create({
        "mount_point": "/DATA/merged", // a inalterable value
        "fstype": "mergerfs",
        "source": this.extended,
        "options": "defaults,allow_other,use_ino,category.create=mfs,moveonenospc=true,minfreespace=1M",
        "persist": true
      }).then(() => {
        console.log(1231231231231231231231312321312321)
      }).catch((err) => {
        console.log(err)
      })
    },

    // gei merge storage info
    // getMerageStorage() {
    //   var host = new ApiClient('http://192.168.2.118/v2/local_storage');
    //   var api = new MountMethodsApi(host);
    //   api.getMounts('/media', {}, function (data) {
    //     console.log(data)
    //   });
    // },

    mounted() {
      // this.getMerageStorage()
    },

  },
}
</script>

<style lang="scss" scoped>
.pri-margin {
  margin: 2rem;
}

.pri-text-color {
  color: hsla(0, 0%, 0%, 0.4);

}

.pri-message-danger {
  height: 2rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  color: hsla(348, 86%, 61%, 1);
  font-size: 0.875rem;
  font-style: normal;
  background: hsla(348, 100%, 95%, 1);
}
</style>
