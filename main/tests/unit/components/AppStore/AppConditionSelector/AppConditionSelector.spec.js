/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/7/31 上午11:35
 * @FilePath: /CasaOS-UI/main/src/test/unit/components/AppStore/AppConditionSelector/AppConditionSelector.spec.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

import {mount}              from '@vue/test-utils'
import AppConditionSelector from '@/components/AppStore/AppConditionSelector/AppConditionSelector.vue'

describe('AppConditionSelector', () => {
	const wrapper = mount(AppConditionSelector, {
		// localVue,
		propsData: {
			installedList: [],
			isLoading: false,
			isMobile: false,
			pageList: [],
		}
	})

	it('renders correctly', () => {
		expect(wrapper.exists()).toBe(true)
	})

	// 测试更新数据
	it('测试更新数据', () => {
		// 更新 search 数据
		wrapper.setProps({search: 'test'})
	})
})
const V = localVue

// 测试手机端
describe('AppConditionSelector', () => {
	const wrapper = mount(AppConditionSelector, {
		localVue,
		propsData: {
			installedList: [],
			isLoading: false,
			isMobile: true,
			pageList: 1,
		}
	})
	console.log(V === localVue)
	it('renders correctly', () => {
		expect(wrapper.exists()).toBe(true)
	})

	// 测试传输数据
	it('测试更新数据', () => {
		// 更新 search 数据
		wrapper.setProps({search: 'test'})
	})
})