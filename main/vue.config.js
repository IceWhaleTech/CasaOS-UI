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

let env = {}
const prefixRE = /^VUE_APP_/;
for (const key in process.env) {
	if (key == "NODE_ENV" || key == "BASE_URL" || prefixRE.test(key)) {
		env[key] = JSON.stringify(process.env[key]);
		// env[key] = process.env[key];
	}
}
console.log(1111, env)

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
	configureWebpack: {
		resolve: {
			fallback: {
				"timers": require.resolve("timers-browserify"),
				"url": require.resolve("url/"),
				"https": require.resolve("https-browserify"),
				"http": require.resolve("stream-http"),
				"path": require.resolve("path-browserify"),
				"stream": require.resolve("stream-browserify")
			},
		},
		// plugins: [
		// 	// new webpack.IgnorePlugin({resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/}),
		// 	new webpack.DefinePlugin({
		// 		env
		// 	})
		// ]
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
			.use(new webpack.IgnorePlugin({resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/}));
		config.plugin('define').use(new webpack.DefinePlugin({
			"process.env": {
				...process.env,
				// ...env
			}
		}))
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
			config.plugin('webpack-bundle-analyzer')
				.use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
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
		// before: require('./mock/meta_data.js'),
		// contentBase: publicPath,
	}
}
