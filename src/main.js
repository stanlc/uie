import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import axios from 'axios'

Vue.prototype.$http = axios.create({
  // baseURL:'http://118.31.76.126:20001',
  baseURL:'http://'+window.location.hostname+':20001',
  
  
})
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
