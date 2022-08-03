/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-14 18:15:24
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-03 14:22:15
 * @FilePath: /CasaOS-UI/src/service/storage.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import { api } from "./service.js";
const PREFIX = "/storage";
const storage = {
    // get storage list
    list() {
        return api.get(`${PREFIX}`)
    },

    // create storage
    create(data) {
        return api.post(`${PREFIX}`, data);
    },

    // format storage
    format(data) {
        return api.put(`${PREFIX}`, data);
    },

    // delete storage
    delete(data) {
        return api.delete(`${PREFIX}`, data);
    }
}
export default storage;