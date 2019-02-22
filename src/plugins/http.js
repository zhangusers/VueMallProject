import axios from 'axios'

import { Message } from 'element-ui'

const HttpServer = {}

HttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
  axios.interceptors.request.use(function (config) {
    // console.log(config)
    if (config.url !== 'login') {
      // 授权
      const AUTH_TOKEN = localStorage.getItem('token')
      // console.log(AUTH_TOKEN)
      config.headers['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log('res拦截器被触发----')
    // console.log(response)
    const {
      meta: {
        status,
        msg
      }
    } = response.data
    if (status !== 200 && status !== 201) {
      Message.warning(msg)
    }
    return response
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  })
  Vue.prototype.$http = axios
}

export default HttpServer
