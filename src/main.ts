import { createApp } from 'vue'
import App from './App.vue'
import 'lib-flexible/flexible'
import router from './router'
import {
  Button,
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Icon,
  NavBar,
  CellGroup,
  Toast
} from 'vant'
import 'vant/lib/index.css' // 全局引入样式
import './index.less'

const app = createApp(App)

app.use(router)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Form)
app.use(Field)
app.use(Button)
app.use(Icon)
app.use(NavBar)
app.use(CellGroup)
app.use(Toast)

app.mount('#app')
