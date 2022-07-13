/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-13 19:03:39
 * @Description: User API
 * @FilePath: /CasaOS-UI/src/service/user.js
 */
import { api } from "./service.js";
const PREFIX = "/user"

const user = {
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

    // delete user image [NOT USE]
    deleteUserImage(path) {
        return api.delete(`${PREFIX}/current/image`, {
            path: path
        });
    },


    // get custom storage [OK]
    getCustomStorage(key) {
        return api.get(`${PREFIX}/current/custom/${key}`);
    },

    // set or update custom storage  [OK]
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
}
export default user;
