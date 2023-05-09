/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/4/10 下午5:49
 * @FilePath: /CasaOS-UI/src/mixins/base/common-i18n.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

const i18n = function (data, fallback = 'en_us') {
	let lang = localStorage.getItem('lang')
	return data?.['custom'] || data?.[lang] || data?.[fallback] || data?.['en_US'];
}

// Common usage
const ice_i18n = i18n
export {ice_i18n};

// vue usage
export default {
	methods: {
		i18n
	}
}