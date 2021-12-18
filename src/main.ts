import { createApp } from 'vue'
import App from '@/App.vue'
import 'lib-flexible/flexible'
import router from '@/router'
import {
  Button,
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Icon,
  NavBar,
  CellGroup,
  Cell,
  Toast,
  Popup,
  DatetimePicker,
  PullRefresh,
  List,
  Calendar,
  ConfigProvider,
  NumberKeyboard,
  Progress,
  Dialog,
  Divider,
  Skeleton
} from 'vant'
import 'vant/lib/index.css' // 全局引入样式
import '@/index.less'

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
app.use(Cell)
app.use(Toast)
app.use(Popup)
app.use(DatetimePicker)
app.use(PullRefresh)
app.use(List)
app.use(Calendar)
app.use(ConfigProvider)
app.use(NumberKeyboard)
app.use(Progress)
app.use(Dialog)
app.use(Divider)
app.use(Skeleton)

app.mount('#app')

// 非移动端打开页面弹出二维码
if (document.documentElement.clientWidth > 500) {
  const QRCode = document.createElement('img')
  QRCode.src = 'src/assets/QR_code.png'
  QRCode.style.position = 'fixed'
  QRCode.style.left = '50%'
  QRCode.style.top = '50%'
  QRCode.style.transform = 'translate(-50%,-50%)'
  QRCode.style.borderRadius = '20px'
  QRCode.style.boxShadow = '0 0 10px rgba(0,0,0,0.25)'
  document.body.appendChild(QRCode)

  // 点击空白处隐藏二维码
  const app = document.getElementById('app')
  app.addEventListener('click', () => {
    QRCode.style.display = 'none'
  })
}
