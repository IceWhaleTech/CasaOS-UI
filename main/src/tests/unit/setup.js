/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/7/31 上午11:07
 * @FilePath: /CasaOS-UI/main/src/test/setup.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

// https://v1.test-utils.vuejs.org/zh/installation/testing-single-file-components-with-mocha-webpack.html
require('jsdom-global')()

global.expect = require('expect')

// const hooks = require('require-extension-hooks')
// const Vue = require('vue')
//
// Vue.config.productionTip = false
//
// // https://vue-test-utils.vuejs.org/zh/guides/common-tips.html#%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E8%B0%83%E8%AF%95
// window.Date = Date
// window.requestAnimationFrame = function (callback) {
// 	setTimeout(callback, 0)
// }

