/*
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-03-15 14:13:55
 * @FilePath: /CasaOS-UI/src/events/message_bus.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

const sourceID = "casaos-ui";

async function intermediateProcessor(name, ownParameter) {
	let store = {
		"device_id": "123456789",
		"access_id": "123456789",
		"casaos_lang": "123456789",
	}
	if (typeof window !== 'undefined') {
		let state = await import('../store').then((module) => module.default);
		store = state.state;
	}
	let publicParameter = {
		"device_id": store.device_id.toString(),
		"access_id": store.access_id.toString(),
		"casaos_lang": store.casaos_lang.toString(),
	};

	return {
		"sourceID": sourceID,
		"name": name,
		"properties": {
			...publicParameter,
			...ownParameter
		},
	}
}

module.exports = {
	storagemanager_storage: async () => {
		return await intermediateProcessor("casaos-ui:widget:storagemanager_storage")
	},
	storagemanager_createstorage: async () => {
		return await intermediateProcessor("casaos-ui:widget:storagemanager_createstorage")
	},
	storagemanager_mergestorage: async () => {
		return await intermediateProcessor("casaos-ui:widget:storagemanager_mergestorage")
	},
	storagemanager_drive: async () => {
		return await intermediateProcessor("casaos-ui:widget:storagemanager_drive")
	},
	apps_open: async (name) => {
		return await intermediateProcessor("casaos-ui:app:apps_open", {value: name})
	},


	// appstore_author: async (type) => {
	// 	return await intermediateProcessor("casaos-ui:appstore:appstore_author", {value: type})
	// },


	//files

	// local message, params: { action, payload, name }

}
