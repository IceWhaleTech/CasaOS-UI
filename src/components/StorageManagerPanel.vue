<!--
 * @Author: JerryK
 * @Date: 2022-01-17 15:16:11
 * @LastEditors: JerryK
 * @LastEditTime: 2022-01-20 18:30:33
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/StorageManagerPanel.vue
-->
<template>
  <div class="modal-card">

    <!-- Modal-Card Body Start -->
    <section class="modal-card-body ">
      <template v-if="!isCreating">
        <h2 class="title is-4">{{title}}</h2>
        <div class="close-container"><button type="button" class="delete" @click="$emit('close')" /></div>

        <!-- Storage and Disk List Start -->
        <div class="flex1 is-relative" v-if="!creatIsShow">
          <div class="create-container" v-if="activeTab == 0 && unDiskData.length > 0">
            <b-button size="is-small" type="is-link is-light" rounded @click="showCreate">{{ $t('Create Storage') }}</b-button>
          </div>
          <b-tabs :animated="false" v-model="activeTab">
            <b-tab-item :label="$t('Storage')">
              <storage-item v-for="(item,index) in storageData" :key="'storage'+index" :item="item" @getDiskList="getDiskList"></storage-item>
            </b-tab-item>
            <b-tab-item :label="$t('Drive')">
              <drive-item v-for="(item,index) in diskData" :key="'disk'+index" :item="item"></drive-item>
            </b-tab-item>
          </b-tabs>

        </div>
        <!-- Storage and Disk List End -->

        <!-- Create Storage Start -->
        <div class="flex1 is-relative" v-if="creatIsShow">
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
                  <p class="is-size-65">
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
                  <p class="is-size-65">
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
        <div class="flex1"></div>
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
import difference from 'lodash/difference';
import delay from 'lodash/delay';
import max from 'lodash/max';
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { mixin } from '../mixins/mixin';
import DriveItem from './Storage/DriveItem.vue'
import StorageItem from './Storage/StorageItem.vue'
export default {
  name: "storage-manager-panel",
  components: {
    LottieAnimation,
    ValidationObserver,
    ValidationProvider,
    DriveItem,
    StorageItem
  },
  mixins: [smoothReflow, mixin],
  data() {
    return {
      isLoading: true,
      creatIsShow: false,
      isCreating: false,
      isValiding: false,
      removingId: "",
      formatingId: "",
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
    // this.getDiskList()
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
    getDiskList(showDefault = false) {
      this.$api.disk.diskList().then(res => {
        if (res.data.success === 200) {
          this.diskData = res.data.data

          let realDisks = this.diskData.filter((disk) => {
            if (disk.children !== null && disk.children.length == 1) {
              let childs = disk.children.filter(part => {
                return part.mountpoint != "" && part.fstype == "ext4"
              })
              return childs.length > 0
            }
          })

          this.unDiskData = difference(this.diskData, realDisks);


          this.storageData = realDisks.map((disk) => {
            let totalSize = this.getTotalSize(disk, "fssize");
            let useSize = this.getTotalSize(disk, "fsused");
            let availSize = this.getTotalSize(disk, "fsavail");
            return {
              name: disk.children[0].name,
              isSystem: disk.children[0].mountpoint == "/",
              fsType: disk.children[0].fstype,
              size: totalSize,
              tran: disk.tran,
              availSize: availSize,
              useSize: useSize,
              usePercent: 100 - Math.floor(availSize * 100 / totalSize),
              diskName: disk.name,
              path: disk.children[0].path,
              mount_point: disk.children[0].mountpoint
            }
          })

          let diskNumArray = this.storageData.map(disk => {
            if (disk.name.includes("Storage")) {
              let diskNum = disk.name.replace("Storage", "")
              return (/^\d+$/.test(diskNum)) ? Number(diskNum) : 0
            } else {
              return 0
            }
          })
          let nextMaxNum = max(diskNumArray) + 1;
          if (this.unDiskData.length > 0) {
            this.createStoragePath = this.unDiskData[0].path
            this.createStorageSeiral = this.unDiskData[0].serial
            this.createStorageType = this.getDiskType(this.unDiskData[0])
            this.createStorageName = "Storage" + nextMaxNum
            this.activeDisk = 0
          }
          if (showDefault) {
            this.showDefault()
            this.isCreating = false
            this.createStorageName = ""
          }
          this.isLoading = false
        }
      })
    },

    /**
     * @description: Disk choose handle
     * @param {int} evt index of select 
     * @return {void} 
     */
    onDiskChoose(evt) {
      this.createStoragePath = this.unDiskData[evt].path
      this.createStorageSeiral = this.unDiskData[evt].serial
      this.createStorageType = this.getDiskType(this.unDiskData[evt])
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
      })

    },
    submitCreate(format) {
      this.isCreating = true
      let data = {
        path: this.createStoragePath,
        serial: this.createStorageSeiral,
        name: this.createStorageName,
        format: format
      }
      this.$api.disk.addStorage(data).then((res) => {

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
      })
    },

    getTotalSize(part, key) {
      let size = 0;
      if (part.children !== null) {
        size = part.children.reduce((total, item) => {
          let totalsize = (item.mountpoint.indexOf("boot") == -1) ? this.getTotalSize(item, key) : 0;
          return total + totalsize
        }, 0);
      } else {
        size = Number(part[key])
      }
      return size;
    },
    getDiskType(disk) {
      if (disk.children !== null && disk.children.length == 1 && disk.children[0].fstype == "ext4") {
        return "mountable"
      } else {
        return "format"
      }
    }
  }
}
</script>

<style>
</style>