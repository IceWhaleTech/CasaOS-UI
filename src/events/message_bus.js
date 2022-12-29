/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2022/12/29 下午1:17
 * @FilePath: /CasaOS-UI/src/events/message_bus.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

const sourceID = "casaos-ui";
const store = {
    state: {
        device_id: "xxx",
        access_id: "dsdad",
        casaos_version: "1.0.0",
        casaos_channels: "1.0.0",
        casaos_lang: "zh",
        hw_id: "ddddd",
        hw_brand: "dsasdsa"
    }
}
const publicParameter = {
    "device_id": store.state.device_id,
    "access_id": "dsdad",
    "casaos_version": "1.0.0",
    "casaos_channels": "1.0.0",
    "casaos_lang": "zh",
    "hw_id": "ddddd",
    "hw_brand": "dsasdsa"
};

function intermediateProcessor(name, ownParameter) {
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
    global_newvisit: () => {
        return intermediateProcessor(`${sourceID}:global:global_newvisit`)
    },
    global_visit: () => {
        return intermediateProcessor(`${sourceID}:global:global_visit`)
    },
    account_setting: () => {
        return intermediateProcessor("casaos-ui:topbar:account_setting")
    },
    account_setting_logout: (a) => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_showsearchbar", {value: a})
    },
    dashboardsetting: () => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_setting")
    },
    dashboardsetting_showsearchbar: (isTrue) => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_showsearchbar", {value: isTrue})
    },
    dashboardsetting_searchengine: (whichSearchengine) => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_searchengine", {value: whichSearchengine})
    },
    dashboardsetting_language: (whichLanguage) => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_language", {value: whichLanguage})
    },
    dashboardsetting_webuiport: num => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_webuiport", {value: num})
    },
    dashboardsetting_wallpaper: wallpaper => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_wallpaper", {value: wallpaper})
    },
    dashboardsetting_showexistingapp: isShow => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_showexistingapp", {value: isShow})
    },
    dashboardsetting_news: isShow => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_news", {value: isShow})
    },
    dashboardsetting_automountusb: isShow => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_automountusb", {value: isShow})
    },
    dashboardsetting_versionavailable_show: isTrue => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_versionavailable_show", {value: isTrue})
    },
    dashboardsetting_versionupdate: isTrue => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_versionupdate", {value: isTrue})
    },
    dashboardsetting_reboot: () => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_reboot")
    },
    dashboardsetting_shutdown: () => {
        return intermediateProcessor("casaos-ui:topbar:dashboardsetting_shutdown")
    },
    terminallogs: () => {
        return intermediateProcessor("casaos-ui:topbar:terminallogs")
    },
    terminallogs_terminal: () => {
        return intermediateProcessor("casaos-ui:topbar:terminallogs_terminal")
    },
    terminallogs_connect: () => {
        return intermediateProcessor("casaos-ui:topbar:terminallogs_connect")
    },
    terminallogs_logs: () => {
        return intermediateProcessor("casaos-ui:topbar:terminallogs_logs")
    },

    widget_systemstatus: (status) => {
        return intermediateProcessor("casaos-ui:topbar:widget_systemstatus", {value: status})
    },
    widget_cpu: () => {
        return intermediateProcessor("casaos-ui:widget:widget_cpu")
    },
    widget_ram: () => {
        return intermediateProcessor("casaos-ui:widget:widget_ram")
    },
    widget_storagemanager: () => {
        return intermediateProcessor("casaos-ui:widget:widget_storagemanager")
    },
    storagemanager_storage: () => {
        return intermediateProcessor("casaos-ui:widget:storagemanager_storage")
    },
    storagemanager_createstorage: () => {
        return intermediateProcessor("casaos-ui:widget:storagemanager_createstorage")
    },
    storagemanager_mergestorage: () => {
        return intermediateProcessor("casaos-ui:widget:storagemanager_mergestorage")
    },
    storagemanager_drive: () => {
        return intermediateProcessor("casaos-ui:widget:storagemanager_drive")
    },
    widget_widgetsetting: () => {
        return intermediateProcessor("casaos-ui:widget:widget_widgetsetting")
    },

    searchbar_show: () => {
        return intermediateProcessor("casaos-ui:searchbar:searchbar_show")
    },
    searchbar_search: () => {
        return intermediateProcessor("casaos-ui:searchbar:searchbar_search")
    },

    youshouldknow_show: isShow => {
        return intermediateProcessor("casaos-ui:youshouldknow:youshouldknow_show", {value: isShow})
    },
    youshouldknow_slide: () => {
        return intermediateProcessor("casaos-ui:youshouldknow:youshouldknow_slide")
    },
    youshouldknow_cardclose: () => {
        return intermediateProcessor("casaos-ui:youshouldknow:youshouldknow_cardclose")
    },
    youshouldknow_cardaction: () => {
        return intermediateProcessor("casaos-ui:youshouldknow:youshouldknow_cardaction")
    },

    apps_open: (name) => {
        return intermediateProcessor("casaos-ui:app:apps_open", {value: name})
    },
    apps_setting: (name) => {
        return intermediateProcessor("casaos-ui:app:apps_setting", {value: name})
    },
    apps_uninstall: (name) => {
        return intermediateProcessor("casaos-ui:app:apps_uninstall", {value: name})
    },
    apps_restart: (name) => {
        return intermediateProcessor("casaos-ui:app:apps_restart", {value: name})
    },
    apps_stop: (name) => {
        return intermediateProcessor("casaos-ui:app:apps_stop", {value: name})
    },
    appsexsiting_open: (name) => {
        return intermediateProcessor("casaos-ui:app:appsexsiting_open", {value: name})
    },
    appsexsiting_setting: (name) => {
        return intermediateProcessor("casaos-ui:app:appsexsiting_setting", {value: name})
    },
    appscustom_open: (name) => {
        return intermediateProcessor("casaos-ui:app:appscustom_open", {value: name})
    },
    appscustom_setting: (name) => {
        return intermediateProcessor("casaos-ui:app:appscustom_setting", {value: name})
    },
    apps_custominstall: (name) => {
        return intermediateProcessor("casaos-ui:app:apps_custominstall", {value: name})
    },
    apps_external: (name) => {
        return intermediateProcessor("casaos-ui:app:apps_external", {value: name})
    },

    connect_news: () => {
        return intermediateProcessor("casaos-ui:connect:connect_news")
    },
    connect_feedback: () => {
        return intermediateProcessor("casaos-ui:connect:connect_feedback")
    },
    connect_discord: () => {
        return intermediateProcessor("casaos-ui:connect:connect_discord")
    },
    connect_github: () => {
        return intermediateProcessor("casaos-ui:connect:connect_github")
    },
    connect_sharecasaos: () => {
        return intermediateProcessor("casaos-ui:connect:connect_sharecasaos")
    },

    appstore_install: (name) => {
        return intermediateProcessor("casaos-ui:appstore:appstore_install", {value: name})
    },
    appstore_detail: (name) => {
        return intermediateProcessor("casaos-ui:appstore:appstore_detail", {value: name})
    },
    appstorecommunity_install: (name) => {
        return intermediateProcessor("casaos-ui:appstore:appstorecommunity_install", {value: name})
    },
    appstorecommunity_detail: (name) => {
        return intermediateProcessor("casaos-ui:appstore:appstorecommunity_detail", {value: name})
    },
    appstore_slide: () => {
        return intermediateProcessor("casaos-ui:appstore:appstore_slide")
    },
    appstore_type: (type) => {
        return intermediateProcessor("casaos-ui:appstore:appstore_type", {value: type})
    },
    appstore_sort: (type) => {
        return intermediateProcessor("casaos-ui:appstore:appstore_sort", {value: type})
    },
    appstore_custominstall: () => {
        return intermediateProcessor("casaos-ui:appstore:appstore_custominstall")
    },
    appstore_close: () => {
        return intermediateProcessor("casaos-ui:appstore:appstore_close")
    },

}
