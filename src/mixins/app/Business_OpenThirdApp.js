/*
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-12 18:32:17
 * @FilePath: \CasaOS-UI-0.4.2\src\mixins\app\Business_OpenThirdApp.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

import events from '@/events/events'

export default {
	methods: {
		openAppToNewWindow(appInfo) {
			this.hasNewTag(appInfo.name) ? this.firstOpenThirdApp(appInfo) : this.openThirdApp(appInfo);
		},
		openThirdApp(appInfo) {
			this.$messageBus('apps_open', appInfo.name);
			if (appInfo.hostname !== "" || appInfo.port !== "" || appInfo.index !== "") {
				const hostIp = appInfo.hostname || this.$baseIp
				const scheme = appInfo.scheme || 'http'
				const port = appInfo.port ? `:${appInfo.port}` : ''
				const index = appInfo.index || ''
				const url = `${scheme}://${hostIp}${port}${index}`

				this.$EventBus.$emit(events.OPEN_APP_IFRAME, {
					name: appInfo.name,
					url,
				})
			}
		},
		async openThirdContainerByAppInfo(appInfo) {
			try {
				await this.$openAPI.appManagement.compose.setComposeAppStatus(appInfo.id, 'start')

				let allinfo = await this.$openAPI.appManagement.compose.myComposeApp(appInfo.id).then(res => {
					return res.data.data
				})
				
				let containerInfoV2 = allinfo.store_info
				let app = {
					"id": appInfo.id,
					"name": appInfo.id,
					scheme: containerInfoV2.scheme,
					hostname: containerInfoV2.hostname || this.$baseIp,
					port: containerInfoV2.port_map,
					index: containerInfoV2.index,
					image: allinfo.compose.services[appInfo.id].image,
				}

				if (allinfo.status.indexOf('running') === -1) { 
					await this.$openAPI.appManagement.compose.setComposeAppStatus(allinfo.compose.name, 'start')
					this.firstOpenThirdApp(app)
				}else{
					this.openAppToNewWindow(app)
				}
			} catch (e) {
				console.error(e);
			}

		},
		firstOpenThirdApp(appInfo) {
			this.removeIdFromSessionStorage(appInfo.name);
			this.$EventBus.$emit(events.OPEN_APP_LAUNCHER, appInfo)
		}
	}
}
