/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-24 11:05:55
 * @Description: 
 * @FilePath: /CasaOS-UI/src/service/service.js
 */
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import store from '@/store'
// Set Post Headers
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = false;
if (process.env.NODE_ENV === "dev") {
    axios.defaults.baseURL = `${document.location.protocol}//${process.env.VUE_APP_DEV_IP}:${process.env.VUE_APP_DEV_PORT}/v1`;
} else {
    axios.defaults.baseURL = `/v1`
}

//Create a axios instance, And set timeout to 30s
const instance = axios.create({
    timeout: 60000,
});

const getLangFromBrowser = () => {
    var lang = navigator.language || navigator.userLanguage;
    lang = lang.toLowerCase().replace("-", "_");
    return lang
}

const getInitLang = () => {
    let lang = localStorage.getItem('lang') || getLangFromBrowser()
    return lang
}

//请求和响应拦截可以根据实际项目需求进行编写
// 请求发起前拦截
instance.interceptors.request.use((config) => {
    let token = ''
    if (localStorage.getItem("user_token")) {
        token = localStorage.getItem("user_token")
    }
    config.headers.Authorization = token
    config.headers.common["Language"] = getInitLang()
    store.commit('setToken', token)
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error)
})

// 响应拦截（请求返回后拦截）
instance.interceptors.response.use(response => {
    //console.log("响应拦截", response);
    return response;
}, error => {
    console.log('catch', error)
    if (error.response) {

        switch (error.response.status) {
            case 401:
                localStorage.removeItem('user_token') //可能是token过期，清除它
                router.replace({ //跳转到登录页面
                    path: '/login',
                    query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
                break;
            case 404:
                store.commit('setServiceError', true);
                break;
            case 500:
                break;
        }
    } else {

        store.commit('setServiceError', true);
    }
    return Promise.reject(error)
})

const CancelToken = axios.CancelToken;
//按照请求类型对axios进行封装
const api = {

    get(url, data, _this) {
        if (_this) {
            return instance.get(url, {
                params: data,
                cancelToken: new CancelToken(function executor(c) {
                    _this.cancelRequest = c
                })
            })
        } else {
            return instance.get(url, {
                params: data
            })
        }

    },
    post(url, data) {
        return instance.post(url, this._processData(url, data))
    },
    put(url, data) {
        return instance.put(url, this._processData(url, data))
    },
    delete(url, data) {
        return instance.delete(url, { data: data })
    },
    _processData(url, data) {
        const isJSON = (url.indexOf("setting") > 0 || url.indexOf("install") > 0 || url.indexOf("sys") > 0 || url.indexOf("file") > 0 || url.indexOf("user") > 0)

        let payload,
            contentType
        if (isJSON) {
            contentType = 'application/json';
            payload = JSON.stringify(data)
        } else {
            contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
            payload = qs.stringify(data)
        }
        axios.defaults.headers.post['Content-Type'] = contentType;
        return payload
    }
}
export { api }
