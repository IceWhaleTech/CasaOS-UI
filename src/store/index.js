/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-12-09 10:52:35
 * @Description: 
 * @FilePath: /CasaOS-UI/src/store/index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [createPersistedState()],
  state: {
    token: "",
    devIp: "192.168.2.115",
    serviceError: false,
    userinfo: {},
    sidebarOpen: false,
    syncthingKey: '',
    syncthingPort: '',
    searchEngine: '',
    siteLoading:true,
    widgetsSwitch: {
      clock: true,
      weather: true,
      cpu: true,
      disk: true
    }
  },
  mutations: {
    setToken(state, val) {
      state.token = val
    },
    setServiceError(state, val) {
      state.serviceError = val
    },
    setWidgets(state, val) {
      console.log(state.widgetsSwitch[val.k]);
      state.widgetsSwitch[val.k] = val.v;
    },
    changeUserInfo(state, val) {
      state.userinfo = val
    },
    changeSideBarState(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    closeSideBar(state) {
      state.sidebarOpen = false
    },
    changeSyncthingInfo(state, val) {
      state.syncthingKey = val.key
      state.syncthingPort = val.port
    },
    changeSearchEngine(state, val) {
      state.searchEngine = val
    },
    changeSiteLoading(state){
      state.siteLoading = false
    }
  },
  actions: {
  },
  modules: {
  }
})
