/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-14 18:15:24
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-02 15:56:30
 * @FilePath: \CasaOS-UI-0.4.2\src\service\cloud.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import {api} from "./service.js";

const PREFIX = "/cloud";
const cloud = {
	// get storage list
	list(data) {
		return api.get(`${PREFIX}`, data)
	},

	// delete storage
	umount(data) {
		return api.delete(`${PREFIX}`, data);
	}
}
export default cloud;
