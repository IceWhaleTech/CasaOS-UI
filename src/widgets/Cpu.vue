<template>
  <div class="widget has-text-white clock is-relative pb-1">
    <div class="arrow-btn" @click="showMoreInfo">
      <b-icon icon="chevron-right" :class="{'open':showMore}"></b-icon>
    </div>

    <div class="columns is-mobile ">
      <div class="column is-half has-text-centered">
        <apexchart type="radialBar" :height="barHeight" :options="chartOptions" :series="cpuSeries"></apexchart>
        <p class="is-size-6-5">CPU</p>
      </div>
      <div class="column is-half has-text-centered">
        <apexchart type="radialBar" :height="barHeight" :options="chartOptions" :series="ramSeries"></apexchart>
        <p class="is-size-6-5">RAM</p>
      </div>
    </div>
    <div v-if="showMore">
      <div class="more-info pt-3 pb-1">
        <b-tabs v-model="activeTab">
          <b-tab-item label="CPU">
            <div v-for="(item,index) in containerCpuList" :key="index+'-cpu'">
              <div class="is-flex is-size-7 is-align-items-center mb-2" v-if="!isNaN(item.usage)">
                <div class="is-flex-grow-1 is-flex is-align-items-center">
                  <b-image :src="item.icon" :src-fallback="require('@/assets/img/default.png')" webp-fallback=".jpg" class="is-16x16 mr-2"></b-image>
                  <span>{{item.title}}</span>
                </div>
                <div>{{item.usage}}%</div>
              </div>
            </div>

          </b-tab-item>

          <b-tab-item label="RAM">
            <div v-for="(item,index) in containerRamList" :key="index+'-rem'">
              <div class="is-flex is-size-7 is-align-items-center mb-2" v-if="!isNaN(item.usage)">
                <div class="is-flex-grow-1 is-flex is-align-items-center">
                  <b-image :src="item.icon" :src-fallback="require('@/assets/img/default.png')" webp-fallback=".jpg" class="is-16x16 mr-2"></b-image>
                  <span>{{item.title}}</span>
                </div>
                <div>{{item.usage | renderSize}}</div>
              </div>
            </div>

          </b-tab-item>

        </b-tabs>
      </div>
    </div>

  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import smoothReflow from 'vue-smooth-reflow'
import orderBy from 'lodash/orderBy';
export default {
  name: 'cpu',
  icon: "cog",
  title: "System Status",
  initShow: true,
  mixins: [smoothReflow],
  components: {
    apexchart: VueApexCharts,
  },

  data() {
    return {
      timer: 0,
      activeTab: 0,
      showMore: false,
      barHeight: 120,
      cpuSeries: [0],
      ramSeries: [0],
      chartOptions: {
        chart: {
          type: 'radialBar',
          width: '100%'
        },
        colors: ["#01FFC2"],
        grid: {
          padding: {
            left: 0,
            right: 0,
            top: -8,
            bottom: -10
          }
        },
        plotOptions: {
          radialBar: {
            startAngle: 0,
            endAngle: 360,
            offsetX: 0,
            offsetY: 0,
            hollow: {
              margin: 0,
              size: '60%',
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: 'front',
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24
              }
            },
            track: {
              background: '#fff',
              strokeWidth: '100%',
              margin: 0, // margin is in pixels
              opacity: 0.4,
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35
              }
            },

            dataLabels: {
              show: true,
              value: {
                formatter: function (val) {
                  return parseInt(val) + "%";
                },
                offsetY: -10,
                color: '#fff',
                fontSize: '18px',
                show: true,
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'diagonal2',
            shadeIntensity: 0.5,
            gradientToColors: ['#06FF03'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
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
  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.updateCharts()
    this.timer = setInterval(() => {
      this.updateCharts()
    }, 2000)

    this.$smoothReflow({
      el: '.widget',
      property: ['height'],
    })
  },
  methods: {
    updateCharts() {
      this.$api.info.allInfo().then(res => {
        if (res.data.success === 200) {
          this.cpuSeries = [res.data.data.cpu.percent]
          this.ramSeries = [res.data.data.mem.usedPercent]
        }
      })

      this.$api.app.getAppUsage().then(res => {
        this.containerCpuList = res.data.data.map(item => {
          let usage = 0;
          if (item.pre == null) {
            usage = 0;
          } else {
            const cpu_delta = item.data.cpu_stats.cpu_usage.total_usage - item.pre.cpu_stats.cpu_usage.total_usage
            const system_cpu_delta = item.data.cpu_stats.system_cpu_usage - item.pre.cpu_stats.system_cpu_usage + 1
            const number_cpus = item.data.cpu_stats.online_cpus
            usage = ((cpu_delta / system_cpu_delta) * number_cpus * 100).toFixed(1)
          }
          return {
            usage: usage,
            icon: item.icon,
            title: item.title
          };
        })

        this.containerRamList = res.data.data.map(item => {
          let cache = (item.data.memory_stats.stats.cache == undefined) ? item.data.memory_stats.stats.total_inactive_file : item.data.memory_stats.stats.cache
          cache = (cache == undefined) ? item.data.memory_stats.stats.inactive_file : cache
          const used_memory = ("stats" in item.data.memory_stats) ? (item.data.memory_stats.usage - cache) : NaN
          return {
            usage: used_memory,
            icon: item.icon,
            title: item.title
          };
        })
        this.containerCpuList = orderBy(this.containerCpuList, ['usage'], ['desc'])
        this.containerRamList = orderBy(this.containerRamList, ['usage'], ['desc'])
      })
    },
    showMoreInfo() {
      this.showMore = !this.showMore;
    }
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
  }
}
</script>

<style>
</style>