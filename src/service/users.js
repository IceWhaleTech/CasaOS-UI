/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 21:57:26
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 21:59:21
 * @FilePath: \CasaOS-UI\src\service\users.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import { api } from "./service.js";

const PREFIX = "/users"

const users = {
    // get all user name
    getAllUserName() {
        return api.get(`${PREFIX}/name`);
    },

    // delete all user
    deleteAllUser() {
        return api.delete(`${PREFIX}`);
    }
}

export default users;