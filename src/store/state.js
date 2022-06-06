/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-02 19:48:26
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-02 19:48:54
 * @FilePath: \CasaOS-UI\src\store\states.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
const state = {
    token: "",
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
    // Conenct
    isShareViewGird: true,
    currentSharePath: "",
}
export default state