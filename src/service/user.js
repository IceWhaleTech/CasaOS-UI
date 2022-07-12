/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 22:22:26
 * @Description: User API
 * @FilePath: \CasaOS-UI\src\service\user.js
 */
import { api } from "./service.js";
const PREFIX = "/user"

const user = {
    // get user current info
    getUserInfo() {
        return api.get(`${PREFIX}/current`);
    },
    // set user current info
    setUserInfo(data) {
        return api.put(`${PREFIX}/current`, data);
    },

    // delete user
    deleteUser(id) {
        return api.delete(`${PREFIX}/${id}`);
    },

    // get user image
    getUserImage(path) {
        return api.get(`${PREFIX}/image`, {
            path: path
        });
    },

    // create or update user image from upload
    setUserImage(key) {
        return api.post(`${PREFIX}/current/image/${key}`);
    },

    // delete user image
    deleteUserImage(path) {
        return api.delete(`${PREFIX}/current/image`, {
            path: path
        });
    },


    // get custom storage
    getCustomStorage(key) {
        return api.get(`${PREFIX}/current/custom/${key}`);
    },

    // set or update custom storage
    setCustomStorage(key, data) {
        return api.post(`${PREFIX}/current/custom/${key}`, data);
    },

    // delete custom storage
    deleteCustomStorage(key) {
        return api.delete(`${PREFIX}/current/custom/${key}`);
    },



    // get user info by user name
    getUserInfoByName(username) {
        return api.get(`${PREFIX}/${username}`);
    },

    // get user status
    getUserStatus() {
        return api.get(`${PREFIX}/status`);
    },

    // register
    register(username, password, key) {
        return api.post(`${PREFIX}/register`, {
            username: username,
            password: password,
            key: key
        });
    },

    // login
    login(username, password) {
        return api.post(`${PREFIX}/login`, {
            username: username,
            password: password
        });
    },

    // refresh token
    refreshToken(refresh_token) {
        return api.post(`${PREFIX}/refresh`, {
            refresh_token: refresh_token
        });
    },





    // ----------------------------------------------------------------
    // Get All User Name
    getAllUserName() {
        return api.get(`/user/all/name`);
    },


    // Create UserName and Password
    createUsernameAndPaword(data) {
        return api.post("/user/setusernamepwd", data);
    },

    // Change User Avatar
    changeAvatar(data) {
        return api.post("/user/changhead", data);
    },

    // Change UserName
    changeUserName(data) {
        return api.put("/user/username", data);
    },

    // Change User Password
    changePassword(data) {
        return api.put("/user/password", data);
    },


    // Change User Info
    changeUserInfo(data) {
        return api.post('/user/changuserinfo', data)
    },
    // Edit User nickname
    setNickname(data) {
        return api.put('/user/nick', data)
    },
    // Set User Desc
    setDesc(data) {
        return api.put('/user/desc', data)
    },
    // Get Self Token
    getPrivateID() {
        return api.get('/user/token');
    },
    // Edit my nick name
    updateMyNick(nickname) {
        let data = {
            name: nickname
        }
        return api.put(`/user/nick`, data);
    },
    // Modify user person information
    personInfo(nickname, description) {
        let data = {
            nick_name: nickname,
            description: description,
            user_id: localStorage.getItem("user_id") ? localStorage.getItem("user_id") : 1,
        }
        return api.post(`/user/person/info`, data);
    },

    getCustomConfig(id, key) {
        return api.get(`/user/custom/${id}/${key}`)
    },
    postCustomConfig(id, key, data) {
        return api.post(`/user/custom/${id}/${key}`, data)
    },
    deleteCustomConfig(id, key) {
        return api.delete(`/user/custom/${id}/${key}`)
    },

    postFileImage(id, key, data) {
        return api.post(`/user/file/image/${id}/${key}`, data)
    },
    deletePostImage(id, data) {
        return api.delete(`/user/image/${id}`, data)
    },
}
export default user;
