// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import CusBread from '@/components/cus-Bread'

import '@/assets/css/base.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'

import router from './router'
import HttpServer from '@/plugins/http'

Vue.use(ElementUI)
Vue.use(HttpServer)

// 全局时间格式化过滤器
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

// 全局组件
Vue.component(CusBread.name, CusBread)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
