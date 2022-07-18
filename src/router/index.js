/*
 * @Author: JerryK
 * @Date: 2021-09-18 21:32:13
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2022-07-15 10:50:31
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
      requireAuth: false,
      showBackground: true
    }
  },
  {
    path: '/terminal',
    name: 'Terminal',
    hidden: true,
    component: () => import('@/views/Terminal.vue'),
    meta: {
      requireAuth: false,
      showBackground: false
    }
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

  const accessToken = localStorage.getItem("access_token");
  const version = localStorage.getItem("version");
  const requireAuth = to.matched.some(record => record.meta.requireAuth);

  //Check if have a verison string in localStorage when access home page
  if (to.path == "/" && version == null) {
    localStorage.removeItem("access_token");
    next({ path: '/login' })
  }

  if (to.path == "/logout") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("wallpaper");
    next({ path: '/login' })
  }
  if (requireAuth) {
    if (accessToken) {
      next()
    } else {
      next({ path: '/login' })
    }
  } else {
    if (accessToken) {
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
