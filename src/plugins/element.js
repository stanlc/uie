import Vue from 'vue'
import { Button } from 'element-ui'
import { Table } from 'element-ui'
import { Tabs,TabPane,Form,FormItem,Input,InputNumber,Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Button)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)


Message.install = function (Vue, options) {
    Vue.prototype.$message = Message
  }
  Vue.use(Message)