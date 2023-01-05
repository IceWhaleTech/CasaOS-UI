/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-02 19:48:26
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-04 19:31:50
 * @FilePath: \CasaOS-UI\src\store\state.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */
const state = {
    // User
    access_token: "",
    refresh_token: "",
    user: {
        avatar: "",
        created_at: "",
        description: "",
        email: "",
        id: 0,
        nickname: "",
        role: "",
        updated_at: "",
        username: ""
    },
    initKey: "", // Initialization key for reg

    sidebarOpen: false,

    // System Config
    searchEngine: '',
    searchEngineSwitch: true,
    existingAppsSwitch: true,
    recommendSwitch: true,
    rssSwitch: false,

    siteLoading: true,
    needInitialization: false,
    hardwareInfo: {},
    isMobile: false,

    // Files
    operateObject: null,
    currentPath: "",
    isViewGird: true,

    // Wallpaper
    wallpaperObject: {
        path: require('@/assets/background/default_wallpaper.jpg'),
        from: "Built-in" //Built-in, Upload, Files
    },

    // Samba and nfs data
    networkStorage: JSON.parse(localStorage.getItem('networkStorage')) || [],

    // shortcut data
    shortcutData: [],

    // public params
    device_id: "xxx",
    access_id: "dsdad",
    casaos_version: "1.0.0",
    casaos_channels: "1.0.0",
    casaos_lang: "zh",
    hw_id: "ddddd",
    hw_brand: "dsasdsa"
}
export default state
