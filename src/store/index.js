/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2022-03-10 16:22:37
 * @Description: 
 * @FilePath: \CasaOS-UI\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [createPersistedState()],
  state: {
    token: "",
    devIp: "192.168.2.10",
    devPort: "80",
    serviceError: false,
    userinfo: {},
    sidebarOpen: false,
    syncthingKey: '',
    syncthingPort: '',
    searchEngine: '',
    siteLoading: true,
    needInitialization: false,
    widgetsSwitch: {
      clock: true,
      weather: true,
      cpu: true,
      disk: true
    },
    hardwareInfo: {},
    // Files
    pasteFiles: "",
    operateObject: null,
    currentPath: "",
    isViewGird: true,
  },
  mutations: {
    setToken(state, val) {
      state.token = val
    },
    setServiceError(state, val) {
      state.serviceError = val
    },
    setWidgets(state, val) {
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
    changeSiteLoading(state) {
      state.siteLoading = false
    },
    changeInitialization(state, val) {
      state.needInitialization = val
    },
    changeHardwareInfo(state, val) {
      state.hardwareInfo = val
    },
    changePasteFiles(state, val) {
      state.pasteFiles = val
    },
    changeOperateObject(state, val) {
      state.operateObject = val
    },
    changeCurrentPath(state, val) {
      state.currentPath = val
    },
    changeViewGird(state, val) {
      state.isViewGird = val
    }
  },
  actions: {
  },
  modules: {
  }
})
