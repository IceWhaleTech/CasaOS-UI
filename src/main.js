import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from '@/service/api.js'
import Buefy from 'buefy'
import VueSlider from 'vue-slider-component'
import "@/plugins/vee-validate";
import 'vue-slider-component/theme/default.css'
import './assets/scss/app.scss'
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

Vue.use(Buefy)
Vue.component('vue-slider', VueSlider);
Vue.component('lottie-animation', LottieAnimation);

Vue.config.productionTip = false
Vue.prototype.$api = api;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
