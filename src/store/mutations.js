/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-02 19:49:36
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-02 19:50:00
 * @FilePath: \CasaOS-UI\src\store\mutations.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
const mutations = {
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
}
export default mutations