/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 22:25:15
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 22:35:25
 * @FilePath: \CasaOS-UI\src\service\container.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import { api } from "./service.js";

const PREFIX = "/container"

const container = {
    // get container networks
    getNetworks() {
        return api.get(`${PREFIX}/networks`);
    },

    // get container logs
    getLogs(id) {
        return api.get(`${PREFIX}/${id}/logs`);
    },

    // get my app list
    getMyAppList() {
        return api.get(`${PREFIX}`);
    },

    // get container info
    getInfo(id) {
        return api.get(`${PREFIX}/${id}`);
    },

    // get container state
    getState(id) {
        return api.get(`${PREFIX}/${id}/state`);
    },

    // get my app hardware usage info
    getHardwareUsage() {
        return api.get(`${PREFIX}/usage`);
    },

    // open docker terminal
    openTerminal(id) {
        return api.get(`${PREFIX}/${id}/terminal`);
    },

    // install container
    install(data) {
        return api.post(`${PREFIX}`, data);
    },

    // update contianer
    update(id, data) {
        return api.put(`${PREFIX}/${id}`, data);
    },

    // update container state
    updateState(id, state) {
        return api.put(`${PREFIX}/${id}/state`, {
            state: state
        });
    },

    // uninstall  container
    uninstall(id) {
        return api.delete(`${PREFIX}/${id}`);
    }
}

export default container;