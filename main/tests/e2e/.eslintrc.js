/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/8/15 下午5:56
 * @FilePath: /CasaOS-UI/main/tests/e2e/.eslintrc.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

module.exports = {
	plugins: [
		'cypress'
	],
	env: {
		mocha: true,
		'cypress/globals': true
	},
	rules: {
		strict: 'off'
	}
}
