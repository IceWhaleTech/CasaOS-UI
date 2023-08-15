/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023-08-10 00:35:55
 * @FilePath: /CasaOS-UI/main/babel.config.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

module.exports = {
	presets: [
		"@babel/preset-env",
		'@vue/cli-plugin-babel/preset',
		[
			'@babel/preset-typescript', // 引用Typescript插件
			{
				allExtensions: true // 支持所有文件扩展名，否则在vue文件中使用ts会报错
			}
		]
	],
	plugins: ["@babel/plugin-syntax-optional-chaining"]
}
