/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-14 18:15:24
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-08-04 10:45:33
 * @FilePath: \CasaOS-UI\src\service\storage.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import {api} from "./service.js";

const PREFIX = "/storage";
const storage = {
	// get storage list
	list(data) {
		return api.get(`${PREFIX}`, data)
	},

	// create storage
	create(data) {
		return api.post(`${PREFIX}`, data);
	},

	// format storage
	format(data) {
		return api.put(`${PREFIX}`, data);
	},

	// delete storage
	delete(data) {
		return api.delete(`${PREFIX}`, data);
	}
}
export default storage;
