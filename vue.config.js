/*
 * @Author: JerryK
 * @Date: 2021-09-22 10:10:10
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-20 16:52:53
 * @Description: 
 * @FilePath: /CasaOS-UI/vue.config.js
 */
const webpack = require('webpack')

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
    }
}
