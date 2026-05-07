// 项目入口文件
import App from './App'

// Vue3 配置
import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
