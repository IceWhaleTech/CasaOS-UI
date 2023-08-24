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
	global_newvisit: async () => {
		return await intermediateProcessor(`${sourceID}:global:global_newvisit`)
	},
	global_visit: async () => {
		return await intermediateProcessor(`${sourceID}:global:global_visit`)
	},
	account_setting: async () => {
		return await intermediateProcessor("casaos-ui:topbar:account_setting")
	},
	account_setting_logout: async () => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_showsearchbar")
	},
	dashboardsetting: async () => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_setting")
	},
	dashboardsetting_showsearchbar: async (isTrue) => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_showsearchbar", {value: isTrue})
	},
	dashboardsetting_searchengine: async (whichSearchengine) => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_searchengine", {value: whichSearchengine})
	},
	dashboardsetting_language: async (whichLanguage) => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_language", {value: whichLanguage})
	},
	dashboardsetting_webuiport: async num => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_webuiport", {value: num})
	},
	dashboardsetting_wallpaper: async wallpaper => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_wallpaper", {value: wallpaper})
	},
	dashboardsetting_showexistingapp: async isShow => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_showexistingapp", {value: isShow})
	},
	dashboardsetting_news: async isShow => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_news", {value: isShow})
	},
	dashboardsetting_automountusb: async isShow => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_automountusb", {value: isShow})
	},
	dashboardsetting_versionavailable_show: async isTrue => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_versionavailable_show", {value: isTrue})
	},
	dashboardsetting_versionupdate: async isTrue => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_versionupdate", {value: isTrue})
	},
	dashboardsetting_reboot: async () => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_reboot")
	},
	dashboardsetting_shutdown: async () => {
		return await intermediateProcessor("casaos-ui:topbar:dashboardsetting_shutdown")
	},
	terminallogs: async () => {
		return await intermediateProcessor("casaos-ui:topbar:terminallogs")
	},
	terminallogs_terminal: async () => {
		return await intermediateProcessor("casaos-ui:topbar:terminallogs_terminal")
	},
	terminallogs_connect: async () => {
		return await intermediateProcessor("casaos-ui:topbar:terminallogs_connect")
	},
	terminallogs_logs: async () => {
		return await intermediateProcessor("casaos-ui:topbar:terminallogs_logs")
	},

	widget_systemstatus: async (status) => {
		return await intermediateProcessor("casaos-ui:topbar:widget_systemstatus", {value: status})
	},
	widget_cpu: async () => {
		return await intermediateProcessor("casaos-ui:widget:widget_cpu")
	},
	widget_ram: async () => {
		return await intermediateProcessor("casaos-ui:widget:widget_ram")
	},
	widget_storagemanager: async () => {
		return await intermediateProcessor("casaos-ui:widget:widget_storagemanager")
	},
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
	widget_widgetsetting: async () => {
		return await intermediateProcessor("casaos-ui:widget:widget_widgetsetting")
	},

	searchbar_show: async () => {
		return await intermediateProcessor("casaos-ui:searchbar:searchbar_show")
	},
	searchbar_search: async () => {
		return await intermediateProcessor("casaos-ui:searchbar:searchbar_search")
	},

	youshouldknow_show: async isShow => {
		return await intermediateProcessor("casaos-ui:youshouldknow:youshouldknow_show", {value: isShow})
	},
	youshouldknow_slide: async () => {
		return await intermediateProcessor("casaos-ui:youshouldknow:youshouldknow_slide")
	},
	youshouldknow_cardclose: async () => {
		return await intermediateProcessor("casaos-ui:youshouldknow:youshouldknow_cardclose")
	},
	youshouldknow_cardaction: async () => {
		return await intermediateProcessor("casaos-ui:youshouldknow:youshouldknow_cardaction")
	},

	apps_open: async (name) => {
		return await intermediateProcessor("casaos-ui:app:apps_open", {value: name})
	},
	apps_setting: async (name) => {
		return await intermediateProcessor("casaos-ui:app:apps_setting", {value: name})
	},
	apps_checkupdate: async (name) => {
		return await intermediateProcessor("casaos-ui:app:apps_checkupdate", {value: name})
	},
	apps_clone: async (name) => {
		return await intermediateProcessor("casaos-ui:app:apps_checkupdate", {value: name})
	},
	apps_uninstall: async (name) => {
		return await intermediateProcessor("casaos-ui:app:apps_uninstall", {value: name})
	},
	apps_restart: async (name) => {
		return await intermediateProcessor("casaos-ui:app:apps_restart", {value: name})
	},
	apps_stop: async (name) => {
		return await intermediateProcessor("casaos-ui:app:apps_stop", {value: name})
	},
	appsexsiting_open: async (name) => {
		return await intermediateProcessor("casaos-ui:app:appsexsiting_open", {value: name})
	},
	appsexsiting_setting: async (name) => {
		return await intermediateProcessor("casaos-ui:app:appsexsiting_setting", {value: name})
	},
	appscustom_open: async (name) => {
		return await intermediateProcessor("casaos-ui:app:appscustom_open", {value: name})
	},
	appscustom_setting: async (name) => {
		return await intermediateProcessor("casaos-ui:app:appscustom_setting", {value: name})
	},
	apps_custominstall: async () => {
		return await intermediateProcessor("casaos-ui:app:apps_custominstall")
	},
	apps_external: async () => {
		return await intermediateProcessor("casaos-ui:app:apps_external")
	},

	connect_news: async () => {
		return await intermediateProcessor("casaos-ui:connect:connect_news")
	},
	connect_feedback: async () => {
		return await intermediateProcessor("casaos-ui:connect:connect_feedback")
	},
	connect_discord: async () => {
		return await intermediateProcessor("casaos-ui:connect:connect_discord")
	},
	connect_github: async () => {
		return await intermediateProcessor("casaos-ui:connect:connect_github")
	},
	connect_sharecasaos: async () => {
		return await intermediateProcessor("casaos-ui:connect:connect_sharecasaos")
	},

	appstore_install: async (name) => {
		return await intermediateProcessor("casaos-ui:appstore:appstore_install", {value: name})
	},
	appstore_detail: async (name) => {
		return await intermediateProcessor("casaos-ui:appstore:appstore_detail", {value: name})
	},
	appstorecommunity_install: async (name) => {
		return await intermediateProcessor("casaos-ui:appstore:appstorecommunity_install", {value: name})
	},
	appstorecommunity_detail: async (name) => {
		return await intermediateProcessor("casaos-ui:appstore:appstorecommunity_detail", {value: name})
	},
	appstore_slide: async () => {
		return await intermediateProcessor("casaos-ui:appstore:appstore_slide")
	},
	appstore_type: async (type) => {
		return await intermediateProcessor("casaos-ui:appstore:appstore_type", {value: type})
	},
	appstore_sort: async (type) => {
		return await intermediateProcessor("casaos-ui:appstore:appstore_sort", {value: type})
	},
	appstore_custominstall: async () => {
		return await intermediateProcessor("casaos-ui:appstore:appstore_custominstall")
	},
	appstore_close: async () => {
		return await intermediateProcessor("casaos-ui:appstore:appstore_close")
	},
	//files
	files_open: async (peerid) => {
		return await intermediateProcessor("casaos-ui:app:apps_open:files", {value: peerid})
	},
	// cloud
	files_addlocation_googledrive: async () => {
		return await intermediateProcessor("casaos-ui:files:files_addlocation_googledrive")
	},
	files_addlocation_onedrive: async () => {
		return await intermediateProcessor("casaos-ui:files:files_addlocation_onedrive")
	},
	files_addlocation_dropbox: async () => {
		return await intermediateProcessor("casaos-ui:files:files_addlocation_dropbox")
	},
}
