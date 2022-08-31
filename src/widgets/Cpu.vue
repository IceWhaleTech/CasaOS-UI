<template>
  <div class="widget has-text-white cpu">
    <div class="blur-background"></div>
    <div class="widget-content">
      <!-- Header Start -->
      <div class="widget-header is-flex">
        <div class="widget-title is-flex-grow-1">
          {{ $t('Performance') }}
        </div>
        <div class="widget-icon-button is-flex-shrink-0" @click="showMoreInfo">
          <b-icon pack="casa" icon="arrow-right" size="is-20" :class="{'open':showMore}" class="arrow-btn"></b-icon>
        </div>
      </div>
      <!-- Header End -->

      <div class="columns is-mobile ">
        <div class="column is-half has-text-centered">
          <apexchart type="radialBar" :height="barHeight" :options="chartOptions" :series="cpuSeries"></apexchart>
          <p class="is-size-12px two-line margin-[-10px]">CPU<br/>
            <span class="is-size-14px">{{power.toFixed(1)}}W / {{temperature}}°C</span>
          </p>
        </div>
        <div class="column is-half has-text-centered">
          <apexchart type="radialBar" :height="barHeight" :options="chartOptions" :series="ramSeries"></apexchart>
          <p class="is-size-12px two-line margin-[-10px]">RAM <br/>
            <span class="is-size-14px">{{totalMemory | renderSize}}</span>
          </p>
        </div>
      </div>
      <div v-show="showMore">
        <div class="more-info pt-1 pb-1">
          <b-tabs v-model="activeTab">
            <b-tab-item label="CPU">
              <div v-for="(item,index) in containerCpuList" :key="item.title+index+'-cpu'">
                <div class="is-flex is-size-7 is-align-items-center mb-2" v-if="!isNaN(item.usage)">
                  <div class="is-flex-grow-1 is-flex is-align-items-center">
                    <b-image :lazy="false" :src="item.icon" :src-fallback="require('@/assets/img/app/default.png')" class="is-16x16 mr-2 is-flex-shrink-0"></b-image>
                    <span class="one-line">{{item.title}}</span>
                  </div>
                  <div class=" is-flex-shrink-0">{{item.usage}}%</div>
                </div>
              </div>
            </b-tab-item>

            <b-tab-item label="RAM">
              <div v-for="(item,index) in containerRamList" :key="item.title+index+'-rem'">
                <div class="is-flex is-size-7 is-align-items-center mb-2" v-if="!isNaN(item.usage)">
                  <div class="is-flex-grow-1 is-flex is-align-items-center">
                    <b-image :src="item.icon" :src-fallback="require('@/assets/img/app/default.png')" class="is-16x16 mr-2 is-flex-shrink-0"></b-image>
                    <span class="one-line">{{item.title}}</span>
                  </div>
                  <div class=" is-flex-shrink-0">{{item.usage | renderSize}}</div>
                </div>
              </div>
            </b-tab-item>

          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import VueApexCharts from 'vue-apexcharts'
import smoothReflow from 'vue-smooth-reflow'
import orderBy from 'lodash/orderBy';
import has from 'lodash/has';
import slice from 'lodash/slice';
import { mixin } from '../mixins/mixin';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'cpu',
  icon: "cog",
  title: "System Status",
  initShow: true,
  mixins: [smoothReflow, mixin],
  components: {
    apexchart: () => import("vue-apexcharts"),
  },

  data() {
    return {
      power:0,
      tempTime:0,
      tempValue:0,
      temperature:0,
      timmer: null,
      activeTab: 0,
      showMore: false,
      cpuCores: 0,
      totalMemory: 0,
      barHeight: 132,
      cpuSeries: [0],
      ramSeries: [0],
      chartOptions: {
        chart: {
          type: 'radialBar',
          width: '100%'
        },
        grid: {
          padding: {
            left: 0,
            right: 0,
            top: -6,
            bottom: -15
          }
        },
        states: {
          hover: {
            filter: {
              type: 'none',
            }
          },
          active: {
            filter: {
              type: 'none',
            }
          },
        },
        plotOptions: {

          radialBar: {
            startAngle: -130,
            endAngle: 130,
            offsetX: 0,
            offsetY: 0,

            hollow: {
              margin: 0,
              size: '66%',
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: 'front',
              dropShadow: {
                enabled: false,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24
              }
            },
            track: {
              background: '#fff',
              strokeWidth: '100%',
              margin: -4, // margin is in pixels
              opacity: 0.3,

            },
            dataLabels: {
              name: {
                color:'#fff',
                offsetY: 30
              },
              // show: true,
              value: {
                formatter: function (val) {
                  return parseInt(val) + "%";
                },
                offsetY: -10,
                color: '#fff',
                fontSize: '20px',
                weight:'400',
                show: true,
              }
            },

          }
        },
        fill: {
          type: 'image',
          image: {
            src: [require('@/assets/img/widgets/gradient.png')],

          }
        },
        stroke: {
          lineCap: 'round'
        },
        labels: [''],
      },

      containerCpuList: [],
      containerRamList: []
    }
  },
  async created() {
    this.cpuCores = this.$store.state.hardwareInfo.cpu.num
    this.totalMemory = this.$store.state.hardwareInfo.mem.total
    this.updateCharts(this.$store.state.hardwareInfo)
    this.power = this.$store.state.hardwareInfo.cpu.power.value/this.$store.state.hardwareInfo.cpu.power.timestamp/1000000
    this.temperature = this.$store.state.hardwareInfo.cpu.temperature
    this.tempTime = this.$store.state.hardwareInfo.cpu.power.timestamp
    this.tempValue = this.$store.state.hardwareInfo.cpu.power.value
    this.getDockerUsage()
    this.timer = setInterval(() => {
      if (this.showMore) {
        this.getDockerUsage()
      }
    }, 1000)
  },
  mounted() {
    this.$smoothReflow({
      el: '.widget',
      property: ['height'],
    })
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    /**
     * @description: Update cpu and memory usage
     * @param {*}
     * @return {*} void
     */
    updateCharts(hardwareInfo) {
      this.cpuSeries = [hardwareInfo.cpu.percent]
      this.ramSeries = [hardwareInfo.mem.usedPercent]
      if (this.showMore) {
        this.getDockerUsage()
      }
    },
    /**
     * @description: Get Docker apps cpu and memory usage
     * @param {*}
     * @return {*} void
     */
    getDockerUsage() {
      this.$api.container.getHardwareUsage().then(res => {
        let id = 0
        this.containerCpuList = res.data.data.map(item => {
          let usage = 0;
          if (item.previous == null) {
            usage = 0;
          } else {

            // Look at here  https://docs.docker.com/engine/api/v1.41/#operation/ContainerStats

            const cpu_delta = item.data.cpu_stats.cpu_usage.total_usage - item.previous.cpu_stats.cpu_usage.total_usage
            const system_cpu_delta = item.data.cpu_stats.system_cpu_usage - item.previous.cpu_stats.system_cpu_usage + 1
            // const number_cpus = item.data.cpu_stats.online_cpus
            usage = Math.floor((cpu_delta / system_cpu_delta) * 1000) / 10
          }
          id++
          return {
            id: id,
            usage: isNaN(usage) || (usage < 0) ? 0 : usage,
            icon: item.icon,
            title: item.title
          };
        })

        this.containerRamList = res.data.data.map(item => {
          let cache = 0
          let id = 0
          if (has(item.data.memory_stats.stats, 'inactive_file')) {
            cache = item.data.memory_stats.stats.inactive_file
          } else {
            if (has(item.data.memory_stats.stats, 'cache')) {
              cache = item.data.memory_stats.stats.cache
            } else if (has(item.data.memory_stats.stats, 'total_inactive_file')) {
              cache = item.data.memory_stats.stats.total_inactive_file
            }
          }
          const used_memory = ("stats" in item.data.memory_stats) ? (item.data.memory_stats.usage - cache) : NaN
          id++
          return {
            id: id,
            usage: isNaN(used_memory) ? 0 : used_memory,
            icon: item.icon,
            title: item.title
          };
        })
        this.containerCpuList = slice(orderBy(this.containerCpuList, ['usage'], ['desc']), 0, 8)
        this.containerRamList = slice(orderBy(this.containerRamList, ['usage'], ['desc']), 0, 8)
      })
    },

    /**
     * @description: Toggle more info
     * @param {*}
     * @return {*} void
     */
    showMoreInfo() {
      this.showMore = !this.showMore;
    }
  },
  sockets: {
    sys_cpu(data) {
      this.cpuCores = data.body.data.num
      this.cpuSeries = [data.body.data.percent]
      if (this.showMore) {
        this.getDockerUsage()
      }
    },
    sys_mem(data) {
      this.totalMemory = data.body.data.total
      this.ramSeries = [data.body.data.usedPercent]
    },
    sys_hardware_status(data) {
      // CPU
      this.cpuCores = data.body.sys_cpu.num
      this.cpuSeries = [data.body.sys_cpu.percent]

      // power temperature
      this.power = (data.body.sys_cpu.power.value - this.tempValue)/(data.body.sys_cpu.power.timestamp - this.tempTime)/1000000
      this.tempTime = data.body.sys_cpu.power.timestamp
      this.tempValue = data.body.sys_cpu.power.value
      this.temperature = data.body.sys_cpu.temperature

      // Memory
      this.totalMemory = data.body.sys_mem.total
      this.ramSeries = [data.body.sys_mem.usedPercent]
    }
  }


}
</script>

<style lang="scss">
.widget {
  &.cpu {
    .tabs {
      ul {
        border-bottom: 1px solid transparent;

        li {
          font-size: 0.875rem;

          &:first-child {
            a {
              margin-left: 0;
            }
          }

          a {
            color: #fff !important;
            border-bottom: transparent 2px solid !important;
            padding: 0.5rem 0 0rem 0;
            margin: 0 0.5rem;
          }

          &.is-active {
            a {
              font-weight: 700;
              border-bottom: #fff 2px solid !important;
            }
          }
        }
      }
    }
    .arrow-btn {
      transition: all 0.3s;
      &.open {
        transform: rotate(90deg);
      }
    }

    .more-info {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
