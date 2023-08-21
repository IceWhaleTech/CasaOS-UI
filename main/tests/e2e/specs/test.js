/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/8/15 下午5:56
 * @FilePath: /CasaOS-UI/main/tests/e2e/specs/test.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

// https://docs.cypress.io/api/table-of-contents

// describe('business::login', () => {
//
// 	it('login', () => {
// 		cy.visit('/#/login')
// 		cy.get('#username').type('casaos')
// 		cy.get('#password').type('casaos')
// 		cy.get('#login').click()
// 		cy.url().should('include', '/#/')
// 	})
// })

describe('business::home', () => {
	it('home', () => {
		cy.login()
	})
})
