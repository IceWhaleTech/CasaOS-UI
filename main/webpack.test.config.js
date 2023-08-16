/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/7/31 上午11:03
 * @FilePath: /CasaOS-UI/main/webpack.config.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

const nodeExternals = require('webpack-node-externals');
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
	mode: 'development',
	resolve: {
		alias: {"@": path.resolve(__dirname, 'src')},
	},
	target: 'node',
	externals: [nodeExternals()],
	devtool: 'inline-cheap-module-source-map',
	output: {
		// https://v1.test-utils.vuejs.org/zh/installation/testing-single-file-components-with-mocha-webpack.html
		// 在源码表中使用绝对路径 (对于在 IDE 中调试时很重要)
		devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.spec\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'images/'
				}
			}
		]
	},
	plugins: [
		// new HtmlWebpackPlugin({
		// 	template: './public/index.html'
		// }),
		new VueLoaderPlugin()
	]
}