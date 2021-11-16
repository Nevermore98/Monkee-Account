import { createApp } from 'vue'
import { Button } from 'vant'
import 'lib-flexible/flexible'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css' // 全局引入样式
import './index.css'

const app = createApp(App)

app.use(Button)
app.use(router)

app.mount('#app')
