/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-02-18 10:20:10
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-12 13:18:35
 * @FilePath: \CasaOS-UI-0.4.2\vue.config.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

const webpack = require('webpack')
require("path");

const commitHash = require('child_process')
	.execSync('git describe --always')
	.toString()
	.trim();


module.exports = {
	publicPath: '/',
	runtimeCompiler: true,
	lintOnSave: false,
	productionSourceMap: true,
	pluginOptions: {},
	css: {
		extract: process.env.NODE_ENV === "prod" ? {
			ignoreOrder: true
		} : false
	},
	devServer: {
		open: true,
		port: 8080,
		inline: false, // vue-cli 5 not support inline mode.
		// before: require('./mock/meta_data.js'),
		hot: true,
		// contentBase: publicPath,
		proxy: {
			'/': {
				target: `http://${process.env.VUE_APP_DEV_IP}:${process.env.VUE_APP_DEV_PORT}`,
				changeOrigin: true,
			}
		}
	}
}
