import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    token: "",
    devIp: "192.168.2.217",
    serviceError:false
  },
  mutations: {
    setToken(state, val) {
      state.token = val
    },
    setServiceError(state,val){
      state.serviceError = val
    }
  },
  actions: {
  },
  modules: {
  }
})
