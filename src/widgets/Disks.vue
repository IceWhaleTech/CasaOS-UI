<template>
  <div>
    <!-- Disk Info Start -->
    <div class="widget has-text-white disk is-relative">
      <div class="blur-background"></div>
      <div class="widget-content">
        <!-- Header Start -->
        <div class="widget-header is-flex">
          <div class="widget-title is-flex-grow-1">
            {{ $t('Storage') }}
          </div>
          <div class="widget-icon-button is-flex-shrink-0" @click="showDiskManagement">
            <b-icon pack="casa" icon="setting" size="is-20"></b-icon>
          </div>
        </div>
        <!-- Header End -->
        <div class="columns is-mobile is-multiline pt-2 ">
          <div class="column is-full pb-1">
            <div class="is-flex is-align-items-center">
              <div class="header-icon">
                <b-image :src="require('@/assets/img/storage/storage.svg')" class="is-68x68"></b-image>
              </div>
              <div class="ml-3 is-flex-grow-1 ">
                <h4 class="title is-size-14px mb-2 mt-1 has-text-left has-text-white one-line is-align-items-center is-flex">
                  <b-tag type="is-success" v-if="health">{{ $t('Healthy') }}</b-tag>
                  <b-tag type="is-danger" v-else>{{ $t('Damage') }}</b-tag>
                </h4>
                <p class="has-text-left is-size-14px mt-1">
                  <span class="op65">{{ $t('Used') }}: </span>{{ renderSize(totalUsed) }}<br>
                  <span class="op65">{{ $t('Total') }}: </span>{{ renderSize(totalSize) }}
                </p>
              </div>
            </div>
            <b-progress :type="totalPercent | getProgressType" size="is-small" :value="totalPercent"
                        class="mt-2"></b-progress>
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
                <b-image :src="require('@/assets/img/storage/USB.png')" class="is-68x68"></b-image>
              </div>
              <div class="ml-3 is-flex-grow-1 ">
                <h4 class="title is-size-14px mb-2 mt-1 has-text-left has-text-white one-line ">
                  {{ item.model }}</h4>
                <p class="has-text-left is-size-6 mt-1 ">
                  <span class="op65">{{ $t('Used') }}:</span> {{ renderSize(item.size - item.avail) }}
                  <br>
                  <span class="op65"> {{ $t('Total') }}:</span> {{ renderSize(item.size) }}
                </p>
              </div>
            </div>
            <b-progress :type="(Math.floor((item.size - item.avail) * 100 / item.size)) | getProgressType"
                        size="is-small" :value=" Math.floor((item.size - item.avail) * 100 / item.size)"
                        class="mt-2"></b-progress>
          </div>
        </div>
      </div>
    </div>

    <!-- Usb Disk List End -->
  </div>

</template>

<script>
import StorageManagerPanel from '@/components/Storage/StorageManagerPanel.vue'
import {mixin} from '../mixins/mixin';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
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
      health: "Healthy",
      usbDisks: []
    }
  },

  mounted() {
    this.getDiskInfo(this.$store.state.hardwareInfo.sys_disk)
    this.usbDisks = this.$store.state.hardwareInfo.sys_usb
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
  sockets: {
    sys_disk(data) {
      this.getDiskInfo(data.body.data)
    },
    sys_usb(data) {
      this.usbDisks = data.body.data
    },
    sys_hardware_status(data) {
      // DISK
      this.getDiskInfo(data.body.sys_disk)
      // USB
      this.usbDisks = data.body.sys_usb
    }
  }
}
</script>

<style lang="scss">
.disk {
  .progress {
    border-radius: 2px;
    height: 12px;

    &::-webkit-progress-bar {
      background: rgba(255, 255, 255, 0.4);
    }

    &::-webkit-progress-value {
      opacity: 1;
    }
  }

  .tag {
    height: 1.125rem;
    border-radius: 2px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
