import axios from 'axios'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'

axios.defaults.baseURL =
  process.env.NODE_ENV == 'development'
    ? '//localhost:7001'
    : '//47.99.134.126:7008' // 根据环境变量切换本地和线上的请求地址
axios.defaults.withCredentials = true // 允许跨域
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localStorage.getItem('token') || '' // 本项目采用 token 的用户鉴权方式，在请求头的 headers 内添加 token，每次请求都会验证用户信息
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use((res) => {
  const router = useRouter() // vue-router 4.x 的实例
  if (typeof res.data !== 'object') {
    Toast.fail('服务端异常！')
    return Promise.reject(res)
  }
  // code 非 200 的情况下为异常情况
  if (res.data.code != 200) {
    if (res.data.msg) Toast.fail(res.data.msg)
    if (res.data.code == 401) {
      router.push({ path: '/login' })
    }
    return Promise.reject(res.data)
  }
  // 其他情况直接返回 data 数据
  return res.data
})

export default axios