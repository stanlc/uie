import Vue from 'vue'
import { Button } from 'element-ui'
import { Table } from 'element-ui'
import { Tabs,TabPane,Form,FormItem,Input,InputNumber,Message,Collapse,
    CollapseItem, Select,
    Option,Popover,Scrollbar,ColorPicker,Switch,Dialog} from 'element-ui'
Vue.use(Button)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Select)
Vue.use(Option)
Vue.use(Popover)
Vue.use(Scrollbar)
Vue.use(ColorPicker)
Vue.use(Switch)
Vue.use(Dialog)
Message.install = function (Vue, options) {
    Vue.prototype.$message = Message
  }
  Vue.use(Message)
import 'element-ui/lib/theme-chalk/index.css'
