/*
 * @Author: zhanghengxin ezreal.ice@icloud.com
 * @Date: 2022-09-22 19:00:01
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-22 21:20:11
 * @FilePath: /CasaOS-UI/mock/meta_data.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 *
 */

// 调用本地文件系统
const fs = require('fs');
const path = require('path');


// 【not use】
module.exports = function mock(app) {
	app.get('/v2/local_storage/mount1', (req, res) => {
		//
		res.json({
			"data": [
				{
					"extended": {
						"mergerfs.srcmounts": "b:c"
					},
					"fstype": "fuse.mergerfs",
					"id": 86,
					"mount_point": "/DATA/merged",
					"options": "rw,relatime",
					"source": "b:c"
				}
			]
		})
	});
	app.put('/v2/local_storage/mount1', (req, res) => {
		res.json({
			"data": {
				"extended": {
					"mergerfs.srcmounts": "/mnt/sdb:/mnt/sdc"
				},
				"fstype": "fuse.mergerfs",
				"id": 86,
				"mount_point": "/DATA/merged",
				"options": "rw,relatime",
				"source": "/mnt/sdb:/mnt/sdc"
			}
		})
	});

	// You Should Know :: noticeBlock.vue :: noticeData :: contentType[progress] :: App installing
	// Modified from socket.io[app_install]
	app.get('/mate_data/noticeBlock/noticeData/app_install_progress', (req, res) => {
		res.json({
			"data": {
				"name": "Transmission",
				"state": "INSTALLED",
				"type": "INSTALL",
				"icon": "https://cdn.jsdelivr.net/gh/IceWhaleTech/CasaOS-AppStore@main/Apps/Transmission/icon.png",
				"message": "App installing",
				// business :: coreService.vue :: whether to show notifications
				"finished": false,
				// business :: coreService.vue :: whether to update notifications
				"success": true
			}
		})
	});
	app.get('/modules/:path', (req, res) => {
		console.log(req, res)
		// 读取本地文件
		const filePath = path.join(__dirname, `../../packages/${req.params.path}/index.html`);
		fs.readFile(filePath, (err, file) => {
			// 允许跨域
			// res.header("Access-Control-Allow-Origin", "*");
			res.render(file)
		})
	})
}
