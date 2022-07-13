/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-02 19:49:36
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-13 18:57:46
 * @FilePath: /CasaOS-UI/src/store/mutations.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
const mutations = {
    // User and tokens
    SET_ACCESS_TOKEN(state, token) {
        state.access_token = token
    },

    SET_REFRESH_TOKEN(state, token) {
        state.refresh_token = token
    },

    SET_USER(state, user) {
        state.user = user
    },

    SET_INIT_KEY(state, key) {
        state.init_key = key
    },

    // Site 
    SET_SITE_LOADING(state, loading) {
        state.siteLoading = loading
    },

    SET_NEED_INITIALIZATION(state, need) {
        state.needInitialization = need
    },

    SET_SIDEBAR_CLOSE(state) {
        state.sidebarOpen = false
    },

    SET_WALLPAPER(state, wallpaper) {
        localStorage.setItem('wallpaper', wallpaper.path)
        state.wallpaperObject = wallpaper
    },


    // ------------------------------------------------------------------

    setToken(state, val) {
        state.token = val
    },
    setServiceError(state, val) {
        state.serviceError = val
    },
    changeUserInfo(state, val) {
        state.userinfo = val
    },
    changeSideBarState(state) {
        state.sidebarOpen = !state.sidebarOpen
    },

    changeSyncthingInfo(state, val) {
        state.syncthingKey = val.key
        state.syncthingPort = val.port
    },
    // System Config
    changeSearchEngine(state, val) {
        state.searchEngine = val
    },
    changeSearchEngineSwitch(state, val) {
        state.searchEngineSwitch = val
    },
    changeRecommendSwitch(state, val) {
        state.recommendSwitch = val
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
    // Set if isMobile or not
    setIsMobile(state, val) {
        state.isMobile = val
    },

    
    setDefaultWallpaper(state) {
        state.wallpaperObject = {
            path: require('@/assets/background/default_wallpaper.jpg'),
            from: "Built-in" //Built-in, Upload, Files
        }
    }
}
export default mutations