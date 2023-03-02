/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/2/27 下午2:38
 * @FilePath: /CasaOS-UI/src/service/index.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

import axios from 'axios';
// app_management
import {Configuration, api} from "@/codegen/app_management";
import store from "@/store";
import router from "@/router";

// 初始化 openapi 配置
const config = new Configuration({
    basePath: process.env.VUE_APP_BASE_API,
    withCredentials: false,
});
//
const apiClient = new api(config);

const instance = axios.create({
    baseURL: Configuration.basePath,
    withCredentials: false,
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        config.headers.common["Language"] = getInitLang()
        const token = localStorage.getItem("access_token")
        const rtoken = localStorage.getItem("refresh_token")
        if (token) {
            config.headers.Authorization = token
            store.commit("SET_ACCESS_TOKEN", token);
            store.commit("SET_REFRESH_TOKEN", rtoken);
        }
        return config;
    }, (error) => {
        // Do something with request error
        return Promise.reject(error)
    }
)

// 返回拦截器
let isRefreshing = false
let requests = []
let logout = () => {
    router.push({name: "login"})
}
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error?.config;
        const refresh_token = localStorage.getItem("refresh_token")
        if (originalConfig.url !== "/users/register" && error?.response?.status === 401) {
            // Access Token was expired
            if (!isRefreshing) {
                isRefreshing = true

                instance.post("/v1/users/refresh", {
                    refresh_token: refresh_token,
                }).then(tokenRes => {
                    if (tokenRes.data.success == 200) {
                        localStorage.setItem("access_token", tokenRes.data.data.access_token);
                        localStorage.setItem("refresh_token", tokenRes.data.data.refresh_token);
                        localStorage.setItem("expires_at", tokenRes.data.data.expires_at);

                        store.commit("SET_ACCESS_TOKEN", tokenRes.data.data.access_token);
                        store.commit("SET_REFRESH_TOKEN", tokenRes.data.data.refresh_token);
                        originalConfig.headers.Authorization = tokenRes.data.data.access_token
                        instance.defaults.headers.Authorization = tokenRes.data.data.access_token
                        isRefreshing = false
                        return tokenRes.data.data.access_token
                    } else {
                        logout()
                    }
                }).then(token => {
                    requests.forEach(cb => cb(token))
                    requests = []
                }).catch(error => {
                    logout()
                    console.log(error);
                })

            }
            return new Promise(resolve => {
                requests.push((token) => {
                    originalConfig.headers = {}
                    originalConfig.headers.Authorization = token
                    resolve(instance(originalConfig))
                })
            })
        }
        return Promise.reject(error)

    }
)

apiClient.axios = instance;
export default apiClient;