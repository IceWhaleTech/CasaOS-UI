/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 21:57:26
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-20 23:44:51
 * @FilePath: /CasaOS-UI/src/service/users.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */
import {api} from "./service.js";

const PREFIX = "/users"

const users = {
    // get all user name [OK]
    getAllUserName() {
        return api.get(`${PREFIX}/name`);
    },

    // delete all user [NOT USE]
    deleteAllUser() {
        return api.delete(`${PREFIX}`);
    },
    // get user status [OK]
    getUserStatus() {
        return api.get(`${PREFIX}/status`);
    },


    // get user current info [OK]
    getUserInfo() {
        return api.get(`${PREFIX}/current`);
    },
    // set user current info [OK]
    setUserInfo(data) {
        return api.put(`${PREFIX}/current`, data);
    },
    // change user password [OK]
    changePassword(data) {
        return api.put(`${PREFIX}/current/password`, data);
    },

    getLinkAppDetail() {
        return api.get(`${PREFIX}/current/custom/link`);
    },

    saveLinkAppDetail(data) {
        return api.post(`${PREFIX}/current/custom/link`, data);
    },

    // delete user [NOT USE]
    deleteUser(id) {
        return api.delete(`${PREFIX}/${id}`);
    },

    // get user image [NOT USE]
    getUserImage(path) {
        return api.get(`${PREFIX}/image`, {
            path: path
        });
    },

    // create or update user image from upload
    setUserImage(key, data) {
        return api.put(`${PREFIX}/current/image/${key}`, data);
    },

    // delete user image [NOT USE]
    deleteUserImage(path) {
        return api.delete(`${PREFIX}/current/image`, {
            path: path
        });
    },


    // get custom storage [OK]
    // free store GET
    getCustomStorage(key) {
        return api.get(`${PREFIX}/current/custom/${key}`);
    },

    // set or update custom storage  [OK]
    // free store POST
    setCustomStorage(key, data) {
        return api.post(`${PREFIX}/current/custom/${key}`, data);
    },

    // delete custom storage  [NOT USE]
    deleteCustomStorage(key) {
        return api.delete(`${PREFIX}/current/custom/${key}`);
    },

    // get user info by user name  [NOT USE]
    getUserInfoByName(username) {
        return api.get(`${PREFIX}/${username}`);
    },


    // register [OK]
    register(username, password, key) {
        return api.post(`${PREFIX}/register`, {
            username: username,
            password: password,
            key: key
        });
    },

    // login [OK]
    login(username, password) {
        return api.post(`${PREFIX}/login`, {
            username: username,
            password: password
        });
    },

    // refresh token [OK]
    refreshToken(refresh_token) {
        return api.post(`${PREFIX}/refresh`, {
            refresh_token: refresh_token
        });
    },

    // get shutcut [OK]
    getShutcutDetail() {
        return api.get(`${PREFIX}/current/custom/shortcut`);
    },

    // save shutcut [OK]
    saveShutcutDetail(data) {
        return api.post(`${PREFIX}/current/custom/shortcut`, data);
    },
}

export default users;
