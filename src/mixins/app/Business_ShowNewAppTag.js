/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2022/12/20 下午3:14
 * @FilePath: /CasaOS-UI/src/mixins/Business_ShowNewAppTag.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

// appId : container id
export default {
    data() {
        return {
            newAppIds: Object.freeze([]),
        }
    },
    mounted() {
        this.newAppIds = this.getIdFromSessionStorage();
    },
    methods: {
        getSessionStorageOutputArray(item) {
            let newAppTag = sessionStorage.getItem('newAppTag');
            if (newAppTag === null) {
                return [];
            } else {
                return JSON.parse(newAppTag);
            }
        },
        addIdToSessionStorage(appId) {
            let newAppTag = this.getSessionStorageOutputArray('newAppTag');
            if (newAppTag.length > 0) {
                if (newAppTag.indexOf(appId) === -1) {
                    newAppTag.push(appId);
                }
            } else {
                newAppTag = [appId];
            }
            this.newAppIds = newAppTag;
            sessionStorage.setItem('newAppTag', JSON.stringify(newAppTag));
        },
        removeIdFromSessionStorage(appId) {
            let newAppTag = this.getSessionStorageOutputArray('newAppTag');
            if (newAppTag.length > 0) {
                if (newAppTag.indexOf(appId) !== -1) {
                    newAppTag.splice(newAppTag.indexOf(appId), 1);
                }
            }
            this.newAppIds = newAppTag;
            sessionStorage.setItem('newAppTag', JSON.stringify(newAppTag));
        },
        getIdFromSessionStorage() {
            return this.getSessionStorageOutputArray('newAppTag');
        }
    }
}