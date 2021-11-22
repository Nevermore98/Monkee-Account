import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Data from '../views/Data.vue'
import User from '../views/User.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/data',
      component: Data
    },
    {
      path: '/user',
      component: User
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

export default router
