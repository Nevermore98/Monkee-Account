<template>
  <div class="block"></div>

  <van-nav-bar class="header" @click-left="goBack" :title="title" left-arrow>
  </van-nav-bar>
</template>

<script lang="ts">
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
}
</style>
<style lang="less">
@import url('@/config/custom.less');
// 全局修改样式，不加 .header
.van-nav-bar .van-icon {
  color: @color-text-base;
}
.van-nav-bar__arrow {
  font-size: 20px;
}
</style>
