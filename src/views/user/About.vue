<template>
  <div class="about">
    <Header title="关于项目" />
    <van-divider
      content-position="left"
      :style="{ color: '#39be77', borderColor: '#39be77', padding: '0 16px' }"
    >
      项目介绍
    </van-divider>
    <div class="content">本项目是我在学习</div>
    <van-divider
      content-position="left"
      :style="{ color: '#39be77', borderColor: '#39be77', padding: '0 16px' }"
    >
      项目介绍
    </van-divider>
    <div class="content">
      <p></p>
    </div>
  </div>
</template>

<script lang="ts">
import Header from '@/components/Header.vue'
export default {
  name: 'About',
  components: {
    Header
  }
}
</script>

<style lang="less">
@import url('@/config/custom.less');
.about {
  .content {
    padding: 0 16px;
    font-size: 14px;
    color: @color-text-caption;
    line-height: 24px;
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
