<!--
 * @Author: JerryK
 * @Date: 2022-01-17 15:16:11
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-11 17:15:06
 * @Description:
 * @FilePath: /CasaOS-UI/src/components/Storage/StorageManagerPanel.vue
-->
<template>
  <div class="modal-card">

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <template v-if="!isCreating">
        <h3 class="title is-3">{{title}}</h3>
        <div class="close-container"><button type="button" class="delete" @click="$emit('close')" /></div>

        <!-- Storage and Disk List Start -->
        <div class="is-flex-grow-1 is-relative" v-if="!creatIsShow">
          <div class="create-container" v-if="activeTab == 0">

            <popper trigger="hover" append-to-body :options="{placement: 'bottom', modifiers: { offset: { offset: '0,4px' } } }">
              <div class="popper  tooltip-content dark" v-show="unDiskData.length == 0">
                {{$t('Please insert a Drive to Create Storage')}}
              </div>
              <div slot="reference">
                <b-button size="is-small" type="is-link is-light" rounded @click="showCreate" :disabled="unDiskData.length == 0">{{ $t('Create Storage') }}</b-button>
              </div>

            </popper>

          </div>
          <b-tabs :animated="false" v-model="activeTab">
            <b-tab-item :label="$t('Storage')" class="scrollbars-light-auto tab-item">
              <storage-item v-for="(item,index) in storageData" :key="'storage'+index" :item="item" @getDiskList="getDiskList"></storage-item>
            </b-tab-item>
            <b-tab-item :label="$t('Drive')" class="scrollbars-light-auto tab-item">
              <drive-item v-for="(item,index) in diskData" :key="'disk'+index" :item="item"></drive-item>
            </b-tab-item>
          </b-tabs>

        </div>
        <!-- Storage and Disk List End -->

        <!-- Create Storage Start -->
        <div class="is-flex-grow-1 is-relative" v-if="creatIsShow">
          <ValidationObserver ref="ob1">
            <ValidationProvider rules="required" name="StorageName" v-slot="{ errors, valid }">
              <b-field :label="$t('Storage Name')" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="$t(errors)">
                <b-input v-model="createStorageName" @keyup.native="createStorageName=createStorageName.replace(/[^\w]/g,'')" @paste.native="createStorageName=createStorageName.replace(/[^\w]/g,'')"></b-input>
              </b-field>
            </ValidationProvider>

            <b-field :label="$t('Choose Drive')">
              <b-select v-model="activeDisk" @input="onDiskChoose" expanded>
                <option v-for="(option,index) in unDiskData" :value="index" :key="option.path">
                  {{ option.name }} ({{ option.model }} - {{ renderSize(option.size) }})
                </option>
              </b-select>
            </b-field>

          </ValidationObserver>

          <article class="message is-danger mt-5" v-if="createStorageType == 'format'">
            <section class="message-body">
              <div class="media">
                <div class="media-left">
                  <span class="icon is-large is-danger"><i class="mdi mdi-alert-circle mdi-48px"></i></span>
                </div>
                <div class="media-content">
                  <h3 class="is-size-5">{{ $t('Warning') }}</h3>
                  <p class="is-size-14px">
                    {{ $t("The selected drive will be emptied.") }}<br>
                    {{ $t("Please make sure again that there is no important data on the selected drive that needs to be backed up.") }}
                  </p>
                </div>
              </div>
            </section>
          </article>

          <article class="message is-danger mt-5" v-else>
            <section class="message-body">
              <div class="media">
                <div class="media-left">
                  <span class="icon is-large is-danger"><i class="mdi mdi-alert-circle mdi-48px"></i></span>
                </div>
                <div class="media-content">
                  <h3 class="is-size-5">{{ $t('Attention') }}</h3>
                  <p class="is-size-14px">
                    {{ $t("The drive you select can be used directly as storage.") }}<br>
                    {{ $t("You can also choose to create it after formatting. If formatted, the selected drive will be emptied.") }}<br>
                    {{ $t("Please make sure again that there is no important data on the selected drive that needs to be backed up.") }}
                  </p>
                </div>
              </div>
            </section>
          </article>

        </div>
        <!-- Create Storage End -->
      </template>
      <template v-if="isCreating">
        <div class="installing-warpper mt-6 mb-6">
          <div class="is-flex is-align-items-center is-justify-content-center mb-5">
            <lottie-animation class="creating-animation" :animationData="require('@/assets/ani/creating.json')" :loop="true" :autoPlay="true"></lottie-animation>
          </div>
          <h3 class="title is-4 has-text-centered has-text-weight-light">{{ $t('Creation in progress') }}...</h3>
        </div>
      </template>
      <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="false"></b-loading>
    </section>

    <!-- Modal-Card Body End -->
    <!-- Modal-Card Footer Start-->
    <footer class="modal-card-foot is-flex is-align-items-center " v-if="creatIsShow && !isCreating">
      <template>
        <div class="is-flex-grow-1"></div>
        <div>
          <b-button :label="$t('Cancel')" @click="showDefault" rounded />
          <b-button :label="$t('Format and Create')" :type="createStorageType == 'format'?'is-primary':''" @click="createStorge(true)" rounded :loading="isValiding" />
          <b-button :label="$t('Create')" type="is-primary" @click="createStorge(false)" rounded :loading="isValiding" v-if="createStorageType == 'mountable'" />
        </div>
      </template>

    </footer>
    <!-- Modal-Card Footer End -->

  </div>
</template>

<script>
import LottieAnimation from "lottie-web-vue";
import smoothReflow from 'vue-smooth-reflow'
import delay from 'lodash/delay';
import max from 'lodash/max';
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { mixin } from '../../mixins/mixin';
import DriveItem from './DriveItem.vue'
import StorageItem from './StorageItem.vue'
import Popper from 'vue-popperjs';
export default {
  name: "storage-manager-panel",
  components: {
    LottieAnimation,
    ValidationObserver,
    ValidationProvider,
    DriveItem,
    StorageItem,
    Popper
  },
  mixins: [smoothReflow, mixin],
  data() {
    return {
      isLoading: true,
      creatIsShow: false,
      isCreating: false,
      isValiding: false,
      activeTab: 0,
      activeDisk: "",
      createStorageName: "",
      createStoragePath: "",
      createStorageSeiral: "",
      createStorageType: "",
      diskData: [],
      unDiskData: [],
      storageData: []
    }
  },

  computed: {
    title() {
      return this.creatIsShow ? this.$t('Create Storage') : this.$t('Storage Manager')
    }
  },
  mounted() {
    //Smooth
    this.$smoothReflow({
      el: '.modal-card',
      property: ['height', 'width'],
      transition: 'height .25s ease, width .75s ease-out'
    })

    //Get disk list
    let _this = this
    delay(function () {
      _this.getDiskList()
    }, 150);
  },

  methods: {
    /**
     * @description: Get disk list
     * @param {}
     * @return {void}
     */
    async getDiskList(showDefault = false) {

      // get disk list
      try {
        const diskRes = await this.$api.disks.getDiskList()
        this.diskData = diskRes.data.data.drive
        this.unDiskData = diskRes.data.data.avail
      } catch (error) {
        console.log(error.response.message);
      }

      // get storage list
      try {
        const storageRes = await this.$api.storage.list({ system: "show" })
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

        let diskNumArray = this.storageData.map(storage => {
          if (storage.name.includes("Storage")) {
            let diskNum = storage.name.replace("Storage", "")
            return (/^\d+$/.test(diskNum)) ? Number(diskNum) : 0
          } else {
            return 0
          }
        })
        let nextMaxNum = max(diskNumArray) + 1;
        if (this.unDiskData.length > 0) {
          this.createStoragePath = this.unDiskData[0].path
          this.createStorageSeiral = this.unDiskData[0].serial
          this.createStorageType = this.getDiskType(this.unDiskData[0].need_format)
          this.createStorageName = "Storage" + nextMaxNum
          this.activeDisk = 0
        }
        if (showDefault) {
          this.showDefault()
          this.isCreating = false
          this.createStorageName = ""
        }
      } catch (error) {
        console.log(error.response.message);
      }

      this.isLoading = false
    },

    /**
     * @description: Disk choose handle
     * @param {int} evt index of select
     * @return {void}
     */
    onDiskChoose(index) {
      this.createStoragePath = this.unDiskData[index].path
      this.createStorageSeiral = this.unDiskData[index].serial
      this.createStorageType = this.getDiskType(this.unDiskData[index].need_format)
    },
    showDefault() {
      this.creatIsShow = false
    },
    showCreate() {
      this.creatIsShow = true
      let diskNumArray = this.storageData.map(disk => {
        if (disk.name.includes("Storage")) {
          let diskNum = disk.name.replace("Storage", "")
          return (/^\d+$/.test(diskNum)) ? Number(diskNum) : 0
        } else {
          return 0
        }
      })
      let nextMaxNum = max(diskNumArray) + 1;
      this.createStorageName = "Storage" + nextMaxNum
    },
    /**
     * @description: Validate form async
     * @param {Object} ref ref of component
     * @return {Boolean}
     */
    async checkStep(ref) {
      let isValid = await ref.validate()
      return isValid
    },
    /**
     * @description: Create a new storage
     * @param {}
     * @return {void}
     */
    createStorge(needFormat) {
      this.isValiding = true
      this.checkStep(this.$refs.ob1).then(val => {
        this.isValiding = false
        if (val) {
          this.submitCreate(needFormat)
        }
      }).catch(err => {
        this.isValiding = false
        this.$buefy.toast.open({
          duration: 3000,
          message: err.response.data.message,
          type: 'is-danger'
        })
      })

    },
    submitCreate(format) {
      this.isCreating = true
      let data = {
        path: this.createStoragePath,
        name: this.createStorageName,
        format: format
      }
      this.$api.storage.create(data).then((res) => {

        if (res.data.success != 200) {
          this.isCreating = false;
          this.$buefy.toast.open({
            duration: 3000,
            message: res.data.message,
            type: 'is-danger'
          })
        } else {
          this.getDiskList(true);
        }
      }).catch(err => {
        this.isCreating = false
        this.$buefy.toast.open({
          duration: 3000,
          message: err.response.data.message,
          type: 'is-danger'
        })
      })
    },

    getDiskType(need_format) {
      return need_format ? "format" : "mountable"
    }
  }
}
</script>


<style lang="scss" scoped>
.create-container {
  height: 2.25rem;
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
}
.storage-modal {
  .modal-card-body {
    overflow-y: hidden;
    transition: height 0.3s;
    padding: 2rem 2rem 2rem 2rem;
    position: relative;

    .tab-item {
      max-height: calc(100vh - 15rem);
      overflow-y: overlay;
    }
  }

  .modal-card-foot {
    padding-top: 0;
  }

  .close-container {
    position: absolute;
    right: 2rem;
    top: 2rem;
  }

  .tab-content {
    padding: 0;
  }

  .status {
    min-width: 7.75rem;
  }
}

.popper {
  background-color: #505459;
  padding: 0.35rem 0.75rem;
  box-shadow: 0px 1px 2px 1px rgba(0, 1, 0, 0.2);
  border: none;
  color: #ffffff;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 400;
}
</style>

<style lang="scss">
.popper[x-placement^="bottom"].dark .popper__arrow {
  border-color: transparent transparent #505459 transparent !important;
}
</style>
