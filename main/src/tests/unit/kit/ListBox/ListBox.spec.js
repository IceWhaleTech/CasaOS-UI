/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/7/31 下午1:56
 * @FilePath: /CasaOS-UI/main/src/test/unit/kit/ListBox/ListBox.spec.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

import {shallowMount, mount} from '@vue/test-utils'
import ListBox               from '@/kit/ListBox/ListBox.vue'

const fullPropsObj = {
	activeAppStoreSourceInput: true,
	isMobile: true,
	currentOption: {
		name: '全部',
	},
	listData: [
		{count: 0, font: "author", id: 0, name: "All"},
		{count: 1, font: "author", id: 1, name: "official"},
		{count: 2, font: "author", id: 2, name: "by_casaos"},
		{count: 3, font: "author", id: 3, name: "community"}
	],
	icon: "",
}

// 测试组件是否渲染成功
describe('ListBox.vue', () => {
	it('renders props.msg when passed', () => {
		const wrapper = shallowMount(ListBox, {
			propsData: fullPropsObj,
		})
		console.log(wrapper.html())
		expect(wrapper.exists()).toBe(true);
		// expect(wrapper.html()).toMatchSnapshot();
	})
})

// 断言渲染出的 HTML 结构
// describe('ListBox.vue', () => {
// 	it('has a button', () => {
// 		const wrapper = mount(ListBox, {
// 			propsData: {fullPropsObj},
// 		})
// 		expect(wrapper.contains('button')).toBe(true)
// 	})
// })