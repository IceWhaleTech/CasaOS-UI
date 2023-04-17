/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/4/7 下午1:56
 * @FilePath: /CasaOS-UI/src/mixins/app/Business_LinkApp.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

/* LinkApp mateData:
*  item.hostname
*  item.icon
*  item.name
*  item.app_type
*  item.status
*  item.id
* */
export default {
	methods: {
		async getLinkAppList() {
			try {
				// forecast null or String.
				let LinkAppList = localStorage.getItem("listLinkApp");
				if (LinkAppList) {
					LinkAppList = JSON.parse(LinkAppList);
				} else {
					LinkAppList = await this.$api.users.getLinkAppDetail().then(v => v.data.data);
					LinkAppList = this.transferLinkAppList(LinkAppList);
				}
				this.setLinkAppList(LinkAppList);
				return LinkAppList
			} catch (e) {
				console.error('getLinkAppList', e)
			}
		},

		setLinkAppList(LinkAppList) {
			if (LinkAppList === "") {
				LinkAppList = []
			}
			const stringifyLinkAppList = JSON.stringify(LinkAppList);

			return this.$api.users.saveLinkAppDetail(stringifyLinkAppList).then(res => {
				localStorage.setItem("listLinkApp", stringifyLinkAppList);
				return res;
			});
		},

		async deleteLinkAppByName(name) {
			let LinkAppList = await this.getLinkAppList();
			LinkAppList = LinkAppList.filter(item => item.name !== name);
			return this.setLinkAppList(LinkAppList);
		},

		// for former version.
		transferLinkAppList(LinkAppList) {
			LinkAppList.forEach(item => {
				if (item.type) {
					item.app_type = item.type;
					item.hostname = item.host;
					item.status = item.state;
					item.name = item.id;
					delete item.type;
					delete item.host;
					delete item.state;
					delete item.id;
					delete item.custom_id;
				}
			})
			console.log('transfer LinkAppList', LinkAppList);
			return LinkAppList;
		}
	}
}

