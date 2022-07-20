/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 22:00:10
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 10:21:43
 * @FilePath: \CasaOS-UI\src\service\apps.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import { api } from "./service.js";

const PREFIX = "/apps";

const apps = {
    // get app list
    getAppList(data) {
        return api.get(`${PREFIX}`, data);
    },

    // Get app info
    getAppInfo(id) {
        return api.get(`${PREFIX}/${id}`);
    },
}

export default apps;