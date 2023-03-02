/*
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-12 18:32:17
 * @FilePath: \CasaOS-UI-0.4.2\src\mixins\app\Business_OpenThirdApp.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

import container from "@/service/container";

export default {
    methods: {
        openAppToNewWindow(appInfo) {
            this.hasNewTag(appInfo.id) ? this.firstOpenThirdApp(appInfo) : this.openThirdApp(appInfo, true);
        },
        openThirdApp(appInfo, isNewWindows) {
            this.$messageBus('apps_open', appInfo.name);
            if (appInfo.host !== "" || appInfo.port !== "" || appInfo.index !== "") {
                const hostIp = appInfo.host || this.$baseIp
                const protocol = appInfo.protocol || 'http'
                const port = appInfo.port ? `:${appInfo.port}` : ''
                const url = `${protocol}://${hostIp}${port}${appInfo.index}`
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
            const data = {
                "name": appInfo.title,
                "image": appInfo.image,
            }
            // TODO migrate to V2 api !!
            let containerInfo = await container.getMyAppList(data).then(res => res.data.data.casaos_apps)
            this.openAppToNewWindow(containerInfo[0])
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