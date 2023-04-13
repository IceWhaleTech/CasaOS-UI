/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-07-12 22:37:22
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 22:38:49
 * @FilePath: \CasaOS-UI\src\service\appCategories.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */
import {api} from "./service.js";

const PREFIX = "/app-categories"

const appCategories = {
	// get app category
	getAppCategory() {
		return api.get(`${PREFIX}`);
	}
}

export default appCategories;