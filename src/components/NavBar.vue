<template>
  <van-tabbar v-model="active">
    <van-tabbar-item name="/home" @click="link('/home')"
      >明细
      <template #icon>
        <svg class="icon">
          <use xlink:href="#icon-bill" />
        </svg>
      </template>
    </van-tabbar-item>
    <van-tabbar-item name="/statistic" @click="link('/statistic')"
      >统计
      <template #icon>
        <svg class="icon">
          <use xlink:href="#icon-statistic" />
        </svg> </template
    ></van-tabbar-item>
    <van-tabbar-item name="/user" @click="link('/user')"
      >我的
      <template #icon>
        <svg class="icon">
          <use xlink:href="#icon-user" />
        </svg> </template
    ></van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  props: {
    msg: String
  },
  setup() {
    const router = useRouter()
    const active = ref('/home')

    const link = (path) => {
      router.push({ path })
    }

    onMounted(() => {
      active.value = router.currentRoute.value.path
    })

    router.afterEach(() => {
      active.value = router.currentRoute.value.path
    })

    return {
      active,
      link
    }
  }
}
</script>
<style lang="less">
@import url('@/config/custom.less');
.van-tabbar-item--active {
  color: @primary!important;
}
</style>
