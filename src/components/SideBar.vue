<script>
import lowerFirst from 'lodash/lowerFirst'
import camelCase from 'lodash/camelCase'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import Settings from '@/components/widgets/Settings.vue'
import 'vue-custom-scrollbar/dist/vueScrollbar.css'

// Import your npm widget
import WeatherWidget from 'casaos-weather-widget'

// Load local widgets dynamically
const widgetsComponents = require.context('@/widgets', false, /.vue$/)
const widgetsConfig = 'widgets_config'

export default {
  name: 'SideBar',
  components: {
    Settings,
    VueCustomScrollbar: vueCustomScrollbar,
  },
  data() {
    return {
      isLoading: true,
      comps: [],
      apps: [],
      scrollSettings: {
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false,
      },
      widgetsSettings: [],
    }
  },
  computed: {
    activeApps() {
      const showWidgets = this.widgetsSettings.filter(item => item.show)
      return showWidgets.map(item => find(this.apps, o => o.app.name === item.name))
    },
    sidebarOpen() {
      return this.$store.state.sidebarOpen
    },
    showWidgets() {
      return this.widgetsSettings.filter(item => item.show)
    },
  },
  created() {
    // Add npm widget
    this.apps.push({
      app: {
        ...WeatherWidget,
        name: 'WeatherWidget',
        initShow: true
      }
    })
    this.comps.push('WeatherWidget')

    // Add local widgets
    widgetsComponents.keys().forEach(fileName => {
      const componentName = lowerFirst(
        camelCase(fileName.split('/').pop().replace(/\.\w+$/, ''))
      )
      const localWidget = require(`@/widgets/${fileName.replace('./', '')}`).default
      this.comps.push(componentName)
      this.apps.push({ app: localWidget })
    })
  },
  mounted() {
    this.getConfig()
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    getConfig() {
      const initData = this.getInitData()
      this.$api.users.getCustomStorage(widgetsConfig).then(res => {
        if (res.status === 200) {
          if (!res.data) {
            this.saveData(initData)
            this.widgetsSettings = initData
            this.isLoading = false
            this.handleResize()
          } else {
            this.diffAndCombineData(initData, res.data.data)
          }
        }
      })
    },
    diffAndCombineData(initData, remoteData) {
      const newData = initData.map(item => {
        const remoteItem = find(remoteData, el => el.name === item.name)
        return {
          name: item.name,
          show: remoteItem ? remoteItem.show : item.show
        }
      })
      this.widgetsSettings = newData
      if (!isEqual(newData, remoteData)) this.saveData(newData)
      this.isLoading = false
      this.handleResize()
    },
    getInitData() {
      return this.apps.map(item => ({
        name: item.app.name,
        show: item.app.initShow ?? true
      }))
    },
    saveData(data) {
      this.$api.users.setCustomStorage(widgetsConfig, data).then(res => {
        if (res.data.success === 200) this.widgetsSettings = res.data.data
      })
    },
    handleChange(data) {
      this.widgetsSettings = data
      this.saveData(this.widgetsSettings)
    },
    handleResize() {
      if (this.isLoading) return
      const ww = window.innerWidth
      const parentWidth = document.querySelector('.slider-content').offsetWidth
      this.$nextTick(() => {
        const padding = ww <= 480 ? 0 : -16
        this.$refs.sidebar.style.width = `${parentWidth + padding}px`
      })
    },
  },
}
</script>

<template>
  <div v-if="!isLoading" ref="sidebar" :class="{ open: sidebarOpen }" class="side-bar contextmenu-canvas">
    <VueCustomScrollbar :settings="scrollSettings" class="scroll-area contextmenu-canvas">
      <div v-for="(item, index) in activeApps" :key="`widgets_${index}`">
        <component :is="item.app" :class="{ 'last-block': index === activeApps.length - 1 }" />
      </div>
    </VueCustomScrollbar>
    <Settings v-model="widgetsSettings" :class="{ 'mt-4': activeApps.length > 0 }" @change="handleChange" />
  </div>
</template>

<style lang="scss">
.side-bar {
    z-index: 10;
    // height: calc(100vh - 6rem);
    height: calc(var(--vh, 1vh) * 100 - 6rem);
    overflow: inherit !important;
    position: fixed;

    @include until(480px) {
        z-index: 20;
        left: 0rem;
        width: auto;
        margin: 0 0 0 1rem !important;
        transform: translateX(-100vw);
        transition: all 0.3s ease-in-out;

        &.open {
            transform: translateX(0);
        }
    }
}

.scroll-area {
    position: relative;
    padding: 0 16px 0 0;
    margin-right: -16px;
    max-height: calc(100% - 7.5rem);
    overflow-x: inherit !important;
    overflow-y: hidden !important;

    @include until(480px) {
        max-height: calc(100% - 4rem);
        height: 100% !important;
    }
}

.ps__thumb-x,
.ps__thumb-y {
    background-color: rgba(255, 255, 255, 0.4);
    width: 8px;
    right: 5px;
}

.ps:hover>.ps__rail-x,
.ps:hover>.ps__rail-y,
.ps--focus>.ps__rail-x,
.ps--focus>.ps__rail-y,
.ps--scrolling-x>.ps__rail-x,
.ps--scrolling-y>.ps__rail-y {
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

.ps__rail-x:hover>.ps__thumb-x,
.ps__rail-x:focus>.ps__thumb-x,
.ps__rail-x.ps--clicking .ps__thumb-x {
    height: 8px;
}

.ps__rail-y:hover>.ps__thumb-y,
.ps__rail-y:focus>.ps__thumb-y,
.ps__rail-y.ps--clicking .ps__thumb-y {
    width: 8px;
}
</style>
