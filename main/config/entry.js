/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/6/7 上午11:14
 * @FilePath: /CasaOS-UI/main/config/entry.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

exports.entry = [{
	"name": "icewhale_files",
	"title": {
		"en_us": "icewhale_files",
	},
	"entry": "http://localhost:8081",
	"prefetch": true,
	"icon": "/modules/icewhale_files/icon.png",
	"description": "xxxx",
	"formality": {
		"type": "modal",
		"props": {
			"fullscreen": true,
			"hasModalCard": true,
			"animation": "zoom-in"
		}
	}
}]
