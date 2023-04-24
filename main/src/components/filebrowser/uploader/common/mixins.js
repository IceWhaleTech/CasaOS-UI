/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/4/24 上午11:20
 * @FilePath: /CasaOS-UI/src/components/filebrowser/uploader/common/mixins.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

export const uploaderMixin = {
	inject: ['uploader']
}

export const supportMixin = {
	data() {
		return {
			support: true
		}
	},
	mounted() {
		this.support = this.uploader.uploader.support
	}
}
