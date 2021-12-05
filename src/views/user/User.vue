<template>
  <div class="user">
    <!-- 个人信息 -->
    <div class="head">
      <img
        class="avatar"
        src="https://nevermore-picbed-1304219157.cos.ap-guangzhou.myqcloud.com/cat%26duck.jpg"
      />
      <div class="info">
        <span class="name">{{ beautifyName || '' }}</span>
        <span class="signature">{{ signature || '' }}</span>
      </div>
    </div>
    <!-- 单元格 -->
    <div class="content">
      <van-cell
        icon="edit"
        @click="isShowSignature = true"
        title="修改个性签名"
        is-link
        size="large"
      />
      <van-cell
        icon="setting-o"
        title="修改密码"
        to="/modifyPassword"
        is-link
        size="large"
      />
      <van-cell
        icon="smile-o"
        to="/about"
        title="关于项目"
        is-link
        size="large"
      />
    </div>
    <van-dialog
      v-model:show="isShowSignature"
      @confirm="confirmSignature"
      title="个性签名"
      show-cancel-button
    >
      <van-field
        v-model="signature"
        rows="2"
        autosize
        type="textarea"
        maxlength="20"
        placeholder="请输入个性签名"
        show-word-limit
      />
    </van-dialog>
    <div class="btn-wrap">
      <van-button class="logout" type="danger" size="large" @click="logout"
        >退出登录</van-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import { useRouter } from 'vue-router'
export default {
  name: 'User',
  setup() {
    const userInfo = reactive({
      id: 0,
      username: '',
      signature: ''
    })
    const isShowSignature = ref(false)
    const router = useRouter()

    onMounted(async () => {
      getUserInfo()
    })

    // 用户名首字母大写
    const beautifyName = computed(
      () =>
        userInfo.username.slice(0, 1).toUpperCase() + userInfo.username.slice(1)
    )

    // 获取用户信息
    const getUserInfo = async () => {
      const { data } = await axios.get('/user/get_userinfo')
      Object.assign(userInfo, data)
      console.log(data)
    }

    const confirmSignature = async () => {
      const { data } = await axios.post('/user/edit_signature', {
        signature: userInfo.signature
      })
      Object.assign(userInfo, data)
    }

    const logout = () => {
      localStorage.removeItem('token')
      router.push({ path: '/login' })
    }

    return {
      ...toRefs(userInfo),
      beautifyName,
      isShowSignature,
      confirmSignature,
      logout
    }
  }
}
</script>
<style lang="less" scoped>
@import url('@/config/custom.less');
.user {
  min-height: 100%;
  background-color: #f5f5f5;
  // padding: 12px;
  .head {
    display: flex;
    // background: linear-gradient(315deg, #7fcea4 0%, #39be77 100%);
    background-color: #fff;
    padding: 20px;
    // border-radius: 4px;
    // margin-bottom: 12px;
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      // border: 3px solid #fff;
      margin-right: 10px;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .name {
        font-size: 18px;
        // color: #fff;
        font-weight: 500;
      }
      .signature {
        color: #fff;
        // background: rgba(0, 0, 0, 0.1);
        background-color: @primary;
        padding: 1px 5px;
        border-radius: 10px;
      }
    }
  }
  .content {
    margin-top: 20px;
    font-size: 40px;
  }
  .btn-wrap {
    margin-top: 20px;
  }
}
</style>
<style lang="less">
@import url('@/config/custom.less');

// .rate {
//   .van-dialog__content {
//     text-align: center;
//     padding: 20px 0;
//   }
// }

.van-dialog__confirm {
  color: @primary;
}
.van-dialog__confirm:active {
  color: @primary;
}
</style>
