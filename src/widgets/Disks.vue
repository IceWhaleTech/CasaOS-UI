<template>
  <div class="widget has-text-white disk is-relative">
    <div class="arrow-btn" @click="showDiskManagement">
      <b-icon icon="cog-outline" custom-size="mdi-18px"></b-icon>
    </div>
    <div class="columns is-mobile is-multiline pt-2 ">
      <div class="column is-full pb-1">
        <div class="is-flex">
          <div class="header-icon">
            <b-image :src="require('@/assets/img/storage.png')" class="is-64x64"></b-image>
          </div>
          <div class="ml-3 is-flex-grow-1 ">
            <h4 class="title is-size-6-5 mb-2 mt-1 has-text-left has-text-white one-line is-align-items-center is-flex">{{ $t('Storage') }}

              <b class="has-text-success is-size-7 has-text-weight-normal ml-3" v-if="health">{{ $t('Healthy') }}</b><b class="has-text-danger is-size-7 has-text-weight-normal ml-3" v-else>{{ $t('Damage') }}</b>

            </h4>
            <p class="has-text-left is-size-7 mt-1">{{ $t('Used') }}: {{renderSize(totalUsed)}}<br>
              {{ $t('Total') }}: {{renderSize(totalSize)}}</p>
          </div>
        </div>
        <b-progress type="is-primary" size="is-small" :value="totalPercent" class="mt-2"></b-progress>
      </div>
    </div>
  </div>
</template>

<script>
import StorageManagerPanel from '@/components/StorageManagerPanel.vue'
import sumBy from 'lodash/sumBy'
import { mixin } from '../mixins/mixin';
export default {
  name: 'disks',
  icon: "harddisk",
  title: "Disk Status",
  initShow: true,
  mixins: [mixin],
  components: {

  },

  data() {
    return {
      diskData: [],
      totalSize: 0,
      totalUsed: 0,
      totalPercent: 0,
      health: ""
    }
  },
  mounted() {
    this.getDiskInfo(this.$store.state.hardwareInfo.disk)
  },
  watch: {
    // Watch if Hardware info changes in the store
    '$store.state.hardwareInfo': {
      handler(val) {
        this.getDiskInfo(val.disk)
      },
      deep: true
    },
  },
  methods: {
    showDiskManagement() {
      console.log("disk");
      this.$buefy.modal.open({
        parent: this,
        component: StorageManagerPanel,
        hasModalCard: true,
        customClass: 'storage-modal',
        trapFocus: true,
        canCancel: [],
        scroll: "keep",
        animation: "zoom-out",
        events: {

        },
        props: {
          id: "0",
          state: "install",
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
    getDiskInfo(diskInfo) {
      let realDisks = diskInfo.filter((disk) => {
        if (disk.children !== null) {
          let childs = disk.children.filter(part => {
            return part.mountpoint != ""
          })
          return childs.length > 0
        }
      })
      this.diskData = realDisks.reverse().map((disk) => {
        let totalSize = this.getTotalSize(disk, "fssize");
        let useSize = this.getTotalSize(disk, "fsused");
        let availSize = this.getTotalSize(disk, "fsavail");
        return {
          label: disk.model != "" ? disk.model : disk.name,
          size: totalSize,
          tran: disk.tran,
          availSize: availSize,
          useSize: useSize,
          usePercnet: 100 - Math.floor(availSize * 100 / totalSize),
          health: disk.health
        }
      })

      this.totalSize = sumBy(this.diskData, (disk) => { return disk.size })
      this.totalUsed = sumBy(this.diskData, (disk) => { return disk.useSize })
      let totalAvail = sumBy(this.diskData, (disk) => { return disk.availSize })
      this.totalPercent = 100 - Math.floor(totalAvail * 100 / this.totalSize)


      this.health = !this.diskData.some((disk) => {
        return disk.health == "false";
      })

    },
  },
  filters: {

    formatNum(number) {
      return new Intl.NumberFormat().format(number)
    },
    getType(per) {
      if (per >= 0 && per < 80) {
        return "is-success"
      } else if (per >= 60 && per < 90) {
        return "is-warning"
      } else {
        return "is-danger"
      }
    },
    getTextType(per) {
      if (per >= 0 && per < 80) {
        return "has-text-success"
      } else if (per >= 60 && per < 90) {
        return "has-text-warning"
      } else {
        return "has-text-danger"
      }
    }
  }
}
</script>

<style lang="scss">
.disk {
  .one-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
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
