/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023-08-10 00:33:40
 * @FilePath: /CasaOS-UI/main/webpack.test.config.js
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
		extensions: ['.js', '.json', '.css', '.vue']
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
	// css: {
	// 	loaderOptions: {
	// 		sass: {
	// 			additionalData: `@import "./src/assets/scss/common/_variables.scss";`
	// 		},
	// 		scss: {
	// 			additionalData: `@import "./src/assets/scss/common/_variables.scss";`
	// 		}
	// 	}
	// },
	module: {
		rules: [
			{
				test: /\.vue$/i,
				loader: 'vue-loader'
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: [
							'@babel/plugin-syntax-optional-chaining'
						]
					}
				}
			},
			{
				test: /\.css$/i,
				use: [
					'vue-style-loader',
					'css-loader',
					'postcss-loader'
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'images/'
				}
			},
			// 普通的 `.scss` 文件和 `*.vue` 文件中的
			// `<style lang="scss">` 块都应用它
			{
				test: /\.s(c|a)ss$/i,
				use: [
					'vue-style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						/*options: {
							sourceMap: true,
						},*/
					},
					{
						loader: 'sass-loader',
						options: {
							// indentedSyntax: true,
							// sass-loader version >= 8
							// sassOptions: {
							// 	indentedSyntax: true
							// },
							// additionalData: (content, loaderContext) => {
							// 	// More information about available properties https://webpack.js.org/api/loaders/
							// 	const {resourcePath, rootContext} = loaderContext;
							// 	const relativePath = path.relative(rootContext, resourcePath);
							//
							// 	if (relativePath === "styles/foo.scss") {
							// 		return "$value: 100px;" + content;
							// 	}
							//
							// 	return "$value: 200px;" + content;
							// },
							additionalData: `@import "./src/assets/scss/common/_variables.scss";`
						}
					}
				]
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