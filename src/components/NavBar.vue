<template>
  <van-tabbar v-model="active">
    <van-tabbar-item icon="notes-o" @click="link('/home')"
      >明细</van-tabbar-item
    >
    <van-tabbar-item icon="bar-chart-o" @click="link('/data')"
      >统计</van-tabbar-item
    >
    <van-tabbar-item icon="user-o" @click="link('/user')">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  props: {
    msg: String,
  },
  setup() {
    const router = useRouter()
    const active = ref(0)

    const link = (path) => {
      router.push({ path })
    }

    return {
      active,
      link,
    }
  },
}

// script-setup
// const props = defineProps({
//   msg: String,
// })

// const router = useRouter()
// const active = ref('/home')

// const link = (path) => {
//   router.push({ path })
// }
</script>
