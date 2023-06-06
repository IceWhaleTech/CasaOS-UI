/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/5/30 下午7:51
 * @FilePath: /CasaOS-UI/main/script/gatherMicro.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */
// 引入 files 模块
const fs = import('node:fs');
// 引入nodejs的path模块
const path = import('node:path');

let resultArray = [
	{
		"title": "icewhale_files",
		"entry": "/modules/icewhale_files",
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
	}
];

export default function gatherMicro() {
	// let resultArray = []
	// 获取packages文件夹路径
	const currentPath = path.resolve(__dirname, '../packages');

	// 读取packages文件夹下的所有文件夹
	const folders = fs.readdirSync(currentPath, {withFileTypes: true})
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);

	// 遍历每个文件夹
	folders.forEach(folder => {
		// 判断文件夹下是否存在 entry.json
		const entryPath = path.join(currentPath, folder, 'entry.json');
		if (fs.existsSync(entryPath)) {
			// 如果存在，读取 entry.json 内容
			const entryContent = fs.readFileSync(entryPath, 'utf8');
			resultArray.push(entryContent)
		}
	});

	return resultArray;
}