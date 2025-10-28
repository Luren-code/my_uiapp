<script setup>
import { ref } from 'vue'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

// 全局状态
const userInfo = ref(null)
const isLogin = ref(false)
const systemInfo = ref(null)

// 应用初始化
const initApp = () => {
  // 获取系统信息
  getSystemInfo()
  
  // 检查登录状态
  checkLoginStatus()
  
  // 初始化全局配置
  initGlobalConfig()
}

// 获取系统信息
const getSystemInfo = () => {
  uni.getSystemInfo({
    success: (res) => {
      systemInfo.value = res
      console.log('系统信息:', res)
    },
    fail: (err) => {
      console.error('获取系统信息失败:', err)
    }
  })
}

// 检查登录状态
const checkLoginStatus = () => {
  const token = uni.getStorageSync('token')
  isLogin.value = !!token
  console.log('登录状态:', isLogin.value)
}

// 初始化全局配置
const initGlobalConfig = () => {
  // 可以在这里设置全局配置
  console.log('初始化全局配置')
}

// 处理应用显示
const handleAppShow = () => {
  // 应用从后台切换到前台时的处理
  console.log('应用显示处理')
}

// 处理应用隐藏
const handleAppHide = () => {
  // 应用切换到后台时的处理
  console.log('应用隐藏处理')
}

onLaunch(() => {
  console.log('App Launch')
  // 应用启动时的初始化
  initApp()
})

onShow(() => {
  console.log('App Show')
  // 应用显示时的处理
  handleAppShow()
})

onHide(() => {
  console.log('App Hide')
  // 应用隐藏时的处理
  handleAppHide()
})
</script>

<style>
/*每个页面公共css */
page {
  background-color: #F8F8F8;
}
</style>
