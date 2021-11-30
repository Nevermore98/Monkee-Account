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
    const noShowTabbarRouteList = ['/login', '/detail']
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
