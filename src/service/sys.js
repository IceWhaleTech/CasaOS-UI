/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-21 00:55:42
 * @Description: System HardWare Info API
 * @FilePath: /CasaOS-UI/src/service/sys.js
 */
import {api} from "./service.js";
import axios from "axios";

const PREFIX = "/sys"

const sys = {

    // Get websocket port
    getSocketPort() {
        return api.get(`${PREFIX}/socket-port`);
    },

    // Check if need init
    guideCheck() {
        return api.get(`${PREFIX}/state`);
    },

    // check system version
    getVersion() {
        return api.get(`${PREFIX}/version`);
    },

    // Hardware Info
    hardwareInfo() {
        return api.get(`${PREFIX}/hardware`)
    },

    // get cpu info
    getCpuInfo() {
        return api.get(`${PREFIX}/cpu`);
    },

    // get disk info
    getDiskInfo() {
        return api.get(`${PREFIX}/disk`);
    },

    // get memory info
    getMemoryInfo() {
        return api.get(`${PREFIX}/mem`);
    },

    // get network info
    getNetworkInfo() {
        return api.get(`${PREFIX}/network`);
    },

    // get logs
    getLogs() {
        return api.get(`${PREFIX}/logs`);
    },

    //Get Debug Info
    getDebugInfo() {
        return api.get(`${PREFIX}/debug`);
    },

    // get system utilization
    getUtilization() {
        return api.get(`${PREFIX}/utilization`);
    },

    // proxy request
    getProxyRequestContent(url) {
        return api.get(`${PREFIX}/proxy?url=${url}`)
    },

    // get casaos server port
    getServerPort() {
        return api.get(`/gateway/port`);
    },

    // edit casaos server port
    editServerPort(data) {
        return api.put(`/gateway/port`, data);
    },

    // get usb status
    getUsbStatus() {
        return api.get(`${PREFIX}/usb-auto-mount`);
    },

    // Toggle usb auto-mount
    toggleUsbAutoMount(data) {
        return api.put(`${PREFIX}/usb-auto-mount`, data);
    },

    // update CasaOS
    updateCasaOS() {
        return api.post(`${PREFIX}/update`);
    },

    // stop casaos
    stopCasaOS() {
        return api.post(`${PREFIX}/stop`);
    },

    //Check web ui Port
    checkUiPort(url) {
        return axios.get(url);
    },

    // Get system apps
    getSystemApps() {
        return api.get(`${PREFIX}/apps-state`)
    },

    // Check ssh login
    checkSshLogin(data) {
        return api.post(`${PREFIX}/ssh-login`, data);
    }


}
export default sys;
