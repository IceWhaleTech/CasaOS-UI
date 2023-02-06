/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-02-18 10:20:10
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-06 17:56:20
 * @FilePath: /CasaOS-UI/vue.config.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

const webpack = require('webpack')
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const UselessFile = require('useless-files-webpack-plugin')
const path = require("path")
module.exports = {
    publicPath: '/',
    runtimeCompiler: true,
    lintOnSave: false,
    productionSourceMap: true,
    pluginOptions: {},
    css: {
        extract: true
    },
    configureWebpack: {
        module: {
            rules: [
                // architecture :: openAPI
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                        happyPackMode: true,
                    },
                    resolve: {
                        extensions: ['.ts', '.tsx', '.js', '.vue', '.json']
                    },
                },
            ],
        },
    },
    chainWebpack: config => {
        // config.entry('app').clear().add('./src/main.js')
        // config.module.rule('ts').test(/\.tsx?$/).use('ts-loader').loader('ts-loader').end().use('cache-loader').loader('cache-loader').end().use('babel-loader').loader('babel-loader').end()
        const oneOfsMap = config.module.rule("scss").oneOfs.store;
        oneOfsMap.forEach(item => {
            item
                .use("style-resources-loader")
                .loader("style-resources-loader")
                .options({
                    patterns: ["./src/assets/scss/common/_variables.scss"]
                })
                .end()
        })
        config.plugin('ignore')
            .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

        config.plugin('uselessFile')
            .use(
                new UselessFile({
                    root: path.resolve(__dirname, './src/assets/images'),
                    clean: true,
                    exclude: /node_modules/
                })
            )
        if (process.env.NODE_ENV === "prod") {
            config.output.filename('[name].[contenthash:8].js').end()
            config.output.chunkFilename('[name].[contenthash:8].js').end()
            config.optimization.minimize(true);
            // config.plugin('webpack-bundle-analyzer')
            //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            config.optimization.splitChunks({
                chunks: 'all'
            })

            config.optimization
                .minimizer('css')
                .use(require.resolve('optimize-css-assets-webpack-plugin'), [{ cssProcessorOptions: { safe: true } }])
        } else {
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
        contentBase: path.join(__dirname, 'src'),
        open: true,
        port: 8080,
        before: require('./mock/meta_data.js')
    }
}
