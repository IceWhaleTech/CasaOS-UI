/*
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-24 17:51:33
 * @FilePath: /CasaOS-UI/src/router/route.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

export default [
	{
		path: '/login',
		name: 'Login',
		hidden: true,
		component: () => import('@/views/Login.vue'),
		meta: {
			requireAuth: false,
			showBackground: true
		}
	},
	{
		path: '/welcome',
		name: 'Welcome',
		hidden: true,
		component: () => import('@/views/Welcome.vue'),
		meta: {
			requireAuth: false,
			showBackground: true
		}
	},
	{
		path: '/',
		name: 'Home',
		hidden: true,
		component: () => import('@/views/Home.vue'),
		meta: {
			requireAuth: true,
			showBackground: true
		}
	},
	// {
	// 	path: '/files',
	// 	name: 'Files',
	// 	hidden: true,
	// 	component: () => import('@/components/filebrowser/FilePanel.vue'),
	// 	meta: {
	// 		requireAuth: true,
	// 		showBackground: true
	// 	}
	// },
	{
		path: '/launch',
		name: 'AppLauncherCheck',
		hidden: true,
		component: () => import('@/views/AppLauncherCheck.vue'),
		meta: {
			requireAuth: false,
			showBackground: false
		}
	},
	{
		path: '/developmentElement',
		name: 'DevelopmentElement',
		hidden: true,
		component: () => import('@/components/Apps/AppPanel.vue'),
		meta: {
			requireAuth: true,
			showBackground: false
		},
		props: {
			id: '0',
			state: "update",
			isCasa: true,
			runningStatus: "install",
			configData: {
				"networks": [{
					"driver": "host",
					"id": "198ec1144c000f9bea7dee9680a23f5789e76509d710524731459c62f44f1459",
					"name": "host"
				}, {
					"driver": "bridge",
					"id": "255c2c05a450d5622b4f1a7245ee2792cc06c8edb28c6b1628b4e6c01c0c58f7",
					"name": "bridge"
				}],
				"memory": {
					"available": 6765101056,
					"free": 5911064576,
					"total": 8180174848,
					"used": 1202368512,
					"usedPercent": 14.7
				}
			},
			settingData: undefined
		}
	},
]