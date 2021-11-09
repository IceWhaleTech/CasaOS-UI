/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-11-09 16:49:07
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
    devIp: "192.168.2.217",
    serviceError: false,
    userinfo: {},
    sidebarOpen: false,
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
    }
  },
  actions: {
  },
  modules: {
  }
})
