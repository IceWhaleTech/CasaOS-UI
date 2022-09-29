<!--
 * @Author: zhanghengxin hengxin.zhang@icewhale.org
 * @Date:  2022-09-13 17:01:37
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-28 01:33:43
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
        <h3 class=" title is-3">{{ $t(title) }}</h3>
      </div>
      <button class="delete" type="button" @click="$emit('close')"/>
    </header>
    <!--remind-->
    <template v-if="currentStep === 0">
      <div class="ml-6">
        {{ $t('Please choose a location with enough storage space and stable connection.') }}
      </div>
      <div class="ml-6">
        {{ $t('All the checked Storage will be merged into one big Storage.') }}
      </div>
      <!-- <div v-if="lessThen2" class="pri-message-alert ml-6 mr-6 is-flex is-align-items-center">
        <div class="left ml-4 mr-2">
          <b-icon class="is-16x16" icon="danger" pack="casa"></b-icon>
        </div>
        {{ $t('Please select at least 2 Storages.') }}
      </div> -->

      <div class="pri-message-danger ml-6 mr-6 is-flex is-align-items-center">
        <div class="left ml-4 mr-2">
          <b-icon class="is-16x16" icon="danger" pack="casa"></b-icon>
        </div>
        {{ $t('Please back up your data in storage, otherwise the data may be lost.') }}
      </div>
    </template>


    <!--    body-->
    <!--    <section class="modal-card-body">-->
    <!--    <section class="notification is-overlay pri-margin">-->
    <section :class="{'non-backgroud' : (currentStep !== 0)}"
             class="notification is-overlay mt-2 mr-6 mb-6 ml-6 pr-0 pl-0">
      <template v-if="currentStep === 0">
        <div v-for="(item, index) in storageData" :key="index" class="is-flex pt-2 pb-2 ml-5">
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
          <b-checkbox v-model="checkBoxGroup" :disabled="item.persistedIn !== 'casaos'" :native-value="item.path"
                      class="ml-2 mr-4" type="is-info"></b-checkbox>
        </div>
      </template>
      <template v-if="currentStep === 1">
        <div>
          {{ $t('Enter the password to continue.') }}
        </div>
        <b-input v-model="password" type="password"></b-input>
      </template>
      <div v-if="currentStep === 2" class="message-danger is-flex is-align-items-center">
        <div class="left mr-2">
          <b-icon class="is-38x38" icon="danger" pack="casa"></b-icon>
        </div>
        {{
          `${runName.split(',').length} ` + $t('APPs is running') + `(${runName}),` + $t('restart APPs to continue.')
        }}
      </div>
      <div v-if="currentStep === 3" class="message-danger is-flex is-align-items-center">
        <div class="left mr-2">
          <b-icon class="is-38x38" icon="danger" pack="casa"></b-icon>
        </div>
        {{ runName + $t(' is running, restart ') + runName + $t(' to continue.') }}
      </div>

    </section>

    <footer class="modal-card-foot is-flex is-align-items-center">
      <div class="is-flex-grow-1"></div>
      <div class="mr-4">
        <b-button v-show="currentStep > 1" :label="$t('cancel')" expaned rounded type="is-primary"
                  @click="currentStep = 0"/>
      </div>
      <div>
        <b-button v-show="currentStep === 0" :label="$t(affirm)" :loading="isConnecting" expaned rounded
                  type="is-primary" @click="submit"/>
        <b-button v-show="currentStep === 1" :label="$t(affirm)" :loading="isConnecting" expaned rounded
                  type="is-primary" @click="verifyPassword(password)"/>
        <b-button v-show="currentStep === 2" :label="$t(affirm)" :loading="isConnecting" expaned rounded
                  type="is-primary" @click="restart"/>
        <b-button v-show="currentStep === 3" :label="$t(affirm)" :loading="isConnecting" expaned rounded
                  type="is-primary" @click="restart"/>
      </div>
    </footer>
  </div>
</template>

<script>
import {mixin} from "@/mixins/mixin";
import jwt_decode from "jwt-decode";
import MD5 from 'md5-es';
// var CasaOsLocalStorageApi = require('casa_os_local_storage_api');
// let CasaOsLocalStorageApi = require('@/codegen/local_storage/dist/index.js')
// import {MountMethodsApi} from '@/codegen/mount_methods_api/dist/index.js'

export default {
  name: "StorageSettings",
  mixins: [mixin],
  mounted() {
    this.getDiskList();
    this.getMerageStorage();
  },
  watch: {
    // 0 default :mainstorage settings
    // 1 Data Protected
    // 2 APPs Restart
    // 3 APP Restart
    currentStep(val) {
      switch (val) {
        case 0:
          this.title = "MainStorage Settings";
          this.affirm = "Submit";
          break;
        case 1:
          this.title = "Data Protected";
          this.affirm = "Submit";

          break;
        case 2:
          this.title = "APPs Restart";
          this.affirm = "Restart";

          break;
        case 3:
          this.title = "APP Restart";
          this.affirm = "Restart";

          break;
        default:
          break;
      }

    }
  },
  computed: {
    // title() {
    //   // 0 default :mainstorage settings
    //   // 1 Data Protected
    //   // 2 APPs Restart
    //   // 3 APP Restart
    //   switch (this.currentStep) {
    //     case 0:
    //       return this.$t('MainStorage Settings')
    //     case 1:
    //       return this.$t('Data Protected')
    //     case 2:
    //       return this.$t('APPs Restart')
    //     case 3:
    //       return this.$t('APP Restart')
    //     default:
    //       return this.$t('MainStorage Settings')
    //   }
    // }
    // ,
    lessThen2() {
      if (this.checkBoxGroup.length < 2) {
        return true
      }
      return false
    }
    ,
    extended() {
      return this.checkBoxGroup.join(":")
    }
    ,
    // isSplit(){

    // }
  }
  ,
  data() {
    return {
      storageData: [],
      diskData: {},
      unDiskData: {},
      checkBoxGroup: [],
      isConnecting: false,
      currentStep: 0,
      title: "MainStorage Settings",
      affirm: "Submit",
      mergeInfo: [],
      password: '',
      runName: '',

    }
  }
  ,
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
      const storageRes = await this.$api.storage.list()
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
          disk: storage.disk,
          persistedIn: storage.persisted_in,
        }
      })
    }
    ,

    updateMerge() {
      // merge api
      this.$api.local_storage.updateMergerfsInfo({
        "fstype": "fuse.mergerfs",
        "mount_point": "/DATA",
        // "source_base_path": "/var/lib/casaos/files",
        "source_volume_paths": [
          ...this.checkBoxGroup
        ]
      }).then(res => {
        // TODO : need to check the result by the states code
        switch (res.status) {
          case 200:
          case 400:
          default:
            // close the modal
            this.$emit('close')
        }
      })
    }
    ,

    // get the storage list mounted to the mergerfs
    async getMerageStorage() {
      try {
        // TODO merge can't be used
        this.mergeInfo = await this.$api.local_storage.getMergerfsInfo().then(res => res.data.data[0]["source_volume_paths"]).catch(() => [])
        this.checkBoxGroup.push(...this.mergeInfo)
      } catch (e) {
        console.log(e)
      }
    },

    async submit(e, nextStep = false) {
      // operation : split the mergerfs
      //
      let notSplit = this.mergeInfo.every(item => this.checkBoxGroup.includes(item))
      if (notSplit || nextStep) {
        // get docker info
        let dockerInfo = await this.$api.container.getInfo('').then(res => res.data.data.casaos_apps)
        if (dockerInfo.length === 1) {
          this.currentStep = 2
          this.runName = dockerInfo[0].name
          return
        } else {
          this.currentStep = 3
          this.runName = dockerInfo.map(item => item.name).join(',')
          return
        }
      }
      this.currentStep = 1
    },

    async restart() {
      try {
        // get docker info
        let dockerInfo = await this.$api.container.getInfo('').then(res => res.data.data.casaos_apps)
        let container = this.$api.container
        dockerInfo.forEach(async item => {
          // restart the docker
          await container.updateState(item.id, "restar")
        })
        this.updateMerge()
      } catch (e) {
        console.log(e)
      }

    },

    verifyPassword(password) {
      // get token from the local storage
      const token = localStorage.getItem('access_token')
      // decode the token
      const tokenJson = jwt_decode(token)
      if (MD5.hash(password) === tokenJson.password) {
        this.submit(null, true);
        return
      }
      this.$buefy.toast.open({
        duration: 3000,
        message: this.$t("Password is incorrect"),
        type: 'is-danger'
      })
    }

  }
  ,
}
</script>

<style lang="scss" scoped>
.non-backgroud {
  background: none;
}

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
