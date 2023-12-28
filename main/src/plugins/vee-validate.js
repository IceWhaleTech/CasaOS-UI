/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/3/31 上午11:35
 * @FilePath: /CasaOS-UI/src/plugins/vee-validate.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

import { confirmed, email, length, min, required } from "vee-validate/dist/rules";
import { isURL } from 'validator';
import { extend } from "vee-validate";
import isValidHostname from 'is-valid-hostname';
import validate from 'uuid-validate';

extend("required", {
	...required,
	message: "This field is required"
});

extend("email", {
	...email,
	message: "This field must be a valid email"
});

extend("confirmed", {
	...confirmed,
	message: "This field confirmation does not match"
});

extend("length", {
	...length,
	message: "This field must have 2 options"
});

extend("min", {
	...min,
	message: "This field must have more than {length} characters"
});

extend('rfc1123', {
	validate: (value) => isValidHostname(value),
	message: 'You entered an invalid RFC1123 hostname',
});

extend('uuid', {
	validate: (value) => validate(value),
	message: 'You entered an invalid share ID',
});

extend('url', {
	validate: value => isURL(value, { require_protocol: true }),
	message: 'The field mast be a valid url',
})

extend('yaml_port', {
	validate: value => {
		let regExp = /^((\d{1,3}\.){3}\d{1,3}(:\d{1,5}(-\d{1,5})?)?)|((^\d{1,5}(-\d{1,5})?)$)/;

		return regExp.test(value)
	},
	message: 'The field mast be a valid docker-compose port',
})

extend('not_in_ports', {
	validate: (value, isInPortsResult) => {
		// true : 满足，成功
		// false : 不满足， 报错
		// return true
		return isInPortsResult?.[0] === 'false'
	},
	message: 'The port is used by other services',
})