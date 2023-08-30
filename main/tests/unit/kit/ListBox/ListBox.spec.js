/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/7/31 下午1:56
 * @FilePath: /CasaOS-UI/main/src/test/unit/kit/ListBox/ListBox.spec.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

import {mount, createLocalVue} from '@vue/test-utils'
import ListBox                 from '@/kit/ListBox/ListBox.vue'
import Buefy                   from 'buefy'

const localVue = createLocalVue();
localVue.use(Buefy);
const fullPropsObj = {
	activeAppStoreSourceInput: false,
	isMobile: false,
	currentOption: {
		name: '全部',
	},
	listData: [
		{count: 0, font: "author", id: 0, name: "All"},
		{count: 1, font: "author", id: 1, name: "official"},
		{count: 2, font: "author", id: 2, name: "by_casaos"},
		{count: 3, font: "author", id: 3, name: "community"}
	],
	icon: "123",
}

// 测试组件是否渲染成功
describe('ListBox.vue', () => {
	const wrapper = mount(ListBox, {
		localVue,
		propsData: fullPropsObj,
	})

	it('渲染文件：：', () => {
		const element = document.getElementsByName('my-element')[0]
		// expect(wrapper.findComponent({name: 'slide-fade'}).isVisible()).toBe(true)
		expect(element)
	})

	it('传入数据正确：：', () => {
		expect(wrapper.props().activeAppStoreSourceInput).toEqual(fullPropsObj.activeAppStoreSourceInput)
		expect(wrapper.props().isMobile).toEqual(fullPropsObj.isMobile)
		expect(wrapper.props().currentOption).toEqual(fullPropsObj.currentOption)
		expect(wrapper.props().listData).toEqual(fullPropsObj.listData)
		expect(wrapper.props().icon).toEqual(fullPropsObj.icon)
	});

	it('数据正确渲染：：', () => {
		// expect(wrapper.text()).toMatch("全部")
		expect(wrapper.text()).toMatch("All")
		expect(wrapper.text()).toMatch("official")
		expect(wrapper.text()).toMatch("by_casaos")
		expect(wrapper.text()).toMatch("community")
	});

	it('测试选中点击事件：：', () => {
		const options = wrapper.findAll('.dropdown-item')
		options.at(1).trigger('click')
		expect(wrapper.emitted()['update-current-option'][0]).toEqual([{
			count: 1,
			font: "author",
			id: 1,
			name: "official"
		}])
	});

	it('点击事件，成功切换：：', async () => {

		await wrapper.findAll('h3').wrappers[2].trigger("click")
		expect(wrapper.emitted()['update-current-option'][1]).toEqual([{
			count: 2,
			font: "author",
			id: 2,
			name: "by_casaos"
		}])
	});
})