<!--
 * @Author: JerryK
 * @Date: 2021-12-06 13:52:11
 * @LastEditors: JerryK
 * @LastEditTime: 2021-12-06 15:54:55
 * @Description: 
 * @FilePath: /CasaOS-UI/src/widgets/Network.vue
-->
<template>
  <div class="widget has-text-white clock is-relative pb-1">
    <vue-apex-charts type="area" ref="chart" height="100" :options="lineChartSimple.chartOptions" :series="lineChartSimple.series" />
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
      lineChartSimple: {
        series: this.buildSeries(),
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
            width: 3,
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
    }, 3000)
  },

  methods: {
    updateCharts() {
      this.$api.info.allInfo().then(res => {
        if (res.data.success === 200) {
          //console.log(res.data.data);
          this.initChart(res.data.data.net)
        }
      })
    },

    initChart(netArray) {
      //console.log(netArray);
      for (let index = 0; index < netArray.length; index++) {
        this.seriesArray[index] = this.updateSeries(netArray[index], index);
      }
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
      return [
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
    },
    covertToKB(bytes) {
      return (bytes / 1024).toFixed(1);
    }
  },
}
</script>

<style>
</style>