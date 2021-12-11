import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: '/',
      path: '/',
      redirect: '/home'
    },
    {
      name: 'home',
      path: '/home',
      component: () =>
        import(/* webpackChunkName: "home-chunk" */ '@/views/bill/Home.vue')
    },
    {
      name: 'statistic',
      path: '/statistic',
      component: () =>
        import(
          /* webpackChunkName: "statistic-chunk" */ '@/views/Statistic.vue'
        )
    },
    {
      name: 'user',
      path: '/user',
      component: () =>
        import(/* webpackChunkName: "user-chunk" */ '@/views/user/User.vue')
    },
    {
      name: 'modifyPassword',
      path: '/modifyPassword',
      component: () =>
        import(
          /* webpackChunkName: "modifyPassword-chunk" */ '@/views/user/ModifyPassword.vue'
        )
    },
    {
      name: 'about',
      path: '/about',
      component: () =>
        import(/* webpackChunkName: "about-chunk" */ '@/views/user/About.vue')
    },
    {
      name: 'login',
      path: '/login',
      component: () =>
        import(/* webpackChunkName: "login-chunk" */ '@/views/Login.vue')
    },

    {
      name: 'detail',
      path: '/detail',
      component: () =>
        import(
          /* webpackChunkName: "billDetail-chunk" */ '@/views/bill/BillDetail.vue'
        )
    }
  ]
})

export default router
