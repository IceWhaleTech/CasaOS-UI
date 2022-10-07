/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-02-18 10:20:10
 * @LastEditors: zhanghengxin ezreal.ice@icloud.com
 * @LastEditTime: 2022-09-29 16:51:55
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
    // configureWebpack: {
    //
    //
    //     module: {
    //         rules: [
    //             {
    //                 test: /\.tsx?$/,
    //                 loader: 'ts-loader',
    //                 exclude: /node_modules/,
    //                 options: {
    //                     appendTsSuffixTo: [/\.vue$/],
    //                     happyPackMode: true,
    //                     // resolveTypeReferenceDirective: {
    //                     //     '@': path.resolve(__dirname, 'src')
    //                     // },
    //
    //                 },
    //                 // "paths": {
    //                 //     "@/*": [
    //                 //         path.resolve(__dirname, 'src/*')
    //                 //     ]
    //                 // },
    //                 // "compilerOptions": {
    //                 //     "target": "esnext",
    //                 //     "module": "esnext",
    //                 //     "strict": true,
    //                 //     "jsx": "preserve",
    //                 //     "importHelpers": true,
    //                 //     "moduleResolution": "node",
    //                 //     "experimentalDecorators": true,
    //                 //     "esModuleInterop": true,
    //                 //     "allowSyntheticDefaultImports": true,
    //                 //     "sourceMap": true,
    //                 //     "baseUrl": ".",
    //                 //     "types": [
    //                 //         "webpack-env",
    //                 //         "mocha",
    //                 //         "chai"
    //                 //     ],
    //                 //
    //                 // }
    //             },
    //         ],
    //     },
    // },
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
        //
        if (process.env.NODE_ENV === "prod") {
            config.optimization.minimize(true);
            // config.plugin('webpack-bundle-analyzer')
            //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            config.optimization.splitChunks({
                chunks: 'all'
            })

            config.optimization
                .minimizer('css')
                .use(require.resolve('optimize-css-assets-webpack-plugin'), [{cssProcessorOptions: {safe: true}}])

        }
    },
    devServer: {
        // overlay: { //Show eslink error information on Browser
        //     warnings: true,
        //     errors: true
        // },
        contentBase: path.join(__dirname, 'src'),
        open: true,
        host: 'localhost',
        port: 8080,
        proxy: {
            "/v": {        // 自己的服务器
                target: "http://192.168.2.195:80",  // 要进入的服务器地址
                changeOrigin: true,
                // pathRewrite: {
                //     "/": "/"
                // }
            },
            // "/v2": {        // 自己的服务器
            //     target: "http://192.168.2.118:80",  // 要进入的服务器地址
            //     changeOrigin: true,
            //     // pathRewrite: {
            //     //     "/": "/"
            //     // }
            // },
        },
        before: require('./mock/v2_mock.js')

    }
}
