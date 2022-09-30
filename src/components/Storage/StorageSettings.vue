<!--
 * @Author: zhanghengxin hengxin.zhang@icewhale.org
 * @Date:  2022-09-13 17:01:37
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-29 20:35:39
 * @FilePath: /CasaOS-UI/src/components/Storage/StorageSettings.vue
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
-->
<template>
  <div class="modal-card">
    <!--    head-->
    <header class="modal-card-head pri-head">
      <div class="is-flex-grow-1">
        <h3 class=" title is-3">{{ $t(title) }}</h3>
      </div>
      <button class="delete" type="button" @click="$emit('close')"/>
    </header>
    <!--remind-->
    <div v-if="currentStep === 0" class="pri-mrl-2rem mt-5 mb-4">
      {{ $t('All the checked Storage will be merged into CasaOS HD.') }}
    </div>

    <!--    body-->
    <!--    <section class="modal-card-body">-->
    <!--    <section class="notification is-overlay pri-margin">-->
    <section :class="{'non-backgroud' : (currentStep !== 0)}"
             class="notification is-overlay mb-4 pri-mrl-2rem pr-0 pl-0">
      <template v-if="currentStep === 0">
        <div v-for="(item, index) in storageData" :key="index" class="is-flex pri-mtr-3px ml-4 mr-4">
          <div class="ml-5 is-flex is-align-items-center">
            <b-image :src="require('@/assets/img/storage/storage.png')" class="is-24x24"></b-image>
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
      <div v-if="currentStep === 2" class="is-flex is-align-items-center">
        <div class="message-danger left mr-2">
          <b-icon class="is-38x38" icon="danger" pack="casa"></b-icon>
        </div>
        {{
          `${runName.split(',').length} ` + $t('APPs is running') + ` ( ${runName} ), ` + $t('restart APPs to continue.')
        }}
      </div>
      <div v-if="currentStep === 3" class="is-flex is-align-items-center">
        <div class="message-danger left mr-2">
          <b-icon class="is-38x38" icon="danger" pack="casa"></b-icon>
        </div>
        {{ runName + $t(' is running, restart ') + runName + $t(' to continue.') }}
      </div>

    </section>

    <div v-if="currentStep === 0 && checkBoxGroup.length > 0" class="pri-message-alert is-flex is-align-items-center">
      <div class="is-flex left ml-4 mr-2 is-align-items-center">
        <b-icon class="is-16x16" icon="danger" pack="casa"></b-icon>
      </div>
      {{ $t('If the chosen storage is not empty, format better first.') }}
    </div>

    <div v-if="currentStep === 0" class="pri-message-danger is-flex is-align-items-center">
      <div class="is-flex left ml-4 mr-2 is-align-items-center">
        <b-icon class="is-16x16" icon="danger" pack="casa"></b-icon>
      </div>
      {{ $t('Please back up your data in storage, otherwise the data may be lost.') }}
    </div>

    <footer class="modal-card-foot is-flex is-align-items-center t-line">
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
    extended() {
      return this.checkBoxGroup.join(":")
    }
    ,
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
          this.currentStep = 3
          this.runName = dockerInfo[0].name
          return
        } else {
          this.currentStep = 2
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

.pri-head {
  line-height: 1.875rem;
  border-bottom: #cfcfcf 1px solid;
}

.pri-margin {
  margin: 2rem;
}

.pri-mrl-2rem {
  margin-left: 2rem;
  margin-right: 2rem;

  .pri-mtr-3px {
    margin-top: 0.1875rem;
    margin-bottom: 0.1875rem;
    min-height: 2.75rem;
  }

  div:hover {
    background: hsla(215, 89%, 93%, 1);
  }
}

.pri-text-color {
  color: hsla(0, 0%, 0%, 0.4);
}

.message-danger {
  color: hsla(348, 86%, 61%, 1);
}

.pri-message-alert {
  height: 2rem;
  margin-top: 0rem;
  margin-bottom: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 0.25rem;
  color: hsla(40, 100%, 43%, 1);
  font-size: 0.875rem;
  font-style: normal;
  background: hsla(40, 100%, 95%, 1);
}

.pri-message-danger {
  height: 2rem;
  margin-top: 0rem;
  margin-bottom: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 0.25rem;
  color: hsla(348, 86%, 61%, 1);
  font-size: 0.875rem;
  font-style: normal;
  background: hsla(348, 100%, 95%, 1);
}

.t-line {
  border-top: #cfcfcf 1px solid;
}
</style>
