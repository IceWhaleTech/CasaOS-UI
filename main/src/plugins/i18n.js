/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/4/6 下午3:47
 * @FilePath: /CasaOS-UI/src/plugins/i18n.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

import Vue      from 'vue'
import VueI18n  from 'vue-i18n'
import messages from '@/assets/lang'

Vue.use(VueI18n)

const i18n = new VueI18n({
	// Define defalut language
	locale: localStorage.getItem('lang') || 'en_us',
	fallbackLocale: 'en_us',
	silentTranslationWarn: true,
	messages
})

export default i18n
