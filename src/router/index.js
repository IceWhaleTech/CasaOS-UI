/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-06-28 14:36:41
 * @Description: 
 * @FilePath: \CasaOS-UI\src\router\index.js
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
    path: '/welcome',
    name: 'Welcome',
    hidden: true,
    component: () => import('@/views/Welcome.vue'),
    meta: { requireAuth: false }
  },
  {
    path: '/connect',
    name: 'CasaConnect',
    hidden: true,
    component: () => import('@/views/CasaConnect.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/a-sharing',
    name: 'CasaConnect1',
    hidden: true,
    component: () => import('@/views/CasaConnect.vue'),
    meta: { requireAuth: true }
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
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}


router.beforeEach((to, from, next) => {

  let localUser = localStorage.getItem("user_token");

  //Check if have a verison string in localStorage when access home page
  let version = localStorage.getItem("version");
  if (to.path == "/" && version == null) {
    localStorage.removeItem("user_token");
    next({ path: '/login' })
  }

  if (to.path == "/logout") {
    localStorage.removeItem("user_token");
    localStorage.removeItem("wallpaper");
    next({ path: '/login' })
  }
  if (to.meta.requireAuth) {
    if (localUser) {
      next()
    } else {
      next({ path: '/login' })
    }
  } else {
    if (localUser) {
      if (to.path == "/login") {
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      next();
    }
  }
})


export default router
