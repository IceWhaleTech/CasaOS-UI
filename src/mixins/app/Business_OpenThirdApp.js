/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2022/12/20 下午6:36
 * @FilePath: /CasaOS-UI/src/mixins/app/Business_OpenThirdApp.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

import container from "@/service/container";

export default {
    methods: {
        openAppToNewWindow(appInfo) {
            this.removeIdFromSessionStorage(appInfo.id);
            let routeUrl = this.$router.resolve({
                name: 'AppLauncherCheck',
                path: '/launch',
                query: {
                    appDetailData: JSON.stringify(appInfo)
                }
            });
            window.open(routeUrl.href, '_blank');
        },
        openThirdApp(appInfo) {
            this.$messageBus('apps_open', appInfo.name);
            if (appInfo.host !== "" || appInfo.port !== "" || appInfo.index !== "") {
                const hostIp = appInfo.host || this.$baseIp
                const protocol = appInfo.protocol || 'http'
                const port = appInfo.port ? `:${appInfo.port}` : ''
                const url = `${protocol}://${hostIp}${port}${appInfo.index}`
                let href = window.location.href.split("#")[0]
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
                    window.location.replace(url);
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
            let containerInfo = await container.getMyAppList(data).then(res => res.data.data.casaos_apps)
            this.openAppToNewWindow(containerInfo[0])
        },
    }
}