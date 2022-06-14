/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-06-02 19:48:26
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-14 13:08:46
 * @FilePath: \CasaOS-UI\src\store\state.js
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
    hardwareInfo: {},
    isMobile:false,
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