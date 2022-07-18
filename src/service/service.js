/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-18 15:49:04
 * @Description: 
 * @FilePath: /CasaOS-UI/src/service/service.js
 */
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import store from '@/store'
// import { ToastProgrammatic as Toast } from 'buefy'

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

// Response interception

let isRefreshing = false
let requests = []

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalConfig = error?.config;
        if (originalConfig.url !== "/user/register" && error.response) {
            // Access Token was expired
            if (error?.response?.status === 401) {
                if (!isRefreshing) {
                    isRefreshing = true
                    try {
                        const refresh_token = localStorage.getItem("refresh_token")
                        if (refresh_token) {
                            const tokenRes = await instance.post("/user/refresh", {
                                refresh_token: refresh_token,
                            });
                            if (tokenRes.data.success == 200) {
                                localStorage.setItem("access_token", tokenRes.data.data.access_token);
                                localStorage.setItem("refresh_token", tokenRes.data.data.refresh_token);
                                localStorage.setItem("expires_at", tokenRes.data.data.expires_at);

                                store.commit("SET_ACCESS_TOKEN", tokenRes.data.data.access_token);
                                store.commit("SET_REFRESH_TOKEN", tokenRes.data.data.refresh_token);

                                originalConfig.headers.Authorization = tokenRes.data.data.access_token
                                Promise.resolve().then(() => {
                                    requests.forEach(cb => cb())
                                    requests = []
                                })

                            } else {
                                router.replace({ //Jump to the logout page
                                    path: '/logout'
                                })
                            }
                        } else {
                            router.replace({ //Jump to the login page
                                path: '/login'
                            })
                        }
                    } catch (_error) {
                        return Promise.reject(_error);
                    }
                    isRefreshing = false

                }
                return new Promise(resolve => {
                    requests.push(() => { resolve(instance(originalConfig)) })
                })

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
        return instance.post(url, data)
    },
    put(url, data) {
        return instance.put(url, data)
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
