import { createApp } from 'vue'
import App from '@/App.vue'
import dayjs from 'dayjs'
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
  Empty,
  Progress
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
app.use(Empty)
app.use(Progress)

app.mount('#app')
