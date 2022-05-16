/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-03-02 22:48:28
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-16 14:56:30
 * @FilePath: \CasaOS-UI\src\store\index.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */

import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [createPersistedState()],
  state: {
    token: "",
    devIp: "192.168.2.233",
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
    // Acc  Share
    isShareViewGird: true,
    currentSharePath: "",
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
    },
    changeShareViewGird(state, val) {
      state.isShareViewGird = val
    },
    changeCurrentSharePath(state, val) {
      state.currentSharePath = val
    },
  },
  actions: {
  },
  modules: {
  }
})
