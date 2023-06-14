/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/2/27 下午2:38
 * @FilePath: /CasaOS-UI/src/service/index.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

import {instance} from "@/service/service";
import {
	AppStoreMethodsApi,
	ComposeMethodsApiFactory,
	Configuration,
	InternalMethodsApiFactory
}                 from "@icewhale/casaos-appmanagement-openapi";
import {
	ZerotierMethodsApi
}                 from "@icewhale/casaos-openapi";
import {
	FileApiFactory,
	FolderApiFactory,
}                 from "@icewhale/icewhale-files-openapi";

const axiosBaseURL = (process.env.NODE_ENV === "dev") ? `${document.location.protocol}//${process.env.VUE_APP_DEV_IP}:${process.env.VUE_APP_DEV_PORT}` : ``

// 初始化 openapi 配置
const config = new Configuration({});

const appManagement = {}
appManagement.compose = new ComposeMethodsApiFactory(config, '/v2/app_management', instance);
appManagement.appStore = new AppStoreMethodsApi(config, '/v2/app_management', instance);
const appGrid = new InternalMethodsApiFactory(config, '/v2/app_management', instance);
const zerotier = new ZerotierMethodsApi(config, '/v2/casaos/', instance);
const iceFile = new FileApiFactory(config, '/v2', instance);
const iceFolder = new FolderApiFactory(config, '/v2', instance);

export default {appManagement, appGrid, zerotier, iceFile, iceFolder}