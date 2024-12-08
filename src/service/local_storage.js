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
	// Gets the storage list mounted to the mergerfs
	get(data) {
		return api.get(`${PREFIX}/mount`, data)
	},

	// create the storage list mounted to the mergerfs
	create(data) {
		return api.post(`${PREFIX}/mount`, data);
	},

	// update the storage list mounted to the mergerfs
	update(data) {
		return api.put(`${PREFIX}/mount?mount_point=${data.mount_point}`, data);
	},

	// init mergerfs
	initMergerfs(data) {
		return api.post(`${PREFIX}/merge/init`, data);
	},

	// get mergerfs status
	getInitMergerfsStatus() {
		return api.get(`${PREFIX}/merge/init`);
	},

	// delete the storage list mounted to the mergerfs
	delete(data) {
		return api.delete(`${PREFIX}/mount`, data);
	},

	// get mergerfs info
	getMergerfsInfo(data) {
		return api.get(`${PREFIX}/merge`, data);
	},

	// update mergerfs info
	updateMergerfsInfo(data) {
		return api.post(`${PREFIX}/merge`, data);
	},
}
export default local_storage;
