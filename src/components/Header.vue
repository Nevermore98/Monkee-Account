<template>
  <div class="block"></div>

  <van-nav-bar
    class="header"
    @click-left="goBack"
    :title="title"
    left-text="返回"
    left-arrow
  >
    <template #right>
      <svg class="more">
        <use xlink:href="#icon-more"></use>
      </svg>
    </template>
  </van-nav-bar>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  setup() {
    const router = useRouter()
    const goBack = () => router.back()
    return {
      goBack
    }
  }
}
</script>

<style lang="less" scoped>
.block {
  width: 100%;
  height: 46px;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  .more {
    width: 22px;
    height: 22px;
  }
}
</style>
