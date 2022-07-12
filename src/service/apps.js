/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 22:00:10
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 22:01:02
 * @FilePath: \CasaOS-UI\src\service\apps.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import { api } from "./service.js";

const PREFIX = "/apps";

const apps = {
    // get app list
    getAppList() {
        return api.get(`${PREFIX}`);
    },
}

export default apps;