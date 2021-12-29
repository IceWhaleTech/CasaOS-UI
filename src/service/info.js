/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-12-29 14:55:53
 * @Description: System HardWare Info API
 * @FilePath: /CasaOS-UI/src/service/info.js
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
    //Check web ui Port
    checkUiPort(url) {
        return api.get(url);
    }


}
export default info;
