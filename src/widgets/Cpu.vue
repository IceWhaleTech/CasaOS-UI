<template>
  <div class="widget has-text-white clock">
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
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'cpu',
  icon: "cog",
  title: "System Status",
  initShow: true,
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      timer: 0,
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
      }
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
  },
  methods: {
    updateCharts() {
      this.$api.info.allInfo().then(res => {
        if (res.data.success === 200) {
          this.cpuSeries = [res.data.data.cpu.percent]
          this.ramSeries = [res.data.data.mem.usedPercent]
        }
      })
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
}
</script>

<style>
</style>