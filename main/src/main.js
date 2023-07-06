/*
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-06 17:40:54
 * @FilePath: /CasaOS-UI/src/main.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

import 'intersection-observer'
import Vue     from 'vue'
import App     from '@/App.vue'
import router  from '@/router'
import store   from '@/store'
import i18n    from '@/plugins/i18n'
import api     from '@/service/api.js'
import openAPI from '@/service/index.js'
import {
	Icon,
	Field,
	Input,
	Tooltip,
	Dropdown,
	Image,
	Button,
	Switch,
	Select,
	Checkbox,
	Modal,
	Tabs,
	Toast,
	Tag,
	Loading,
	Progress,
	Autocomplete,
	Taginput,
	Upload,
	Notification,
	Dialog,
	Message
}              from 'buefy/src/index.js'
import 'buefy/dist/buefy.css'

Vue.use(Icon)
Vue.use(Field)
Vue.use(Input)
Vue.use(Tooltip)
Vue.use(Dropdown)
Vue.use(Image)
Vue.use(Button)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Checkbox)
Vue.use(Modal)
Vue.use(Tabs)
Vue.use(Toast)
Vue.use(Tag)
Vue.use(Loading)
Vue.use(Progress)
Vue.use(Autocomplete)
Vue.use(Taginput)
Vue.use(Upload)
Vue.use(Notification)
Vue.use(Dialog)
Vue.use(Message)

import VueFullscreen    from 'vue-fullscreen'
import Vue2TouchEvents  from 'vue2-touch-events'
import VueSocialSharing from 'vue-social-sharing'
import VueSocketIOExt   from 'vue-socket.io-extended';
import messageBus       from '@/events/index.js'

import '@/assets/scss/app.scss'
import VAnimateCss      from 'v-animate-css';

const io = require("socket.io-client");

const isDev = process.env.NODE_ENV === 'dev';
const protocol = document.location.protocol
const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
const devIp = process.env.VUE_APP_DEV_IP
const devPort = process.env.VUE_APP_DEV_PORT
const localhost = document.location.host
const localhostName = document.location.hostname
const baseHostname = isDev ? `${devIp}` : `${localhostName}`
const baseURL = isDev ? `${devIp}:${devPort}` : `${localhost}`
const wsURL = `${wsProtocol}//${baseURL}`

const socket = io(wsURL, {
	transports: ['websocket', 'polling'],
	path: '/v2/message_bus/socket.io/',
});

Vue.use(VueFullscreen)
Vue.use(VAnimateCss, {animateCSSPath: '/css/animate.min.css'});
Vue.use(Vue2TouchEvents)
Vue.use(VueSocketIOExt, socket);
Vue.use(VueSocialSharing);

Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$openAPI = openAPI;
Vue.prototype.$baseHostname = baseHostname;
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

window.info = {
	version: MAIN_APP_VERSION_ID,
	built: BUILT_TIME,
};





