/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/8/18 下午3:06
 * @FilePath: /CasaOS-UI/main/tests/e2e/support/commands.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */
// import api from '@/service/api.js';
// const api = require('../../../src/service/api.js').default

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (email, password) => {
	cy.visit('/#/login')
	cy.get('#username').type('casaos')
	cy.get('#password').type('casaos')
	cy.get('#login').click()
	// cy.on('uncaught:exception', (err, runnable) => {
	// 	console.log(err);
	// 	return false;
	// });
	// try {
	// 	// api.users.login("casaos", "casaos")
	// 	cy.request('POST', '/v1/users/login', {
	// 		password: "casaos",
	// 		username: "casaos"
	// 	}).then((response) => {
	// 		cy.state('requests')
	// 		cy.log(response);
	// 		window.localStorage.setItem('access_token', response.data.data.token.access_token)
	// 		window.localStorage.setItem('refresh_token', response.data.data.token.refresh_token)
	// 	}).catch((err) => {
	// 		cy.log(err)
	// 	})
	// } catch (error) {
	// 	cy.log(error)
	// 	console.log(error)
	// }

})
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
