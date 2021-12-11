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
      path: '/statistic',
      component: () =>
        import(
          /* webpackChunkName: "statistic-chunk" */ '@/views/Statistic.vue'
        )
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
          /* webpackChunkName: "modifyPassword-chunk" */ '@/views/user/ModifyPassword.vue'
        )
    },
    {
      path: '/about',
      component: () =>
        import(/* webpackChunkName: "about-chunk" */ '@/views/user/About.vue')
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
          /* webpackChunkName: "billDetail-chunk" */ '@/views/bill/BillDetail.vue'
        )
    }
  ]
})

export default router
