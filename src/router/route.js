/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2022/12/7 上午10:09
 * @FilePath: /CasaOS-UI/src/router/route.js
 * @Description:
 *
 * Copyright (c) 2022 by IceWhale, All Rights Reserved.
 */

export default [
    {
        path: '/login',
        name: 'Login',
        hidden: true,
        component: () => import('@/views/Login.vue'),
        meta: {
            requireAuth: false,
            showBackground: true
        }
    },
    {
        path: '/welcome',
        name: 'Welcome',
        hidden: true,
        component: () => import('@/views/Welcome.vue'),
        meta: {
            requireAuth: false,
            showBackground: true
        }
    },
    {
        path: '/',
        name: 'Home',
        hidden: true,
        component: () => import('@/views/Home.vue'),
        meta: {
            requireAuth: true,
            showBackground: true
        }
    },
    {
        path: '/developmentElement',
        name: 'DevelopmentElement',
        hidden: true,
        component: () => import('@/components/Storage/DiskLearnMore.vue'),
        meta: {
            requireAuth: true,
            showBackground: false
        }
    }
]