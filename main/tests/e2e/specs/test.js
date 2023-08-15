/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/8/15 下午5:56
 * @FilePath: /CasaOS-UI/main/tests/e2e/specs/test.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

// https://docs.cypress.io/api/table-of-contents

describe('My First Test', () => {
	it('Visits the app root url', () => {
		cy.visit('/')
		cy.contains('h1', 'Welcome to Your Vue.js App')
	})
})
