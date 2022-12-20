/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2022/12/20 下午6:36
 * @FilePath: /CasaOS-UI/src/mixins/app/Business_OpenThirdApp.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

export default {
    methods: {
        openThirdApp(appInfo) {
            if ((appInfo.host !== "" || appInfo.port !== "" || appInfo.index !== "") && appInfo.state === 'running') {
                const hostIp = appInfo.host || this.$baseIp
                const protocol = appInfo.protocol || 'http'
                const port = appInfo.port ? `:${appInfo.port}` : ''
                const url = `${protocol}://${hostIp}${port}${appInfo.index}`
                let href = window.location.href.split("#")[0]
                if (url === href) {
                    this.$buefy.toast.open({
                        message: this.$t('The page to be opened is the same as current page'),
                        type: 'is-warning',
                        position: 'is-top',
                        duration: 5000,
                        queue: false,
                        container: null,
                        animation: 'fade',
                        onOpen: () => {
                        },
                        onClose: () => {
                        },
                        ariaRole: 'alert',
                        ariaLive: 'polite'
                    })
                    return
                }
                if (appInfo.image.toLowerCase().indexOf("qbittorrent") == -1) {
                    window.open(url, '_blank');
                } else {
                    let arg = '\u003cscript\u003elocation.replace("' + url + '")\u003c/script\u003e';
                    window.open('javascript:window.name;', arg);
                }
            }
        },
        async openThirdAppById(appId) {
            // TODO >> WAITTING API
            let appInfo = await this.$api.apps.getContainerInfo(appId).then(res => res.data)
            this.openThirdApp(appInfo)
        }
    }
}