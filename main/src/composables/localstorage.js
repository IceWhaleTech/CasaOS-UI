/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/8/29 下午5:38
 * @FilePath: /CasaOS-UI/main/src/composables/localstorage.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

function renderSize(bytes) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	if (bytes === 0) return '0 Bytes'
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
	if (i === 0) return `${bytes} ${sizes[i]}`
	return `${parseFloat((bytes / (1024 ** i)).toFixed(2))} ${sizes[i]}`
}

export {renderSize}