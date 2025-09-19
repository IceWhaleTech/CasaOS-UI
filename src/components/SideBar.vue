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
      const showWidgets = this.widgetsSettings.filter((item) => {
        return item.show
      })
      const newArray = showWidgets.map((item) => {
        const obj = find(this.allApps, (o) => {
          return o.app.name === item.name
        })
        return obj
      }).filter(Boolean) // Remove any undefined items
      return newArray
    },
    sidebarOpen() {
      return this.$store.state.sidebarOpen
    },
    showWidgets() {
      return this.widgetsSettings.filter((item) => {
        return item.show
      })
    },
  },
  async created() {
    // Load local widgets
    this.loadLocalWidgets()
    
    // Load NPM widgets
    await this.loadNpmWidgets()
  },
  mounted() {
    this.getConfig()
    window.addEventListener('resize', this.handleResize)
  },

  methods: {
    /**
     * @description: Load local widgets from @/widgets directory
     * @return {*} void
     */
    loadLocalWidgets() {
      widgetsComponents.keys().forEach((fileName) => {
        const componentName = lowerFirst(
          camelCase(
            fileName
              .split('/')
              .pop()
              .replace(/\.\w+$/, ''),
          ),
        )
        this.comps.push(componentName)
        this.apps.push({ 
          app: require(`@/widgets/${fileName.replace('./', '')}`).default,
          source: 'local'
        })
      })
    },

    /**
     * @description: Load widgets from NPM packages
     * @return {Promise<void>}
     */
    async loadNpmWidgets() {
      if (!NPM_WIDGETS_CONFIG.length) return

      const loadPromises = NPM_WIDGETS_CONFIG.map(async (widgetConfig) => {
        try {
          // Dynamic import of the NPM package
          const module = await import(widgetConfig.package)
          
          // Get the component (could be default export or named export)
          let component
          if (widgetConfig.name && module[widgetConfig.name]) {
            component = module[widgetConfig.name]
          } else if (module.default) {
            component = module.default
          } else {
            throw new Error(`Component ${widgetConfig.name || 'default'} not found in package ${widgetConfig.package}`)
          }

          // Ensure component has required properties
          if (!component.name) {
            component.name = widgetConfig.componentName || widgetConfig.name
          }
          if (!component.title) {
            component.title = widgetConfig.title || component.name
          }
          if (!component.icon) {
            component.icon = widgetConfig.icon || 'extension-outline'
          }
          if (component.initShow === undefined) {
            component.initShow = widgetConfig.initShow !== undefined ? widgetConfig.initShow : true
          }

          // Register the component globally if needed
          if (widgetConfig.componentName) {
            this.$options.components[widgetConfig.componentName] = component
          }

          this.npmWidgets.push({
            app: component,
            source: 'npm',
            package: widgetConfig.package,
            config: widgetConfig
          })

          console.log(`Successfully loaded NPM widget: ${widgetConfig.package}`)
        } catch (error) {
          console.error(`Failed to load NPM widget ${widgetConfig.package}:`, error)
          this.failedNpmWidgets.push({
            ...widgetConfig,
            error: error.message
          })
        }
      })

      await Promise.allSettled(loadPromises)
    },

    /**
     * @description: Get Widgets Configs
     * @return {*} void
     */
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
        if (remoteItem && item.name === remoteItem.name) {
          return {
            name: item.name,
            show: (item.show === remoteItem.show) ? item.show : remoteItem.show,
            source: item.source || 'local' // Preserve source info
          }
        }
        else {
          return {
            name: item.name,
            show: item.show,
            source: item.source || 'local'
          }
        }
      })
      this.widgetsSettings = newData
      if (!isEqual(newData, remoteData)) {
        this.saveData(newData)
      }
      this.isLoading = false
      this.handleResize()
    },

    /**
     * @description: Get Local and NPM widgets data
     * @return {Array} array of widgets
     */
    getInitData() {
      return this.allApps.map((item) => {
        return {
          name: item.app.name,
          show: item.app.initShow,
          source: item.source || 'local',
          ...(item.package && { package: item.package })
        }
      })
    },

    /**
     * @description: Save Widgets Configs
     * @return {*} void
     */
    saveData(data) {
      this.$api.users.setCustomStorage(widgetsConfig, data).then((res) => {
        if (res.data.success === 200) {
          this.widgetsSettings = res.data.data
        }
      }).catch((error) => {
        console.error('Failed to save widget config:', error)
        // Still update local state even if save fails
        this.widgetsSettings = data
      })
    },

    handleChange(data) {
      this.widgetsSettings = data
      this.saveData(this.widgetsSettings)
    },

    handleResize() {
      const ww = window.innerWidth
      if (this.isLoading)
        return false
      const parentWidth = document.querySelector('.slider-content')?.offsetWidth
      if (!parentWidth) return false
      
      this.$nextTick(() => {
        const padding = ww <= 480 ? 0 : -16
        this.$refs.sidebar.style.width = `${parentWidth + padding}px`
      })
    },

    /**
     * @description: Get info about loaded widgets
     * @return {Object} Widget loading info
     */
    getWidgetInfo() {
      return {
        local: this.apps.length,
        npm: this.npmWidgets.length,
        failed: this.failedNpmWidgets.length,
        total: this.allApps.length,
        failedWidgets: this.failedNpmWidgets
      }
    },

    /**
     * @description: Reload a failed NPM widget
     * @param {Object} widgetConfig - Widget configuration
     * @return {Promise<boolean>} Success status
     */
    async reloadNpmWidget(widgetConfig) {
      try {
        const module = await import(widgetConfig.package)
        let component = module.default || module[widgetConfig.name]
        
        if (!component) {
          throw new Error(`Component not found in package ${widgetConfig.package}`)
        }

        // Setup component properties
        if (!component.name) component.name = widgetConfig.componentName || widgetConfig.name
        if (!component.title) component.title = widgetConfig.title || component.name
        if (!component.icon) component.icon = widgetConfig.icon || 'extension-outline'
        if (component.initShow === undefined) component.initShow = widgetConfig.initShow !== undefined ? widgetConfig.initShow : true

        this.npmWidgets.push({
          app: component,
          source: 'npm',
          package: widgetConfig.package,
          config: widgetConfig
        })

        // Remove from failed list
        this.failedNpmWidgets = this.failedNpmWidgets.filter(w => w.package !== widgetConfig.package)
        
        console.log(`Successfully reloaded NPM widget: ${widgetConfig.package}`)
        return true
      } catch (error) {
        console.error(`Failed to reload NPM widget ${widgetConfig.package}:`, error)
        return false
      }
    }
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