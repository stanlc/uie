import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import axios from 'axios'

Vue.prototype.$http = axios.create({
  baseURL:'http://118.31.76.126:20001',//'http://192.168.30.20:20001/',
  timeout:5000,
  
})
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
