/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-14 18:15:24
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-21 01:00:44
 * @FilePath: /CasaOS-UI/src/service/local_storage.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */
import {api} from "./service.js";

const PREFIX = "/v2/local_storage";
const local_storage = {
    // get storage list
    get(data) {
        return api.get(`${PREFIX}/mount`, data)
    },

    // create storage
    create(data) {
        return api.post(`${PREFIX}/mount`, data);
    },

    // update storage
    update(data) {
        return api.put(`${PREFIX}/mount`, data);
    },

    // delete storage
    delete(data) {
        return api.delete(`${PREFIX}/mount`, data);
    }
}
export default local_storage;
