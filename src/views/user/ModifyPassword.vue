<template>
  <div class="edit">
    <Header title="修改密码" />
    <Header title="修改密码" />

    <div class="edit-wrap">
      <van-cell-group inset>
        <van-field
          v-model="oldPassword"
          type="password"
          label="原密码"
          placeholder="请输入原密码"
          clearable
          autocomplete="off"
        />
        <van-field
          v-model="newPassword"
          type="password"
          label="新密码"
          placeholder="请输入新密码"
          clearable
          autocomplete="off"
        />
        <van-field
          v-model="repeatPassword"
          type="password"
          label="确认密码"
          placeholder="请再次输入新密码"
          @blur="comparePassword"
          :error-message="errorMessage"
          v-bind:disabled="!newPassword"
          clearable
          autocomplete="off"
        />
      </van-cell-group>
    </div>

    <div class="btn-wrap">
      <van-button
        round
        block
        type="primary"
        color="#39be77"
        @click="submitModify"
        v-bind:disabled="!isConsistent"
      >
        提交修改
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import axios from '@/utils/axios'
export default {
  components: {
    Header
  },
  setup() {
    const oldPassword = ref('')
    const newPassword = ref('')
    const repeatPassword = ref('')
    const isConsistent = ref(false)
    const errorMessage = ref('')
    const router = useRouter()
    // 比对前后输入的新密码
    const comparePassword = () => {
      errorMessage.value =
        newPassword.value === repeatPassword.value ? '' : '两次输入的密码不一致'
      isConsistent.value =
        newPassword.value === repeatPassword.value ? true : false
    }
    // 提交修改
    const submitModify = () => {
      if (newPassword.value != repeatPassword.value) {
        Toast.fail('新密码不一致')
        return
      }
      if (!oldPassword.value.trim() || !newPassword.value?.trim()) {
        Toast.fail('输入不能为空')
        return
      }
      try {
        const { data, code } = axios.post('/user/modify_pass', {
          old_pass: oldPassword.value,
          new_pass: newPassword.value,
          new_pass2: repeatPassword.value
        })
        if (code !== 400) {
          Toast.success('修改成功')
          setTimeout(() => {
            router.push('/user')
          }, 300)
        }
      } catch (error) {
        console.log(error)
      }
    }

    return {
      oldPassword,
      newPassword,
      repeatPassword,
      errorMessage,
      comparePassword,
      submitModify,
      isConsistent
    }
  }
}
</script>

<style lang="less" scoped>
.edit {
  height: 100%;
  background-color: #f5f5f5;

  .edit-wrap {
    padding: 20px;
    min-height: 200px;
  }
}
.btn-wrap {
  padding: 0px 36px;
}
</style>
<style lang="less">
.van-field__label {
  width: 70px;
}
</style>
