/*
 * @Author: JerryK
 * @Date: 2021-09-22 10:10:10
 * @LastEditors: JerryK
 * @LastEditTime: 2021-09-22 13:38:11
 * @Description: 
 * @FilePath: /wuji/vue.config.js
 */
const webpack = require('webpack')

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/ui/' : '/',
    runtimeCompiler: true,
    lintOnSave: false,
    productionSourceMap: false,
    pluginOptions: {

    },
    chainWebpack: config => {
        config.plugin('ignore')
            .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    }

}
