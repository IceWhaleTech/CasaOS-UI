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
            newAppIds: [],
        }
    },
    mounted() {
        this.newAppIds = this.getIdFromLocalStorage();
    },
    methods: {
        getLocalStorageOutputArray(item) {
            let newAppTag = localStorage.getItem('newAppTag');
            if (newAppTag === null) {
                return [];
            } else {
                return JSON.parse(newAppTag);
            }
        },
        addIdToLocalStorage(appId) {
            let newAppTag = this.getLocalStorageOutputArray('newAppTag');
            if (newAppTag) {
                newAppTag = JSON.parse(newAppTag);
                if (newAppTag.indexOf(appId) === -1) {
                    newAppTag.push(appId);
                }
            } else {
                newAppTag = [appId];
            }
            this.newAppIds = newAppTag;
            localStorage.setItem('newAppTag', JSON.stringify(newAppTag));
        },
        removeIdFromLocalStorage(appId) {
            let newAppTag = this.getLocalStorageOutputArray('newAppTag');
            if (newAppTag) {
                newAppTag = JSON.parse(newAppTag);
                if (newAppTag.indexOf(appId) !== -1) {
                    newAppTag.splice(newAppTag.indexOf(appId), 1);
                }
            }
            this.newAppIds = newAppTag;
            localStorage.setItem('newAppTag', JSON.stringify(newAppTag));
        },
        getIdFromLocalStorage() {
            let newAppTag = this.getLocalStorageOutputArray('newAppTag');
            if (newAppTag) {
                newAppTag = JSON.parse(newAppTag);
                return newAppTag;
            } else {
                return [];
            }
        }
    }
}