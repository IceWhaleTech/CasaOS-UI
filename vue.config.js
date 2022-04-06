/*
 * @Author: JerryK
 * @Date: 2021-09-22 10:10:10
 * @LastEditors: JerryK
 * @LastEditTime: 2022-01-21 17:46:29
 * @Description: 
 * @FilePath: /CasaOS-UI/vue.config.js
 */
const webpack = require('webpack')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
const UselessFile = require('useless-files-webpack-plugin')
const path = require("path")
module.exports = {
    publicPath: '/ui/',
    runtimeCompiler: true,
    lintOnSave: false,

    productionSourceMap: false,
    pluginOptions: {

    },
    chainWebpack: config => {
        config.plugin('ignore')
            .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
        // config.plugin('webpack-bundle-analyzer')
        //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        // config.plugin('compression')
        //     .use(
        //         new CompressionWebpackPlugin(
        //             {
        //                 filename: info => {
        //                     return `${info.path}.gz${info.query}`
        //                 },
        //                 algorithm: 'gzip',
        //                 threshold: 10240,
        //                 test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
        //                 minRatio: 0.8,
        //                 deleteOriginalAssets: true
        //             }
        //         )
        //     );
        config.plugin('uselessFile')
            .use(
                new UselessFile({
                    root: path.resolve(__dirname, './src/assets/images'),
                    clean: true,
                    exclude: /node_modules/
                })
            )
    }
}
