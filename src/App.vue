<template>
  <!-- 需要使用动态缓存 -->
  <!-- https://blog.csdn.net/weixin_43695464/article/details/120178903 -->
  <!-- https://segmentfault.com/q/1010000040805838 -->
  <!-- <router-view v-slot="{ Component }">
    <keep-alive :max="6">
      <component
        :is="Component"
        :key="$route.fullPath"
        v-if="isKeepAlive"
      ></component>
    </keep-alive>
  </router-view> -->
  <router-view />
  <NavBar v-if="isShowNavBar" />
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
export default {
  name: 'App',
  components: {
    NavBar
  },
  setup() {
    const isShowNavBar = ref(true)
    const isKeepAlive = ref(true)
    const noShowTabbarRouteList = [
      '/login',
      '/detail',
      '/about',
      '/modifyPassword'
    ]
    // const keepAliveRouteList = [
    //   '/home',
    //   // '/login',
    //   // '/statistic',
    //   // '/user',
    //   '/detail',
    //   '/modifyPassword',
    //   '/about'
    // ]
    const router = useRouter()
    router.afterEach(() => {
      isShowNavBar.value = !noShowTabbarRouteList.includes(
        router.currentRoute.value.path
      )
      // isKeepAlive.value = keepAliveRouteList.includes(
      //   router.currentRoute.value.path
      // )
    })

    return {
      isShowNavBar
      // isKeepAlive
    }
  }
}
</script>
<!-- 搞不定组件动画 -->
<!-- <style>
.aside-right-enter-active,
.aside-right-leave-active {
  transition: all 0.5s ease;
}

.aside-right-enter-from,
.aside-right-leave-to {
  transform: translate(-100%, 0);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.75s ease-out;
}

.slide-enter-to {
  position: absolute;
  right: 0;
}

.slide-enter-from {
  position: absolute;
  right: -100%;
}

.slide-leave-to {
  position: absolute;
  left: -100%;
}

.slide-leave-from {
  position: absolute;
  left: 0;
}
</style> -->
