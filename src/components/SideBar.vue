<!--
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-28 09:24:53
 * @Description: 
 * @FilePath: \CasaOS-UI\src\components\SideBar.vue
-->
<template>
  <div class="side-bar contextmenu-canvas mr-5" :class="{'open':sidebarOpen}" v-if="!isLoading">
    <vue-custom-scrollbar class="scroll-area contextmenu-canvas" :settings="scrollSettings">
      <div v-for="(item,index) in activeApps" :key="`widgets_${index}`">
        <component :is="item.app" v-if="checkShow(item.app.name,widgetsSettings)" :class="blockClass(index,activeApps)"></component>
      </div>
    </vue-custom-scrollbar>
    <settings v-model="widgetsSettings" @change="handleChange" class="ml-4 mr-4"></settings>
  </div>
</template>

<script>
import lowerFirst from 'lodash/lowerFirst'
import camelCase from 'lodash/camelCase'
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import Settings from '@/components/widgets/Settings.vue'
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
      isLoading: true,
      comps: [],
      apps: [],
      scrollSettings: {
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },
      widgetsSettings: []
    }
  },
  computed: {
    activeApps() {
      let newArray = this.widgetsSettings.map(item => {
        let obj = find(this.apps, function (o) { return o.app.name == item.name; });
        return obj;
      })
      return newArray
    },
    sidebarOpen() {
      return this.$store.state.sidebarOpen
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
    this.getConfig();
  },

  methods: {
    /**
     * @description: Get Widgets Configs
     * @return {*} void
     */
    getConfig() {
      const initData = this.getInitData();
      this.$api.info.widgetsConfig().then(res => {
        if (res.status === 200) {
          if (res.data === "") {
            this.saveData(initData);
            this.widgetsSettings = initData;
            this.isLoading = false;
          } else {
            this.diffAndCombineData(initData, res.data.data);
          }
        }
      })
    },
    diffAndCombineData(initData, remoteData) {
      let newData = initData.map(item => {
        let remoteItem = find(remoteData, el => el.name == item.name);
        if (remoteItem && item.name === remoteItem.name) {
          return {
            name: item.name,
            show: (item.show === remoteItem.show) ? item.show : remoteItem.show
          }
        } else {
          return {
            name: item.name,
            show: item.show
          }
        }
      })
      this.widgetsSettings = newData;
      if (!isEqual(newData, remoteData)) {
        this.saveData(newData);
      }
      this.isLoading = false;
    },
    /**
     * @description: Get Local widgets datas
     * @return {Array} array of widgets
     */
    getInitData() {
      return this.apps.map(item => {
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
    saveData(data) {
      this.$api.info.saveWidgetsConfig(data).then(res => {
        if (res.data.success == 200) {
          this.widgetsSettings = res.data.data;
        }
      })
    },

    handleChange(data) {
      this.widgetsSettings = data
      this.saveData(this.widgetsSettings)
    },
    checkShow(name) {
      let obj = find(this.widgetsSettings, o => { return name == o.name });
      return obj.show
    },
    blockClass(index, array) {
      return (index === array.length - 1) ? "last-block" : "";
    }
  },
}
</script>

<style lang="scss" >
.side-bar {
  position: fixed;
  z-index: 10;
  width: 18rem;
  height: calc(100% - 6rem);
  margin-left: -1rem;
  margin-right: -1rem;

  overflow: inherit !important;
}

.scroll-area {
  position: relative;
  padding: 0 1rem;
  max-height: calc(100% - 7.5rem);
  overflow-x: inherit !important;
  overflow-y: hidden !important;
}
.ps__thumb-x,
.ps__thumb-y {
  background-color: rgba(0, 0, 0, 0.6);
  width: 8px;
  right: 5px;
}
.ps:hover > .ps__rail-x,
.ps:hover > .ps__rail-y,
.ps--focus > .ps__rail-x,
.ps--focus > .ps__rail-y,
.ps--scrolling-x > .ps__rail-x,
.ps--scrolling-y > .ps__rail-y {
  opacity: 0.6;
  width: 8px;
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
  height: 8px;
}

.ps__rail-y:hover > .ps__thumb-y,
.ps__rail-y:focus > .ps__thumb-y,
.ps__rail-y.ps--clicking .ps__thumb-y {
  width: 8px;
}

@media screen and (max-width: 480px) {
  .side-bar {
    z-index: 20;
    left: 0rem;
    width: auto;
    margin: 0 1rem !important;
    transform: translateX(-100vw);
    transition: all 0.3s ease-in-out;
    &.open {
      width: calc(100% - 2rem);
      transform: translateX(0);
    }
  }
  .scroll-area {
    max-height: calc(100% - 6rem);
    height: 100% !important;
  }
}
</style>