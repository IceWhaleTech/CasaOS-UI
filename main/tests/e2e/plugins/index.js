/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/8/15 下午5:56
 * @FilePath: /CasaOS-UI/main/tests/e2e/plugins/index.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
	// on('file:preprocessor', webpack({
	//  webpackOptions: require('@vue/cli-service/webpack.config'),
	//  watchOptions: {}
	// }))

	return Object.assign({}, config, {
		fixturesFolder: 'tests/e2e/fixtures',
		integrationFolder: 'tests/e2e/specs',
		screenshotsFolder: 'tests/e2e/screenshots',
		videosFolder: 'tests/e2e/videos',
		supportFile: 'tests/e2e/support/index.js'
	})
}
