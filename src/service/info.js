import { api } from "./service.js";

/*******************************
 * 
 * System HardWare Info Apis
 * 
 *****************************/

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
        return api.get('/zima/getinfo');
    },
    // System Info
    systemInfo() {
        return api.get('/zima/sysinfo');
    }
}
export default info;
