<script>
import lowerFirst from 'lodash/lowerFirst'
import camelCase from 'lodash/camelCase'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import Settings from '@/components/widgets/Settings.vue'
import 'vue-custom-scrollbar/dist/vueScrollbar.css'

const widgetsComponents = require.context(
  '@/widgets',
  false,
  /.vue$/,
)

const widgetsConfig = 'widgets_config'

// Configuration for NPM widgets
const NPM_WIDGETS_CONFIG = [
  // Example configurations - add your npm widget packages here
  // {
  //   package: '@your-org/weather-widget',
  //   name: 'WeatherWidget',
  //   componentName: 'weather',
  //   title: 'Weather',
  //   icon: 'weather-outline',
  //   initShow: true
  // },
  // {
  //   package: 'some-calendar-widget',
  //   name: 'CalendarWidget', 
  //   componentName: 'calendar',
  //   title: 'Calendar',
  //   icon: 'calendar-outline',
  //   initShow: false
  // }
]

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
      npmWidgets: [],
      failedNpmWidgets: [],
      scrollSettings: {
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false,
      },
      widgetsSettings: [],
    }
  },
  computed: {
    allApps() {
      return [...this.apps, ...this.npmWidgets]
    },
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
      this.$api.users.getCustomStorage(widgetsConfig).then((res) => {
        if (res.status === 200) {
          if (res.data === '') {
            this.saveData(initData)
            this.widgetsSettings = initData
            this.isLoading = false
            this.handleResize()
          }
          else {
            this.diffAndCombineData(initData, res.data.data)
          }
        }
      }).catch((error) => {
        console.error('Failed to load widget config:', error)
        // Fallback to init data if API fails
        this.widgetsSettings = initData
        this.isLoading = false
        this.handleResize()
      })
    },

    diffAndCombineData(initData, remoteData) {
      const newData = initData.map((item) => {
        const remoteItem = find(remoteData, el => el.name === item.name)
        return {
          name: item.name,
          show: remoteItem ? remoteItem.show : item.show
        }
      })
      this.widgetsSettings = newData
      if (!isEqual(newData, remoteData)) {
        this.saveData(newData)
      }
      this.isLoading = false
      this.handleResize()
    },
    getInitData() {
      return this.apps.map(item => ({
        name: item.app.name,
        show: item.app.initShow ?? true
      }))
    },

    /**
     * @description: Save Widgets Configs
     * @return {*} void
     */
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
        <component 
          :is="item.app" 
          :class="{ 'last-block': index === activeApps.length - 1 }"
          :data-source="item.source"
          :data-package="item.package" 
        />
      </div>
      
      <!-- Debug info for development (remove in production) -->
      <div v-if="$store.state.debug && failedNpmWidgets.length > 0" class="failed-widgets-debug">
        <h4>Failed NPM Widgets:</h4>
        <ul>
          <li v-for="widget in failedNpmWidgets" :key="widget.package">
            {{ widget.package }}: {{ widget.error }}
            <button @click="reloadNpmWidget(widget)">Retry</button>
          </li>
        </ul>
      </div>
    </VueCustomScrollbar>
    <Settings 
      v-model="widgetsSettings" 
      :class="{ 'mt-4': activeApps.length > 0 }" 
      :widget-info="getWidgetInfo()"
      @change="handleChange" 
    />
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

.failed-widgets-debug {
    padding: 1rem;
    margin-top: 1rem;
    background: rgba(255, 0, 0, 0.1);
    border-radius: 8px;
    font-size: 0.875rem;

    h4 {
        margin-bottom: 0.5rem;
        color: #ff6b6b;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        
        button {
            margin-left: 0.5rem;
            padding: 0.25rem 0.5rem;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.75rem;

            &:hover {
                background: #0056b3;
            }
        }
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