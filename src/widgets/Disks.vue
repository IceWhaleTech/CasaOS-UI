<template>
  <div>
    <!-- Disk Info Start -->
    <div class="widget has-text-white disk is-relative">
      <div class="arrow-btn" @click="showDiskManagement">
        <b-icon icon="cog-outline" custom-size="mdi-18px"></b-icon>
      </div>
      <div class="blur-background"></div>
      <div class="widget-content">
        <div class="columns is-mobile is-multiline pt-2 ">
          <div class="column is-full pb-1">
            <div class="is-flex">
              <div class="header-icon">
                <b-image :src="require('@/assets/img/storage/storage.png')" class="is-64x64"></b-image>
              </div>
              <div class="ml-3 is-flex-grow-1 ">
                <h4 class="title is-size-6-5 mb-2 mt-1 has-text-left has-text-white one-line is-align-items-center is-flex">
                  {{ $t('Storage') }}
                  <b class="has-text-success is-size-7 has-text-weight-normal ml-3" v-if="health">{{ $t('Healthy') }}</b><b class="has-text-danger is-size-7 has-text-weight-normal ml-3" v-else>{{ $t('Damage') }}</b>
                </h4>
                <p class="has-text-left is-size-7 mt-1 op65">{{ $t('Used') }}: {{renderSize(totalUsed)}}<br>
                  {{ $t('Total') }}: {{renderSize(totalSize)}}</p>
              </div>
            </div>
            <b-progress :type="totalPercent | getProgressType" size="is-small" :value="totalPercent" class="mt-2">
            </b-progress>
          </div>
        </div>
      </div>
    </div>
    <!-- Disk Info End -->
    <!-- Usb Disk List Start -->
    <div class="widget has-text-white disk is-relative" v-if="usbDisks.length > 0">
      <div class="blur-background"></div>
      <div class="widget-content">
        <div class="columns is-mobile is-multiline pt-2 ">
          <div class="column is-full pb-1" v-for="(item) in usbDisks" :key="'usb_'+item.name">
            <div class="is-flex">
              <div class="header-icon is-flex-shrink-0">
                <b-image :src="require('@/assets/img/storage/USB.png')" class="is-64x64"></b-image>
              </div>
              <div class="ml-3 is-flex-grow-1 ">
                <h4 class="title is-size-6-5 mb-2 mt-1 has-text-left has-text-white one-line ">
                  {{ item.model }}</h4>
                <p class="has-text-left is-size-7 mt-1 op65">
                  <span>{{ $t('Used') }}: {{item.mount?renderSize(item.use):N/A}}</span>
                  <br>
                  {{ $t('Total') }}: {{renderSize(item.size)}}
                </p>
              </div>
            </div>
            <b-progress v-if="item.mount" :type="(Math.floor(item.use * 100 / item.size)) | getProgressType" size="is-small" :value=" Math.floor(item.use * 100 / item.size)" class="mt-2"></b-progress>
            <b-progress v-else type="is-dark" size="is-small" :value="0" class="mt-2"></b-progress>
          </div>
        </div>
      </div>
    </div>

    <!-- Usb Disk List End -->
  </div>

</template>

<script>
import StorageManagerPanel from '@/components/Storage/StorageManagerPanel.vue'
import { mixin } from '../mixins/mixin';
export default {
  name: 'disks',
  icon: "harddisk",
  title: "Storage Status",
  initShow: true,
  mixins: [mixin],

  data() {
    return {
      totalSize: 0,
      totalUsed: 0,
      totalPercent: 0,
      health: "",
      usbDisks: []
    }
  },

  mounted() {
    this.getDiskInfo(this.$store.state.hardwareInfo.disk)
    this.usbDisks = this.$store.state.hardwareInfo.usb
  },

  watch: {
    // Watch if Hardware info changes in the store
    '$store.state.hardwareInfo': {
      handler(data) {
        this.getDiskInfo(data.disk)
        this.usbDisks = data.usb
      },
      deep: true
    },
  },

  methods: {
    getDiskInfo(diskInfo) {
      this.totalSize = diskInfo.size
      this.totalUsed = diskInfo.used
      this.totalPercent = 100 - Math.floor(diskInfo.avail * 100 / this.totalSize)
      this.health = diskInfo.health
    },

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


  },
}
</script>

<style lang="scss">
.disk {
  .progress {
    border-radius: 6px;
    height: 12px;
    &::-webkit-progress-bar {
      background: rgba(0, 0, 0, 0.56);
    }
    &::-webkit-progress-value {
      opacity: 0.7;
    }
  }
}
</style>
