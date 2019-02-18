import axios from 'axios'

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
  Vue.prototype.$http = axios
}

export default HttpServer
