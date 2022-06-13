/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-13 19:31:31
 * @Description: System HardWare Info API
 * @FilePath: \CasaOS-UI\src\service\info.js
 */
import { api } from "./service.js";

const info = {
    //All Info
    utilization() {
        return api.get('/sys/utilization');
    },
    // Hardware Info
    hardwareInfo() {
        return api.get('sys/hardware/info')
    },
    //Get CasaOS Config
    systemConfig() {
        return api.get('/sys/config')
    },
    //Save CasaOs Config
    saveSystemConfig(data) {
        return api.post('/sys/config', data)
    },
    // Check Verison
    checkVersion() {
        return api.get('/sys/version/check');
    },
    // Get websocket port
    getSocketPort() {
        return api.get('/sys/socket/port');
    },
    //Update System
    updateSystem() {
        return api.post('/sys/update');
    },
    //ip
    getIp() {
        return api.get('https://ipapi.co/json/');
    },
    //Get CasaOS Config
    widgetsConfig() {
        return api.get('/sys/widget/config')
    },
    //Save CasaOs Config
    saveWidgetsConfig(data) {
        return api.post('/sys/widget/config', data)
    },

    
    // Get System logs
    systemLogs() {
        return api.get('/sys/error/logs');
    },

    // Get System Port
    getSystemPort() {
        return api.get('/sys/port');
    },
    // Save System Port
    saveSystemPort(data) {
        return api.put('/sys/port', data);
    },
    //Stop CasaOS
    stopCasaOS() {
        return api.post('/sys/stop');
    },
    // Get Usb mount State
    getUsbMountState() {
        return api.get("/sys/usb/status")
    },
    // Set usb mount off
    setUsbMountOff() {
        return api.put('/sys/usb/off')
    },
    // Set usb mount on
    setUsbMountOn() {
        return api.put('/sys/usb/on')
    },
    //Check web ui Port
    checkUiPort(url) {
        return api.get(url);
    },
    //Get Debug Info
    getDebugInfo() {
        return api.get('debug');
    },
    // Get System state
    guideCheck() {
        return api.get('/guide/check');
    },


}
export default info;
