<template>
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
    // const state = reactive({
    //   menu: ['/home', '/data', '/user'],
    //   isShowNavBar: false,
    // })
    // const router = useRouter();
    //   router.afterEach(() => {
    //     // menu 内的路径都是需要展示底部导航栏的
    //     state.show = state.menu.includes(router.currentRoute.value.path);
    //   });
    // 优化为以下：

    const isShowNavBar = ref(true)
    const noShowTabbarRouteList = [
      '/login',
      '/detail',
      '/about',
      '/modifyPassword'
    ]
    const router = useRouter()
    router.afterEach(() => {
      isShowNavBar.value = !noShowTabbarRouteList.includes(
        router.currentRoute.value.path
      )
    })

    return {
      isShowNavBar
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
