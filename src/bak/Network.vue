<!--
 * @Author: JerryK
 * @Date: 2021-12-06 13:52:11
 * @LastEditors: JerryK
 * @LastEditTime: 2021-12-23 18:53:14
 * @Description: 
 * @FilePath: /CasaOS-UI/src/widgets/Network.vue
-->
<template>
  <div class="widget has-text-white clock is-relative pb-1">
    <vue-apex-charts type="area" ref="chart" height="150" :options="lineChartSimple.chartOptions" :series="netSeries" />
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'network',
  icon: "lan",
  title: "Network Status",
  initShow: true,

  components: {
    VueApexCharts
  },
  data() {
    return {
      timer: 0,
      timeGap: 3,
      seriesArray: [],
      netSeries: [
        {
          name: 'Up',
          data: [0],
          cacheData: 0
        },
        {
          name: 'Down',
          data: [0],
          cacheData: 0
        }
      ],
      lineChartSimple: {
        series: this.netSeries,
        chartOptions: {
          chart: {
            zoom: {
              enabled: false,
            },
            toolbar: {
              show: false,
            },
            stacked: false,
            animations: {
              enabled: true,
              easing: 'linear',
              dynamicAnimation: {
                speed: 800
              }
            },
          },

          markers: {
            strokeWidth: 1,
            strokeOpacity: 1,
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

          },
          xaxis: {
            type: 'numeric',
            range: 60,
            labels: {
              show: false,
            },
            tooltip: {
              enabled: false
            }
          },
          yaxis: {
           
          },
          legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left'
          }
        },
      },
    }
  },

  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.updateCharts()
    this.timer = setInterval(() => {
      this.updateCharts()
    }, this.timeGap * 1000)
  },

  methods: {
    updateCharts() {
      this.$api.info.allInfo().then(res => {
        if (res.data.success === 200) {
          // console.log(res.data.data.net);
          this.initChart(res.data.data.net)
        }
      })

    },

    initChart(netArray) {
      let recData = netArray.reduce((total, item) => {
        return total + item.bytesRecv
      }, 0)
      let sendData = netArray.reduce((total, item) => {
        return total + item.bytesSent
      }, 0)
      if (this.netSeries[0].cacheData > 0) {
        this.netSeries[0].data.push(this.covertToKB((sendData - this.netSeries[0].cacheData) / this.timeGap))
      }

      this.netSeries[0].cacheData = sendData
      if (this.netSeries[1].cacheData > 0) {
        this.netSeries[1].data.push(this.covertToKB((recData - this.netSeries[1].cacheData) / this.timeGap))
      }
      this.netSeries[1].cacheData = recData
      // console.log(this.netSeries);
      this.$refs.chart.updateSeries(this.netSeries)
    },
    updateSeries(data, index) {
      let recvArr = []
      let sentArr = []
      let recvArrRef = []
      let sentArrRef = []
      if (this.seriesArray[index] != undefined) {
        recvArr = this.seriesArray[index][1].data
        sentArr = this.seriesArray[index][0].data
        recvArrRef = this.seriesArray[index][1].refData
        sentArrRef = this.seriesArray[index][0].refData
        recvArr.push(this.covertToKB(data.bytesRecv) - recvArrRef.slice(-1))
        sentArr.push(this.covertToKB(data.bytesSent) - sentArrRef.slice(-1))
      }
      recvArrRef.push(this.covertToKB(data.bytesRecv))
      sentArrRef.push(this.covertToKB(data.bytesSent))
      return this.buildSeries(sentArr, sentArrRef, recvArr, recvArrRef)
    },
    buildSeries(sentArr = [], sentArrRef = [], recvArr = [], recvArrRef = []) {
      let aa = [
        {
          name: 'Up',
          data: sentArr,
          refData: sentArrRef
        },
        {
          name: 'Down',
          data: recvArr,
          refData: recvArrRef
        }
      ]
      return aa
    },
    covertToKB(bytes) {
      return (bytes / 1024).toFixed(0);
    }
  },
}
</script>

<style>
</style>