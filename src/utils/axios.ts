import axios from 'axios'
import { Toast } from 'vant'
import router from '@/router'

axios.defaults.baseURL =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : 'https://monkee.online/account-vue-middle/api'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${
  localStorage.getItem('account_vue_token') || null
}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use((res) => {
  if (typeof res.data !== 'object') {
    Toast.fail('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data?.code != 200) {
    if (res.data.msg) Toast.fail(res.data.msg)
    if (res.data.code == 401) {
      // 401，token 过期
      router.push({ path: '/login' })
      // window.location.href = './#/login'
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios
