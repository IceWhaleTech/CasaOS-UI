<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-11 19:01:40
 * @Description: 
 * @FilePath: /CasaOS-UI/src/components/SideBar.vue
-->
<template>
  <div class="side-bar mr-5">
    <!-- <transition name="fade">
      <clock v-if="switchs.clock"></clock>
    </transition>
    <cpu v-if="switchs.cpu"></cpu>
    <disks v-if="switchs.disk"></disks> -->
    <vue-custom-scrollbar class="scroll-area" :settings="scrollSettings">
      <component v-for="(item,index) in apps" :is="item.app" :key="`widgets_${index}`"></component>
      <settings></settings>
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import lowerFirst from 'lodash/lowerFirst'
import camelCase from 'lodash/camelCase'
import Settings from '@/components/Settings.vue'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"

const widgetsComponents = require.context(
  '@/widgets',
  false,
  /.vue$/
)


export default {
  name: 'side-bar',
  components: {
    Settings,
    vueCustomScrollbar
  },
  data() {
    return {
      comps: [],
      apps: [],
      scrollSettings: {
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },
      widgetsSettings: {}
    }
  },
  computed: {
    switchs() {
      return this.$store.state.widgetsSwitch
    }
  },
  created() {
    widgetsComponents.keys().forEach(fileName => {
      const componentName = lowerFirst(
        camelCase(
          fileName
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')
        )
      )
      this.comps.push(componentName);
      this.apps.push({ app: require(`@/widgets/${fileName.replace("./", "")}`).default })
    });
  },
  mounted() {
    //this.getConfig();
    console.log(this.getInitData());

  },

  methods: {
    /**
     * @description: Get Widgets Configs
     * @return {*} void
     */
    getConfig() {
      this.$api.info.widgetsConfig().then(res => {
        if (res.data.success == 200) {
          if (res.data === "") {
            //this.saveData()
          } else {
            this.widgetsSettings = res.data
            console.log(res.data);
          }
        }
      })
    },

    getInitData() {
      return this.apps.map(item => {
        //console.log(item);
        return {
          name: item.app.name,
          show: item.app.initShow
        }
      })
    },

    /**
     * @description: Save Widgets Configs
     * @return {*} void
     */
    saveData() {
      this.$api.info.saveWidgetsConfig(this.barData).then(res => {
        if (res.data.success == 200) {
          console.log(res);
        }
      })
    },
  },
}
</script>

<style>
.scroll-area {
  position: relative;
  margin: auto;
  height: calc(100vh - 6rem);
}
.ps:hover > .ps__rail-x,
.ps:hover > .ps__rail-y,
.ps--focus > .ps__rail-x,
.ps--focus > .ps__rail-y,
.ps--scrolling-x > .ps__rail-x,
.ps--scrolling-y > .ps__rail-y {
  opacity: 0.6;
}

.ps .ps__rail-x:hover,
.ps .ps__rail-y:hover,
.ps .ps__rail-x:focus,
.ps .ps__rail-y:focus,
.ps .ps__rail-x.ps--clicking,
.ps .ps__rail-y.ps--clicking {
  background-color: transparent;
  opacity: 0.6;
}
.ps__rail-x:hover > .ps__thumb-x,
.ps__rail-x:focus > .ps__thumb-x,
.ps__rail-x.ps--clicking .ps__thumb-x {
  height: 6px;
}

.ps__rail-y:hover > .ps__thumb-y,
.ps__rail-y:focus > .ps__thumb-y,
.ps__rail-y.ps--clicking .ps__thumb-y {
  width: 6px;
}
</style>