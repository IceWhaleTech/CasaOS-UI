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
const PREFIX2 = "/v2/users"

const users = {
	// get all user name [OK]
	// delete all user [NOT USE]
	// get user status [OK]
	// get user current info [OK]
	// set user current info [OK]
	// change user password [OK]
	getLinkAppDetail() {
		return api.get(`${PREFIX}/current/custom/link`);
	},

	saveLinkAppDetail(data) {
		return api.post(`${PREFIX}/current/custom/link`, data);
	},

	// delete user [NOT USE]
	// get user image [NOT USE]
	// create or update user image from upload
	// delete user image [NOT USE]
	// get custom storage [OK]
	// free store GET
	// set or update custom storage  [OK]
	// free store POST
	// delete custom storage  [NOT USE]
	// get user info by user name  [NOT USE]
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
	// get shutcut [OK]
	getShutcutDetail() {
		return api.get(`${PREFIX}/current/custom/shortcut`);
	},

	// save shutcut [OK]
	saveShutcutDetail(data) {
		return api.post(`${PREFIX}/current/custom/shortcut`, data);
	},

	// get user letter [OK]


	// delete letter [OK]


}

export default users;
