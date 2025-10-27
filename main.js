// 项目入口文件
import App from './App'
import Vue from 'vue'
import './uni.promisify.adaptor' // Promise 适配器

// 关闭生产提示
Vue.config.productionTip = false

// 设置根组件类型
App.mpType = 'app'

// 创建并挂载应用
const app = new Vue({
  ...App
})
app.$mount()