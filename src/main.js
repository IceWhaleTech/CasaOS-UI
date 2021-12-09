/*
 * @Author: JerryK
 * @Date: 2021-09-22 14:24:43
 * @LastEditors: JerryK
 * @LastEditTime: 2021-12-07 12:09:51
 * @Description: 
 * @FilePath: /CasaOS-UI/src/main.js
 */
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import i18n from '@/plugins/i18n'
import api from '@/service/api.js'
import Buefy from 'buefy'
import VueFullscreen from 'vue-fullscreen'
// import VueTour from 'vue-tour'
import '@/assets/scss/app.scss'
// import 'vue-tour/dist/vue-tour.css'



import VAnimateCss from 'v-animate-css';
Vue.use(Buefy)
Vue.use(VueFullscreen)
Vue.use(VAnimateCss)
// Vue.use(VueTour)

Vue.config.productionTip = false
Vue.prototype.$api = api;
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app') 
