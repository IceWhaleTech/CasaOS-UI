/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 22:42:25
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-14 12:15:14
 * @FilePath: \CasaOS-UI\src\service\folder.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import {api} from "./service.js";

const PREFIX = "/folder"

const folder = {
	// get folder list
	getList(path) {
		return api.get(`${PREFIX}`, {
			path: path
		});
	},
	// create folder
	create(path) {
		return api.post(`${PREFIX}`, {
			path: path,
		});
	},

	// rename folder
	rename(old_path, new_path) {
		return api.put(`${PREFIX}/name`, {
			old_path: old_path,
			new_path: new_path
		});
	},

	// get folder size
	getFolderSize(path) {
		return api.get(`${PREFIX}/size`, {
			path: path
		});
	},

	// count folder
	getFolderCount(path) {
		return api.get(`${PREFIX}/count`, {
			path: path
		});
	},
}

export default folder;