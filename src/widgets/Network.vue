<!--
 * @Author: JerryK
 * @Date: 2021-12-06 13:52:11
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-27 22:47:13
 * @Description: 
 * @FilePath: \CasaOS-UI\src\widgets\Network.vue
-->
<template>
  <div class="widget has-text-white clock is-relative">
    <div class="blur-background"></div>

    <div class="network widget-content">
      <!-- Header Start -->
      <div class="widget-header is-flex">
        <div class="widget-title is-flex-grow-1">
          {{ $t('Network Status') }}
        </div>
      </div>
      <!-- Header End -->
      <!-- Chart Start -->
      <div class="chart-container">
        <vue-apex-charts type="area" ref="chart" height="130" :options="chartOptions" :series="networks[networkId]" />
      </div>
      <!-- Chart End -->
      <!-- Status Start -->
      <div class="is-flex ">
        <div class=" is-flex-grow-1">
          <b-dropdown aria-role="list" position="is-top-right" class="netowrk-dropdown" animation="fade1" v-model="networkId" :mobile-modal="false">
            <template #trigger="{ active }">
              <b-button :label="initNetwork[networkId].name" type="is-primary" :icon-right="active ? 'chevron-up' : 'chevron-down'" />
            </template>
            <b-dropdown-item aria-role="listitem" v-for="(item,index) in initNetwork" :key="'net'+index" :value="index">{{item.name}}</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class=" is-flex-shrink-0 is-size-7 is-flex is-align-items-center">
          <div>
            <b-icon icon="arrow-up-bold" size="is-small" class="up">
            </b-icon> {{currentUpSpeed*1024 | renderSize}}/s
            <b-icon icon="arrow-down-bold" size="is-small" class="down ml-2">
            </b-icon> {{currentDownSpeed*1024 | renderSize}}/s
          </div>
        </div>
      </div>
      <!-- Status End -->
    </div>
  </div>
</template>

<script>
// import VueApexCharts from 'vue-apexcharts'
import { mixin } from '@/mixins/mixin';
export default {
  mixins: [mixin],
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'network',
  icon: "lan",
  title: "Network Status",
  initShow: true,
  components: {
    VueApexCharts: () => import("vue-apexcharts")
  },
  data() {
    return {
      initNetwork: [],
      networkId: 0,
      networks: [],
      currentUpSpeed: 0,
      currentDownSpeed: 0,
      chartOptions: {
        chart: {
          offsetX: -5,
          offsetY: -10,
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          stacked: false,
          animations: {
            enabled: false,
          },
        },

        markers: {
          size: 0,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
          width: 1,
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: true
            }
          },
        },
        tooltip: {
          enabled: false,
        },
        xaxis: {
          type: 'numeric',
          range: 60,
          labels: {
            show: false,
          },
          tooltip: {
            enabled: false
          },
          axisBorder: {
            show: false,
          }
        },
        yaxis: {
          labels: {
            show: true,
            rotate: 0,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            minHeight: undefined,
            maxHeight: 120,
            style: {
              colors: '#ffffff',
              fontSize: '10px',
              fontWeight: 400,
              cssClass: 'apexcharts-xaxis-label',
            },
            offsetX: 0,
            offsetY: 0,
            format: undefined,
            formatter: undefined,
            datetimeUTC: true,
          },
        },
        legend: {
          show: false,
          position: 'top',
          horizontalAlign: 'left'
        }
      },
    }
  },
  created() {
    this.initNetwork = this.$store.state.hardwareInfo.net
  },

  methods: {
    buildDatas(data) {
      data.forEach((el, index) => {
        if (this.networks[index] === undefined) {
          this.networks[index] = [
            {
              name: 'Up',
              data: ["0"],
              cacheData: 0,
              cacheTime: 0
            },
            {
              name: 'Down',
              data: ["0"],
              cacheData: 0,
              cacheTime: 0
            }
          ]
        }
        // Send Data
        if (this.networks[index][0].data.length >= 60) {
          this.networks[index][0].data.shift()
        }
        if (this.networks[index][0].cacheData > 0) {
          const timeGap = this.networks[index][0].cacheTime == 0 ? 2 : el.time - this.networks[index][0].cacheTime
          this.networks[index][0].data.push(this.covertToKB((el.bytesSent - this.networks[index][0].cacheData) / timeGap))
        }
        this.networks[index][0].cacheData = el.bytesSent;
        this.networks[index][0].cacheTime = el.time;

        // RecvData
        if (this.networks[index][1].data.length >= 60) {
          this.networks[index][1].data.shift()
        }
        if (this.networks[index][1].cacheData > 0) {
          const timeGap = this.networks[index][1].cacheTime == 0 ? 2 : el.time - this.networks[index][1].cacheTime
          this.networks[index][1].data.push(this.covertToKB((el.bytesRecv - this.networks[index][1].cacheData) / timeGap))
        }
        this.networks[index][1].cacheData = el.bytesRecv;
        this.networks[index][1].cacheTime = el.time;
      });

      this.$refs.chart.updateSeries(this.networks[this.networkId])
      const upSpeed = this.networks[this.networkId][0].data[this.networks[this.networkId][0].data.length - 1]
      const downSpeed = this.networks[this.networkId][1].data[this.networks[this.networkId][1].data.length - 1]
      this.currentUpSpeed = isNaN(upSpeed) ? 0 : upSpeed
      this.currentDownSpeed = isNaN(downSpeed) ? 0 : downSpeed
    },
    covertToKB(bytes) {
      return (bytes / 1024).toFixed(0) > 0 ? (bytes / 1024).toFixed(0) : 0;
    }
  },
  sockets: {
    sys_net(data) {
      this.initNetwork = data.body.data
      this.buildDatas(this.initNetwork)
    },
    sys_hardware_status(data) {
      this.initNetwork = data.body.sys_net
      this.buildDatas(this.initNetwork)
    }
  }
}
</script>

<style lang="scss" scoped>
.network {
  position: relative;
  z-index: 10;

  .up {
    color: rgb(0, 143, 251);
  }

  .down {
    color: rgb(0, 227, 150);
  }

  .chart-container {
    height: 130px;
    overflow: hidden;
    margin: 0 -0.875rem;
  }
}
</style>

<style lang="scss">
.network {
  .netowrk-dropdown {
    .button {
      margin: 0;
      padding: 0;
      height: initial;
      background-color: transparent;
      font-weight: bold;
      font-size: 0.875rem;
      position: relative;
      z-index: 200;
      outline: none;
      border: 0;

      &:focus:not(:active) {
        box-shadow: 0 0 0 0 !important;
      }

      &:hover,
      &:active {
        outline: none;
        background-color: transparent;
      }

      span {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        max-width: 3rem;
      }
    }

    .dropdown-menu {
      min-width: 5rem;

      .dropdown-content {
        max-width: 7rem;
        border-radius: 10px;
        padding: 4px !important;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(1rem);

        .dropdown-divider {
          margin: 4px;
        }

        .dropdown-item {
          padding: 0.25rem 0.5rem 0.25rem 0.5rem;
          border-radius: 5px;
          transition: all 0.25s;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #fff;
          font-size: 0.75rem;
          margin-bottom: 0.25rem;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            background: rgba(0, 0, 0, 0.2) !important;
          }

          &.is-active {
            background: rgba(0, 0, 0, 0.2) !important;
          }
        }
      }
    }
  }
}
</style>