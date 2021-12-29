<template>
  <div class="widget has-text-white disk">
    <div class="columns is-mobile is-multiline pt-2 pb-2">
      <div class="column is-full" v-for="(item,index) in diskData" :key="'disk'+index">
        <div class="is-flex">
          <div class="header-icon">
            <b-image :src="require('@/assets/img/disk.png')" class="is-48x48"></b-image>
          </div>
          <div class="ml-3 is-flex-grow-1">
            <h4 class="title is-size-6-5 mb-2 mt-1 has-text-left has-text-white one-line">{{item.label}}</h4>
            <p class="has-text-left is-size-7 mt-1 is-uppercase">{{renderSize(item.size)}} {{item.tran}} </p>
          </div>
        </div>
        <div class="has-text-left is-size-7 mt-1">{{$t("available of",{avl:renderSize(item.availSize),total:renderSize(item.size)})}}</div>
        <b-progress :type="item.usePercnet | getType" :value="item.usePercnet" size="is-xsmall" class="mt-2"></b-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'disks',
  icon: "harddisk",
  title: "Disk Status",
  initShow: true,
  components: {

  },
  data() {
    return {
      diskData: [],
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
        }
      })

    },
    renderSize(value) {
      if (null == value || value == '') {
        return "0 Bytes";
      }
      var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
      var index = 0,
        srcsize = parseFloat(value);
      index = Math.floor(Math.log(srcsize) / Math.log(1024));
      var size = srcsize / Math.pow(1024, index);
      size = size.toFixed(2);
      return size + unitArr[index];
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
    border-radius: 4px;
    height: 24px;
    &::-webkit-progress-bar {
      background: rgba(0, 0, 0, 0.56);
    }
    &::-webkit-progress-value {
      opacity: 0.7;
    }
  }
}
</style>
