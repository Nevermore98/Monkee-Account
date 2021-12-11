<template>
  <div class="auth">
    <div class="title">萌奇记账</div>
    <img class="logo" src="@/assets/monkey.png" alt="logo" />

    <van-form @submit="onSubmit">
      <div class="form-wrap">
        <van-cell-group inset>
          <van-field
            clearable
            v-model="username"
            name="username"
            label="账号"
            placeholder="请输入账号"
            :rules="[{ required: true, message: '请填写账号' }]"
            autocomplete="on"
          />
          <van-field
            clearable
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[
              { required: true, message: '请输入6-20位密码，区分大小写' }
            ]"
            autocomplete="on"
          />
          <van-field
            v-if="type === 'register'"
            center
            clearable
            label="验证码"
            placeholder="请输入验证码"
            v-model="verifyInput"
            autocomplete="on"
          >
            <template #button>
              <VueImgVerify ref="verifyRef" />
            </template>
          </van-field>
        </van-cell-group>
      </div>
      <div class="button-wrap">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          class="submit-btn"
        >
          {{ type === 'register' ? '注册' : '登录' }}
        </van-button>
        <p
          v-if="type === 'register'"
          @click="changeType('login')"
          class="change-btn"
        >
          登录已有账号
        </p>
        <p v-else @click="changeType('register')" class="change-btn">
          没有账号，前往注册
        </p>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, ref } from 'vue'
import Header from '@/components/Header.vue'
import VueImgVerify from '@/components/VueImgVerify.vue'
import axios from '@/utils/axios'
import { Toast } from 'vant'
export default {
  name: 'Login',
  components: {
    Header,
    VueImgVerify
  },
  setup() {
    const verifyRef = ref(null)
    const state = reactive({
      username: '',
      password: '',
      type: 'register', // 登录注册模式切换参数
      verifyInput: '', // 验证码输入框输入的内容
      verifyCode: '', // 生成的验证图片内的文字
      loading: false
    })

    // 提交登录 or 注册表单
    const onSubmit = async (values) => {
      try {
        if (state.type === 'login') {
          const { data } = await axios.post('/user/login', {
            username: state.username,
            password: state.password
          })
          localStorage.setItem('token', data.token)
          window.location.href = '/'
        } else {
          state.verifyCode = verifyRef.value.verifyCode || ''
          if (
            verifyRef.value.verifyCode.toLowerCase() !==
            state.verifyInput.toLowerCase()
          ) {
            Toast.fail('验证码错误')
            return
          }
          state.loading = true
          const { data } = await axios.post('/user/register', {
            username: state.username,
            password: state.password
          })
          Toast.success('注册成功')
          state.type = 'login'
          state.loading = false
        }
      } catch (error) {
        state.loading = false
      }
    }
    // 切换登录和注册两种模式
    const changeType = (type) => {
      state.type = type
    }

    return {
      ...toRefs(state),
      onSubmit,
      changeType,
      verifyRef
    }
  }
}
</script>
<style lang="less" scoped>
@import url('@/config/custom.less');
.auth {
  // height: calc(~'(100% - 46px)');
  height: 100%;
  background: @primary-bg;
  .title {
    display: flex;
    justify-content: center;
    padding: 30px 10px;
    font-size: 36px;
    font-weight: bold;
  }
  .logo {
    width: 150px;
    display: block;
    margin: 0 auto;
    margin-bottom: 30px;
  }
  .form-wrap {
    min-height: 180px;
  }
  .button-wrap {
    margin-top: 10px;
    .submit-btn {
      background-color: @primary;
      border: @primary;
    }
    .change-btn {
      text-align: center;
      margin: 10px 0;
      color: @link-color;
      font-size: 14px;
    }
  }
}
</style>
<style lang="less">
.van-field__label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px !important;
}
.van-form {
  padding: 0 30px;
}
.van-cell-group--inset {
  margin: 0 !important;
}
</style>
