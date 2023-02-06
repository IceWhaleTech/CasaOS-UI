/*
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-06 17:40:54
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
// import VueTour from 'vue-tour'
import VueSocialSharing from 'vue-social-sharing'
import VueSocketIOExt from 'vue-socket.io-extended';
import messageBus from '@/events/index.js'
// let messageBus = require('@/events/index.js');
// Import Styles
import '@/assets/scss/app.scss'
// import 'vue-tour/dist/vue-tour.css'
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
    path: '/v2/message_bus/socket.io/',
});

Vue.use(Buefy)
Vue.use(VueFullscreen)
Vue.use(VAnimateCss, {animateCSSPath: '/css/animate.min.css'});
Vue.use(Vue2TouchEvents)
// Vue.use(VueTour)
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
Vue.prototype.$messageBus = messageBus;

new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app')





