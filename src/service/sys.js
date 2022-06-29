/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-23 23:39:14
 * @Description: System HardWare Info API
 * @FilePath: \CasaOS-UI\src\service\sys.js
 */
import { api } from "./service.js";

const PREFIX = "/sys"

const sys = {
    // Check if need init
    guideCheck() {
        return api.get(`${PREFIX}/init/check`);
    },

    //All Info
    utilization() {
        return api.get(`${PREFIX}/utilization`);
    },

    // Hardware Info
    hardwareInfo() {
        return api.get(`${PREFIX}/hardware/info`)
    },

    //Get CasaOS Config
    systemConfig() {
        return api.get(`${PREFIX}/config`)
    },

    //Save CasaOs Config
    saveSystemConfig(data) {
        return api.post(`${PREFIX}/config`, data)
    },

    // Check Verison
    checkVersion() {
        return api.get(`${PREFIX}/version/check`);
    },

    // Get websocket port
    getSocketPort() {
        return api.get(`${PREFIX}/socket/port`);
    },

    //Update System
    updateSystem() {
        return api.post(`${PREFIX}/update`);
    },

    //Get CasaOS Widget Config
    widgetsConfig() {
        return api.get(`${PREFIX}/widget/config`)
    },

    //Save CasaOs Widget Config
    saveWidgetsConfig(data) {
        return api.post(`${PREFIX}/widget/config`, data)
    },


    // Get System logs
    systemLogs() {
        return api.get(`${PREFIX}/error/logs`);
    },

    // Get System Port
    getSystemPort() {
        return api.get(`${PREFIX}/port`);
    },

    // Save System Port
    saveSystemPort(data) {
        return api.put(`${PREFIX}/port`, data);
    },

    //Stop CasaOS
    stopCasaOS() {
        return api.post(`${PREFIX}/stop`);
    },

    // Get Usb mount State
    getUsbMountState() {
        return api.get(`${PREFIX}/usb/status`)
    },

    // Set usb mount off
    setUsbMountOff() {
        return api.put(`${PREFIX}/usb/off`)
    },

    // Set usb mount on
    setUsbMountOn() {
        return api.put(`${PREFIX}/usb/on`)
    },

    //Check web ui Port
    checkUiPort(url) {
        return api.get(url);
    },

    //Get Debug Info
    getDebugInfo() {
        return api.get('debug');
    },

    //ip
    getIp() {
        return api.get('https://ipapi.co/json/');
    },

}
export default sys;
