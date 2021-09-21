const webpack = require('webpack')

module.exports = {
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
