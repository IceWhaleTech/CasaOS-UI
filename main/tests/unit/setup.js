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

global.expect = require('expect').default

/*
const Vue = require('vue')
const {
	Icon,
	Field,
	Input,
	Tooltip,
	Dropdown,
	Image,
	Button,
	Switch,
	Select,
	Checkbox,
	Modal,
	Tabs,
	Toast,
	Tag,
	Loading,
	Progress,
	Autocomplete,
	Taginput,
	Upload,
	Notification,
	Dialog,
	Message
} = require('buefy')
// const {glob} = require("mochapack/lib/util/glob");

Vue.use(Icon)
Vue.use(Field)
Vue.use(Input)
Vue.use(Tooltip)
Vue.use(Dropdown)
Vue.use(Image)
Vue.use(Button)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Checkbox)
Vue.use(Modal)
Vue.use(Tabs)
Vue.use(Toast)
Vue.use(Tag)
Vue.use(Loading)
Vue.use(Progress)
Vue.use(Autocomplete)
Vue.use(Taginput)
Vue.use(Upload)
Vue.use(Notification)
Vue.use(Dialog)
Vue.use(Message)

global.localVue = Vue

*/
