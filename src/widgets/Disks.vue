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
            <p class="has-text-left is-size-7 mt-1 is-uppercase">{{item.size | renderSize}} {{item.tran}} </p>
          </div>
        </div>
        <div class="has-text-left is-size-7 mt-1">{{item.availSize | renderSize}} available of {{item.size | renderSize}}</div>
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
      timer: 0,
      diskData: [],
    }
  },
  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.getDiskInfo();
    this.timer = setInterval(() => {
      this.getDiskInfo();
    }, 5000)
  },
  methods: {
    getDiskInfo() {
      this.$api.disk.diskList().then((res) => {
        if (res.data.success == 200) {
          this.diskData = res.data.data.reverse().map((disk) => {
            let totalSize = disk.size;
            let useSize = disk.children.reduce((total, item) => {
              let used = item.fsused != "" ? Number(item.fsused) : 0
              return total + used
            }, 0);
            return {
              label: disk.model != "" ? disk.model : disk.name,
              size: totalSize,
              tran: disk.tran,
              availSize: totalSize - useSize,
              useSize: useSize,
              usePercnet: Math.floor(useSize * 100 / totalSize),
            }
          })
        }
      })
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
  filters: {
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
