/*
 * @Author: JerryK
 * @Date: 2021-09-22 14:24:43
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-02 19:23:45
 * @Description: 
 * @FilePath: \CasaOS-UI\src\main.js
 */
import 'intersection-observer'
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/plugins/i18n'
import api from '@/service/api.js'
import Buefy from 'buefy'
import VueFullscreen from 'vue-fullscreen'
import Vue2TouchEvents from 'vue2-touch-events'
import VueTour from 'vue-tour'
import VueSocketIOExt from 'vue-socket.io-extended';
const io = require("socket.io-client");
// Import Styles
import '@/assets/scss/app.scss'
import 'vue-tour/dist/vue-tour.css'
import VAnimateCss from 'v-animate-css';

api.info.getSocketPort().then(res => {
  const wsPort = res.data.data
  const devIp = process.env.VUE_APP_DEV_IP
  const devPort = process.env.VUE_APP_DEV_PORT
  const localhost = document.location.host
  const baseIp = process.env.NODE_ENV === "dev" ? `${devIp}` : `${localhost}`
  const baseURL = process.env.NODE_ENV === "dev" ? `${devIp}:${devPort}` : `${localhost}`
  const baseWsURL = process.env.NODE_ENV === "dev" ? `${devIp}` : `${localhost}`
  const wsURL = `ws://${baseWsURL}:${wsPort}`;

  const socket = io(wsURL, {
    transports: ['websocket', 'polling']
  });

  Vue.use(Buefy)
  Vue.use(VueFullscreen)
  Vue.use(VAnimateCss)
  Vue.use(Vue2TouchEvents)
  Vue.use(VueTour)
  Vue.use(VueSocketIOExt, socket);

  Vue.config.productionTip = false
  Vue.prototype.$api = api;
  Vue.prototype.$baseIp = baseIp;
  Vue.prototype.$baseURL = baseURL;
  new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
  }).$mount('#app')

})




