/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 22:25:15
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-28 00:57:10
 * @FilePath: /CasaOS-UI/src/service/container.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */
import {api} from "./service.js";

const PREFIX = "/container"
const PREFIX2 = "/v2/app_management/container"
const PREFIX2COMPOSE = "/v2/app_management/compose"

const container = {
	// get container networks
	// get container logs
	//v2:: get container logs
	// get my app list
	getMyAppList(data) {
		return api.get(`${PREFIX}`, data);
	},

	//v2:: get my app list
	// get container info
	//v2:: get container info
	// get container state
	//v2:: get container state
	// get my app hardware usage info
	// open docker terminal
	//v2:: open docker terminal
	// install container
	install(data) {
		return api.post(`${PREFIX}`, data);
	},

	//v2:: install container
	// update contianer
	update(id, data) {
		return api.put(`${PREFIX}/${id}`, data);
	},

	//v2:: update contianer
	// update container state
	updateState(id, state) {
		return api.put(`${PREFIX}/${id}/state`, {
			state: state
		});
	},

	//v2:: update container state
	// uninstall  container
	uninstall(id, data) {
		return api.delete(`${PREFIX}/${id}`, data);
	},

	//v2:: uninstall  container
	// AppsInstallationLocation require doctument
	// AppsInstallationLocation require doctument
	// check container launch status
	//v2:: check container launch status INGINGINGINGINGINGINGING
	// export container as compose file
	// rebuild app
	archive(id) {
		return api.put(`${PREFIX}/archive/${id}`);
	}
}

export default container;
