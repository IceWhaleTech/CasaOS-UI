/*
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-12 18:30:18
 * @FilePath: \CasaOS-UI-0.4.2\src\mixins\app\Business_ShowNewAppTag.js
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
		this.newAppIds = this.getIdFromSessionStorage();
	},
	methods: {
		getSessionStorageOutputArray() {
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
		},
		hasNewTag(appId) {
			return this.newAppIds.indexOf(appId) !== -1;
		}
	}
}