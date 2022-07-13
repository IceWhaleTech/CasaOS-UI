/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-13 14:19:28
 * @Description: Application API
 * @FilePath: /CasaOS-UI/src/service/app.js
 */
import { api } from './service.js';
const PREFIX = "/app"

const app = {

    // Get app info
    getAppInfo(id) {
        return api.get(`${PREFIX}/${id}`);
    },

    // -------------------------------------------------------------------

    //Get Install Info
    appConfig() {
        return api.get(`/app/install/config`);
    },
    //Store List
    storeList(data) {
        return api.get(`/app/list`, data);
    },
    //Store App Info
    storeAppInfo(id) {
        return api.get(`/app/appinfo/${id}`);
    },
    //Store Category List
    storeCategoryList() {
        return api.get(`/app/category`);
    },
    //Check Port
    checkPort(port, type) {
        let data = {
            type: type
        }
        return api.get(`/app/check/${port}`, data);
    },
    // Get a free port
    getPort() {
        return api.get('/app/getport');
    },
    // Get app Running State
    getState(id, data) {
        return api.get(`/app/state/${id}`, data);
    },
    //Install App
    install(data) {
        return api.post('/app/install', data);
    },
    // Uninstall App
    uninstall(id) {
        return api.delete(`/app/uninstall/${id}`);
    },
    //Container info
    getContainerInfo(id) {
        return api.get(`/app/info/${id}`);
    },
    //Container Log
    getContainerLogs(id) {
        return api.get(`/app/logs/${id}`)
    },
    //Start Or Stop Or Restart A Container with ID
    startContainer(id, data) {
        return api.put(`/app/state/${id}`, data)
    },
    getContainerSettingdata(id) {
        return api.get(`/app/update/${id}/info`)
    },
    //Update Container Settings
    updateContainerSetting(id, data) {
        return api.put(`/app/update/${id}/setting`, data);
    },

    //Get all Usage
    getAppUsage() {
        return api.get('/app/usage');
    },

    // Get App list order
    getAppListOrder() {
        return api.get('/app/order');
    },

    // Save App list order
    saveAppListOrder(data) {
        return api.post('/app/order', data)
    }

}
export default app;
