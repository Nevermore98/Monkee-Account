<template>
  <div class="about">
    <Header title="关于项目" />
    <van-divider
      content-position="left"
      :style="{ color: '#39be77', borderColor: '#39be77', padding: '0 16px' }"
    >
      项目介绍
    </van-divider>
    <div class="content">
      <p>
        本项目是我在付费学习
        <a href="https://www.lanqiao.cn/courses/3097"
          >人人都能做的 Vue 3 记账本</a>
        实战课程过程中，加上一些自己的思考，自己动手实践完成的项目。此外，部分代码参考了开源仓库
        <a href="https://github.com/Blackn-L/day-day-account-book-frontend"
          >呆呆记账本</a>。
      </p>
      <p>
        本项目使用到的技术有：<strong
          >Vue3 + Typescript + Vite2 + Vant3 + Echarts5 + Axios</strong
        >。
      </p>
      <p>
        本项目使用到的插件有：
        <ul>
          <li>postcss-pxtorem：将 px 转化为 rem，适配移动端</li>
          <li>less：css 预编译器，编写简洁优雅的样式代码</li>
          <li>commitizen：规范化代码提交风格</li>
        </ul>
      </p>
      <p>
        本项目的大部分页面设计是对
        <a href="#小程序://微信记账本/MolMW4qwonfOZ1f">微信官方记账本小程序</a>
        的拙劣模仿。如有雷同，纯属致敬😝
      </p>
    </div>
    <van-divider
      content-position="left"
      :style="{ color: '#39be77', borderColor: '#39be77', padding: '0 16px' }"
    >
      后续改进
    </van-divider>
    <div class="content">
      <p>本项目代码较为臃肿，后续会采用 Vue3.2 版本推崇的 <a href="https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E5%9F%BA%E6%9C%AC%E8%AF%AD%E6%B3%95">script-setup</a> 语法以及抽离 hooks 的方法改写。</p>
      <p>存在用户体验不好的地方如：每次点击每笔账单详情返回后，账单页会刷新导致选中的日期初始化，后续会使用 keep-alive 缓存组件。</p>
    </div>

    <van-divider
      content-position="left"
      :style="{ color: '#39be77', borderColor: '#39be77', padding: '0 16px' }"
    >
      关于名字
    </van-divider>
    <div class="content">
      <p>萌奇是 monkee 的音译，是对猴子（monkey）的昵称。</p>
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

<style lang="less" scoped>
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
    a {
      color: #39be77;
      text-decoration: underline;
    }
    ul{
      margin: -10px 0 10px 16px;
      li {
        list-style: disc;
      }
    }
  }
}
</style>
