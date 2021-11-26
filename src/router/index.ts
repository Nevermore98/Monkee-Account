import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import(/* webpackChunkName: "home-chunk" */'../views/Home.vue'),
    },
    {
      path: '/data',
      component: () => import(/* webpackChunkName: "data-chunk" */'../views/Data.vue'),
    },
    {
      path: '/user',
      component: () => import(/* webpackChunkName: "user-chunk" */'../views/User.vue'),
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login-chunk" */'../views/Login.vue'),
    }
  ]
})

export default router
