/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-05-30 19:54:51
 * @Description: System HardWare Info API
 * @FilePath: \CasaOS-UI\src\service\info.js
 */
import { api } from "./service.js";

const info = {
    //CPU info
    cpuInfo() {
        return api.get("/zima/getcpuinfo");
    },
    //Memory Info
    memoryInfo() {
        return api.get("/zima/getmeminfo");
    },
    //Network Info
    networkInfo() {
        return api.get('/zima/getnetinfo');
    },
    //Disk Info
    diskInfo() {
        return api.get('/zima/getdiskinfo');
    },
    //All Info
    allInfo() {
        return api.get('/sys/info');
    },
    // System Info
    systemInfo() {
        return api.get('/zima/sysinfo');
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
        return api.get('/sys/check');
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

    // Get System state
    guideCheck() {
        return api.get('/guide/check');
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
    //Kill System
    killSystem() {
        return api.post('/sys/kill');
    },
    // Get Usb mount State
    getUsbMountState() {
        return api.get("/sys/usb")
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
    }


}
export default info;
