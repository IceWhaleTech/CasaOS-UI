/*
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-12 18:32:17
 * @FilePath: \CasaOS-UI-0.4.2\src\mixins\app\Business_OpenThirdApp.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

export default {
	methods: {
		openAppToNewWindow(appInfo) {
			this.hasNewTag(appInfo.name) ? this.firstOpenThirdApp(appInfo) : this.openThirdApp(appInfo, true);
		},
		openThirdApp(appInfo, isNewWindows) {
			this.$messageBus('apps_open', appInfo.name);
			if (appInfo.hostname !== "" || appInfo.port !== "" || appInfo.index !== "") {
				const hostIp = appInfo.hostname || this.$baseIp
				const scheme = appInfo.scheme || 'http'
				const port = appInfo.port ? `:${appInfo.port}` : ''
				const url = `${scheme}://${hostIp}${port}${appInfo.index}`
				// let href = window.location.href.split("#")[0]
				// if (url === href) {
				//     this.$buefy.toast.open({
				//         message: this.$t('The page to be opened is the same as current page'),
				//         type: 'is-warning',
				//         position: 'is-top',
				//         duration: 5000,
				//         queue: false,
				//         container: null,
				//         animation: 'fade',
				//         onOpen: () => {
				//         },
				//         onClose: () => {
				//         },
				//         ariaRole: 'alert',
				//         ariaLive: 'polite'
				//     })
				//     return
				// }
				if (appInfo.image.toLowerCase().indexOf("qbittorrent") === -1) {
					isNewWindows ? window.open(url, '_blank') : window.location.replace(url);
				} else if (isNewWindows) {
					var arg = '\u003cscript\u003elocation.replace("' + url + '")\u003c/script\u003e';
					window.open('javascript:window.name;', arg);
				} else {
					let html = document.createElement('a');
					html.href = url;
					html.rel = 'noreferrer';
					document.getElementById('app').appendChild(html)
					html.click();
				}
			}
		},
		async openThirdContainerByAppInfo(appInfo) {
			try {
				let allinfo = await this.$openAPI.appManagement.compose.myComposeApp(appInfo.id).then(res => {
					return res.data.data
				})
				let containerInfoV2 = allinfo.store_info.apps[appInfo.id].container
				console.log(containerInfoV2, 'containerInfoV2');
				let app = {
					"id": appInfo.id,
					"name": appInfo.id,
					scheme: containerInfoV2.scheme,
					hostname: containerInfoV2.hostname,
					port: containerInfoV2.port_map,
					index: containerInfoV2.index,
					image: allinfo.compose.services[appInfo.id].image,
				}
				this.openAppToNewWindow(app)
			} catch (e) {
				console.error(e);
			}

		},
		firstOpenThirdApp(appInfo) {
			this.removeIdFromSessionStorage(appInfo.id);
			let routeUrl = this.$router.resolve({
				name: 'AppLauncherCheck',
				path: '/launch',
				query: {
					appDetailData: JSON.stringify(appInfo)
				}
			});
			window.open(routeUrl.href, '_blank');
		}
	}
}