import process from 'node:process'

import App from '@/App.vue'
import messageBus from '@/events/index.js'
import i18n from '@/plugins/i18n'
import router from '@/router'
import api from '@/service/api.js'
import openAPI from '@/service/index.js'
import store from '@/store'
import Buefy from 'buefy'

import io from 'socket.io-client'
import VAnimateCss from 'v-animate-css'
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'

import VueDOMPurifyHTML from 'vue-dompurify-html'
import VueFullscreen from 'vue-fullscreen'
import VueSocialSharing from 'vue-social-sharing'
import VueSocketIOExt from 'vue-socket.io-extended'
import 'intersection-observer'

import '@/assets/scss/app.scss'

const isDev = process.env.NODE_ENV === 'dev'
const protocol = document.location.protocol
const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
const devIp = process.env.VUE_APP_DEV_IP
const devPort = process.env.VUE_APP_DEV_PORT
const localhost = document.location.host
const localhostName = document.location.hostname
const baseIp = isDev ? `${devIp}` : `${localhostName}`
const baseURL = isDev ? `${devIp}:${devPort}` : `${localhost}`

const socket = io({
  transports: ['websocket', 'polling'],
  path: '/v2/message_bus/socket.io/',
})

Vue.use(Buefy)
Vue.use(VueFullscreen)
Vue.use(VAnimateCss, { animateCSSPath: '/css/animate.min.css' })
Vue.use(Vue2TouchEvents)
Vue.use(VueSocketIOExt, socket)
Vue.use(VueSocialSharing)
Vue.use(VueDOMPurifyHTML, {
  default: {
    ALLOWED_ATTR: ['target', 'href'],
  },
})

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$openAPI = openAPI
Vue.prototype.$baseIp = baseIp
Vue.prototype.$baseURL = baseURL
Vue.prototype.$protocol = protocol
Vue.prototype.$wsProtocol = wsProtocol

// Create an EventBus
Vue.prototype.$EventBus = new Vue()
Vue.prototype.$messageBus = messageBus

new Vue({
  router,
  i18n,
  store,
  render: h => h(App),
}).$mount('#app')
