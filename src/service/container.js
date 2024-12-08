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
	getNetworks() {
		return api.get(`${PREFIX}/networks`);
	},

	// get container logs
	getLogs(id) {
		return api.get(`${PREFIX}/${id}/logs`);
	},

	//v2:: get container logs
	getLogsV2(id) {
		return api.get(`${PREFIX2}/${id}/logs`);
	},

	// get my app list
	getMyAppList(data) {
		return api.get(`${PREFIX}`, data);
	},

	//v2:: get my app list
	getMyAppListV2(data) {
		return api.get(`${PREFIX2COMPOSE}`, data);
	},

	// get container info
	getInfo(id) {
		return api.get(`${PREFIX}/${id}`);
	},

	//v2:: get container info
	getInfoV2(id) {
		return api.get(`${PREFIX2COMPOSE}/${id}`);
	},

	// get container state
	getState(id) {
		return api.get(`${PREFIX}/${id}/state`);
	},

	//v2:: get container state
	getStateV2(id) {
		return api.get(`${PREFIX2COMPOSE}/${id}/status`);
	},

	// get my app hardware usage info
	getHardwareUsage() {
		return api.get(`${PREFIX}/usage`);
	},

	// open docker terminal
	openTerminal(id) {
		return api.get(`${PREFIX}/${id}/terminal`);
	},

	//v2:: open docker terminal
	openTerminalV2(id) {
		return api.get(`${PREFIX2COMPOSE}/${id}/containers`);
	},

	// install container
	install(data) {
		return api.post(`${PREFIX}`, data);
	},

	//v2:: install container
	installV2(data, config) {
		return api.post(`${PREFIX2COMPOSE}`, data, config);
	},

	// update contianer
	update(id, data) {
		return api.put(`${PREFIX}/${id}`, data);
	},

	//v2:: update contianer
	updateV2(id, data) {
		return api.put(`${PREFIX2COMPOSE}/${id}`, data);
	},

	// update container state
	updateState(id, state) {
		return api.put(`${PREFIX}/${id}/state`, {
			state: state
		});
	},

	//v2:: update container state
	updateStateV2(id, state) {
		return api.put(`${PREFIX2COMPOSE}/${id}/status`, {
			status: state
		});
	},

	// uninstall  container
	uninstall(id, data) {
		return api.delete(`${PREFIX}/${id}`, data);
	},

	//v2:: uninstall  container
	uninstallV2(id, data) {
		return api.delete(`${PREFIX2COMPOSE}/${id}`, data);
	},

	// AppsInstallationLocation require doctument
	getInstallationLocation() {
		return api.get(`${PREFIX}/info`);
	},

	// AppsInstallationLocation require doctument
	putInstallationLocation(value) {
		return api.put(`${PREFIX}/info`, {
			docker_root_dir: value
		});
	},

	// check container launch status
	containerLauncherCheck(id) {
		return api.get(`${PREFIX2}/${id}/healthcheck`);
	},

	//v2:: check container launch status INGINGINGINGINGINGINGING
	containerLauncherCheckV2(id) {
		return api.get(`${PREFIX2COMPOSE}/${id}/containers`);
	},

	// export container as compose file
	exportAsCompose(id) {
		return api.get(`${PREFIX}/${id}/compose`);
	},

	// rebuild app
	archive(id) {
		return api.put(`${PREFIX}/archive/${id}`);
	}
}

export default container;
