/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023-07-13 12:39:22
 * @FilePath: /CasaOS-UI/main/src/service/index.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

import axios      from 'axios';
import {instance} from "@/service/service";
// app_management
import {
	Configuration,
	ComposeMethodsApiFactory,
	InternalMethodsApiFactory,
	AppStoreMethodsApiFactory, AppStoreMethodsApiFp, AppStoreMethodsApi
}                 from "@icewhale/casaos-appmanagement-openapi";

import store  from "@/store";
import router from "@/router";

const axiosBaseURL = (process.env.NODE_ENV === "dev") ? `${document.location.protocol}//${process.env.VUE_APP_DEV_IP}:${process.env.VUE_APP_DEV_PORT}` : ``

// 初始化 openapi 配置
const config = new Configuration({});

const appManagement = {}
appManagement.compose = new ComposeMethodsApiFactory(config, '/v2/app_management', instance);
// appManagement.appStore = new AppStoreMethodsApiFactory(config, '/v2/app_management', instance);
appManagement.appStore = new AppStoreMethodsApi(config, '/v2/app_management', instance);
const appGrid = new InternalMethodsApiFactory(config, '/v2/app_management', instance);
const appCompose = new ComposeMethodsApiFactory(config, '/v2/app_management', instance);

// apiClient.axios = instance;
export default {appManagement, appGrid, appCompose};