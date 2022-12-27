/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2022/12/7 上午9:56
 * @FilePath: /CasaOS-UI/src/main.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
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
import VueSocialSharing from 'vue-social-sharing'
import VueSocketIOExt from 'vue-socket.io-extended';
import message_bus from '@/events/message_bus.js'

// Import Styles
import '@/assets/scss/app.scss'
import 'vue-tour/dist/vue-tour.css'
import VAnimateCss from 'v-animate-css';

const io = require("socket.io-client");

const isDev = process.env.NODE_ENV === 'dev';
const protocol = document.location.protocol
const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
const devIp = process.env.VUE_APP_DEV_IP
const devPort = process.env.VUE_APP_DEV_PORT
const localhost = document.location.host
const localhostName = document.location.hostname
const baseIp = isDev ? `${devIp}` : `${localhostName}`
const baseURL = isDev ? `${devIp}:${devPort}` : `${localhost}`
const wsURL = `${wsProtocol}//${baseURL}`

const socket = io(wsURL, {
    transports: ['websocket', 'polling'],
    path: '/v1/socketio/',
});

Vue.use(Buefy)
Vue.use(VueFullscreen)
Vue.use(VAnimateCss)
Vue.use(Vue2TouchEvents)
Vue.use(VueTour)
Vue.use(VueSocketIOExt, socket);
Vue.use(VueSocialSharing);

Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$baseIp = baseIp;
Vue.prototype.$baseURL = baseURL;
Vue.prototype.$protocol = protocol;
Vue.prototype.$wsProtocol = wsProtocol;

// Create an EventBus
Vue.prototype.$EventBus = new Vue();
Vue.prototype.$messageBus = message_bus;

new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app')





