/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 22:39:41
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 22:41:08
 * @FilePath: \CasaOS-UI\src\service\port.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import {api} from "./service.js";

const PREFIX = "/port"

const port = {
	// check if the port is available
	check(port, type) {
		return api.get(`${PREFIX}/state/${port}`, {
			type: type
		});
	},

	// get a able port
	get(type) {
		return api.get(`${PREFIX}`, {
			type: type
		});
	}
}

export default port;