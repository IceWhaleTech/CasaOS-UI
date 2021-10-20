/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: JerryK
 * @LastEditTime: 2021-10-20 16:39:08
 * @Description: 
 * @FilePath: /CasaOS-UI/src/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import('@/views/Login.vue'),
    meta: { requireAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    hidden: true,
    component: () => import('@/views/Home.vue'),
    meta: { requireAuth: true }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
