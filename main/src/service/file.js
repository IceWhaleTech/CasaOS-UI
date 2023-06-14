/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/6/12 下午5:52
 * @FilePath: /CasaOS-UI/main/src/service/file.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

import {api} from "./service.js";

const PREFIX = "/file"

const file = {

	// get file content
	getContent(path) {
		return api.get(`${PREFIX}/content`, {
			path: path,
			timestamp: Date.now()
		});
	},

	// download single file
	download(path) {
		return api.get(`${PREFIX}`, {
			path: path,
			timestamp: Date.now()
		});
	},

	// create file
	create(path) {
		return api.post(`${PREFIX}`, {
			path: path
		});
	},

	// rename file
	rename(old_path, new_path) {
		return api.put(`${PREFIX}/name`, {
			old_path: old_path,
			new_path: new_path
		});
	},

	// update file
	update(path, content) {
		return api.put(`${PREFIX}`, {
			path: path,
			content: content
		});
	},

}

export default file;