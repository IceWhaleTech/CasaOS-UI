/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-27 13:49:25
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-27 13:55:00
 * @FilePath: /CasaOS-UI/src/service/samba.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */
import {api} from "./service.js";

const PREFIX = "/samba";
const samba = {
	//  Connections
	// get the list of samba connections
	getConnections() {
		return api.get(`${PREFIX}/connections`);
	},

	// create a connection
	createConnection(data) {
		return api.post(`${PREFIX}/connections`, data);
	},

	// Delete a connection
	deleteConnection(id) {
		return api.delete(`${PREFIX}/connections/${id}`);
	},

	// Shares
	// get share list
	getShares() {
		return api.get(`${PREFIX}/shares`);
	},

	// create a share
	createShare(data) {
		return api.post(`${PREFIX}/shares`, data);
	},

	// delete a share
	deleteShare(id) {
		return api.delete(`${PREFIX}/shares/${id}`);
	},
}
export default samba;
