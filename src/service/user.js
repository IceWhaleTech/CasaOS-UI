/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-09-19 09:26:47
 * @Description: User API
 * @FilePath: \CasaOS-UI\src\service\user.js
 */
import { api } from "./service.js";

const user = {
    //login
    login(data) {
        return api.post("user/login", data);
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
    getUserInfo() {
        return api.get("/user/info");
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
            description: description
        }
        return api.post(`user/person/info`, data);
    }
}
export default user;
