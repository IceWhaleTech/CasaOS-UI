/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-29 18:36:37
 * @Description: User API
 * @FilePath: /CasaOS-UI/src/service/user.js
 */
import { api } from "./service.js";

const user = {
    // Get All User Name
    getAllUserName() {
        return api.get(`/user/all/name`);
    },

    //login
    login(data) {
        return api.post("/user/login", data);
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

    // Get user info
    getUserInfo(id) {
        return api.get(`/user/info/${id}`);
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
