/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-12 21:26:47
 * @Description: 
 * @FilePath: \CasaOS-UI\src\service\service.new.js
 */
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import store from '@/store'
import { ToastProgrammatic as Toast } from 'buefy'

const axiosBaseURL = (process.env.NODE_ENV === "dev") ? `${document.location.protocol}//${process.env.VUE_APP_DEV_IP}:${process.env.VUE_APP_DEV_PORT}/v1` : `/v1`

//Create a axios instance, And set timeout to 30s
const instance = axios.create({
    baseURL: axiosBaseURL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
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


// Interception before request initiation
instance.interceptors.request.use(
    (config) => {
        config.headers.common["Language"] = getInitLang()
        const token = localStorage.getItem("user_token")
        if (token) {
            config.headers.Authorization = token
            store.commit('setToken', token)
        }
        return config;
    }, (error) => {
        // Do something with request error
        return Promise.reject(error)
    }
)

// Response interception
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error.config;
        if (originalConfig.url !== "/user/register" && error.response) {
            // Access Token was expired
            if (error.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    const refresh_token = localStorage.getItem("refresh_token")
                    if (refresh_token) {
                        const res = await instance.post("/user/refresh", {
                            refreshToken: localStorage.getItem("refresh_token"),
                        });
                        // const { accessToken } = res.data;
                        console.log(res.data);
                    } else {
                        router.replace({ //Jump to the 404 page
                            path: '/404'
                        })
                    }


                    // 这里要检测返回，如果能获取token继续，如果获取到错误则跳转到登录页面
                    // store.commit('setToken', accessToken)
                    // localStorage.setItem("user_token", accessToken)
                    return instance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            } else if (error.response.status === 404) {
                router.replace({ //Jump to the 404 page
                    path: '/404'
                })
            } else if (error.response.status === 500) {
                Toast.open('Toasty!')
                store.commit('setServiceError', true);
            } else if (error.response.status === 502) {
                store.commit('setServiceError', true);
            }

        }
        return Promise.reject(error)
    }
)


const CancelToken = axios.CancelToken;
// Wrapping of axios by request type
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
