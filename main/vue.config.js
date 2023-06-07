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
const path = require("path")

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
		extract: {
			ignoreOrder: true
		}
	},
	chainWebpack: config => {
		const oneOfsMap = config.module.rule("scss").oneOfs.store;
		oneOfsMap.forEach(item => {
			item
				.use("style-resources-loader")
				.loader("style-resources-loader")
				.options({
					patterns: [
						"./src/assets/scss/common/_variables.scss",
						"./src/assets/scss/common/_color.scss"
					]
				})
				.end()
		})
		config.plugin('ignore')
			.use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
		config.plugin('define')
			.use(require('webpack/lib/DefinePlugin'), [{
				VUE_FILE_APP_ENTRY: JSON.stringify(process.env.VUE_FILE_APP_ENTRY),
				VUE_REMOTE_ACCESS_APP_ENTRY: JSON.stringify(process.env.VUE_REMOTE_ACCESS_APP_ENTRY),
				MAIN_APP_VERSION_ID: JSON.stringify(commitHash),
				BUILT_TIME: JSON.stringify(Date.now())
			}]);
		// Production only
		if (process.env.NODE_ENV === "prod") {
			config.output.filename('[name].[contenthash:8].js').end()
			config.output.chunkFilename('[name].[contenthash:8].js').end()
			config.optimization.minimize(true);
			config.optimization.splitChunks({
				chunks: 'all'
			})

			config.optimization
				.minimizer('css')
				.use(require.resolve('optimize-css-assets-webpack-plugin'), [{cssProcessorOptions: {safe: true}}])
		} else {
			// Development only
			// config.plugin('webpack-bundle-analyzer')
			// 	.use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
			config.devServer.proxy({
				'/': {
					target: `http://${process.env.VUE_APP_DEV_IP}:${process.env.VUE_APP_DEV_PORT}`,
					changeOrigin: true,
				}
			})
		}
	},
	devServer: {
		open: true,
		port: 8080,
		inline: false,
		before: require('./mock/meta_data.js'),
		// contentBase: publicPath,
	}
}
