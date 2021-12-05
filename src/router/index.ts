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
      component: () =>
        import(/* webpackChunkName: "home-chunk" */ '@/views/bill/Home.vue')
    },
    {
      path: '/data',
      component: () =>
        import(/* webpackChunkName: "data-chunk" */ '@/views/Data.vue')
    },
    {
      path: '/user',
      component: () =>
        import(/* webpackChunkName: "user-chunk" */ '@/views/user/User.vue')
    },
    {
      path: '/modifyPassword',
      component: () =>
        import(
          /* webpackChunkName: "user-chunk" */ '@/views/user/ModifyPassword.vue'
        )
    },
    {
      path: '/about',
      component: () =>
        import(
          /* webpackChunkName: "user-chunk" */ '@/views/user/About.vue'
        )
    },
    {
      path: '/login',
      component: () =>
        import(/* webpackChunkName: "login-chunk" */ '@/views/Login.vue')
    },
    {
      path: '/detail',
      component: () =>
        import(
          /* webpackChunkName: "login-chunk" */ '@/views/bill/BillDetail.vue'
        )
    }
  ]
})

export default router
