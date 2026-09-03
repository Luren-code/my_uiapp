<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="header-title">EOI职业</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view class="main-content">
        
        <!-- 主标题 -->
        <view class="main-title">
          <text class="title-text">{{ displayTitle }}</text>
          <text class="cursor" v-if="showCursor">|</text>
        </view>

        <!-- 搜索框 - 增强版 -->
        <view class="search-container" :class="{ 'slide-in': showSearchBox }">
          <SearchBoxEnhanced 
            placeholder="输入职业名称或代码搜索"
            @select="onOccupationSelect"
          />
        </view>

        <!-- 快速入口 - 添加动画类 -->
        <view class="quick-access" :class="{ 'slide-in': showQuickAccess }">
          <text class="quick-title">- 快速入口 -</text>
          <view class="quick-buttons">
            <!-- 注意：每个按钮都需要完整的标签闭合 -->
            <text class="quick-btn" @click="navigateToGuide">新手入门</text>
            <text class="divider">|</text>
            <text class="quick-btn" @click="navigateToEOICalculator">EOI分数计算</text>
            <text class="divider">|</text>
            <text class="quick-btn" @click="navigateToTrends">递交趋势</text>
          </view>
        </view>
      
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SearchBoxEnhanced from '../../components/SearchBox-Enhanced.vue'

// 响应式数据
const displayTitle = ref('')
const showCursor = ref(false)
const fullTitle = '澳洲技术移民职业查询'
let typeTimer = null
const showSearchBox = ref(false)
const showQuickAccess = ref(false)

// 生命周期
onMounted(() => {
  checkAndPlayAnimation()
})

onUnmounted(() => {
  if (typeTimer) {
    clearInterval(typeTimer)
  }
})

// 方法
const checkAndPlayAnimation = () => {
  // 每次进入都播放动画
  startTyping()
}

const startTyping = () => {
  let currentIndex = 0
  
  // 显示光标
  showCursor.value = true
  
  typeTimer = setInterval(() => {
    if (currentIndex <= fullTitle.length) {
      displayTitle.value = fullTitle.substring(0, currentIndex)
      currentIndex++
    } else {
      // 打字完成后的处理
      if (typeTimer) {
        clearInterval(typeTimer)
        typeTimer = null
      }
      
      // 延时显示搜索框
      setTimeout(() => {
        showSearchBox.value = true
      }, 300)
      
      // 延时显示快速入口
      setTimeout(() => {
        showQuickAccess.value = true
      }, 600)
      
      // 延时隐藏光标
      setTimeout(() => {
        showCursor.value = false
      }, 2000)
    }
  }, 90)
}

// 快速入口跳转
const navigateToEOICalculator = () => {
  console.log('跳转到EOI计算器')
  uni.navigateTo({
    url: '/pages/index/EOI-calculator/calculator',
    success: () => {
      console.log('跳转成功')
    },
    fail: (err) => {
      console.error('跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}

const navigateToGuide = () => {
  console.log('跳转到新手入门')
  uni.navigateTo({
    url: '/pages/index/EOI-guide/guide',
    success: () => {
      console.log('跳转成功')
    },
    fail: (err) => {
      console.error('跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}

const navigateToTrends = () => {
  console.log('跳转到递交趋势')
  uni.navigateTo({
    url: '/pages/index/EOI-trends/trends',
    success: () => {
      console.log('跳转成功')
    },
    fail: (err) => {
      console.error('跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}

// 职业选择处理
const onOccupationSelect = (occupation) => {
  console.log('选择了职业:', occupation)
  
  try {
    // 构建跳转参数
    const params = {
      code: occupation.code || occupation.anzscoCode,
      name: occupation.englishName,
      chineseName: occupation.chineseName || ''
    }
    
    console.log('准备跳转，参数:', params)
    
    // 跳转到职业详情页面
    uni.navigateTo({
      url: `/pages/occupation-detail/detail?code=${params.code}&name=${encodeURIComponent(params.name)}&chineseName=${encodeURIComponent(params.chineseName)}`,
      success: () => {
        console.log('✅ 跳转到职业详情页面成功')
      },
      fail: (err) => {
        console.error('❌ 跳转失败:', err)
        uni.showModal({
          title: '跳转失败',
          content: `错误信息: ${JSON.stringify(err)}`,
          showCancel: false
        })
      }
    })
  } catch (error) {
    console.error('❌ 跳转过程中发生错误:', error)
    uni.showToast({
      title: '跳转失败',
      icon: 'none'
    })
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: #4A90E2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0 24rpx 0;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
}

.header-title {
  font-size: 30rpx;
  font-weight: bold;
  color: white;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  padding-top: 124rpx;
  box-sizing: border-box;
}

.main-content {
  padding: 320rpx 32rpx 0rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 700rpx;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0 60rpx 0;
  flex-shrink: 0;
  width: 100%;
}

.title-text {
  font-size: 50rpx;
  font-weight: bold;
  color: #000000;
  text-align: center;
  line-height: 1.3;
}

.cursor {
  font-size: 40rpx;
  color: #333;
  animation: blink 1s infinite;
  margin-left: 4rpx;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 搜索框容器动画样式 */
.search-container {
  margin-bottom: 40rpx;
  flex-shrink: 0;
  width: 100%;
  max-width: 700rpx; /* 限制下拉同宽 */
  /* 初始状态：隐藏在上方 */
  opacity: 0;
  transform: translateY(-20rpx);
  transition: all 0.6s ease-out;
  position: relative; /* 作为下拉面板定位的参照，并建立新的层叠上下文 */
  z-index: 1002; /* 确保搜索下拉高于下方元素 */
}

.search-container.slide-in {
  /* 动画结束状态：显示 */
  opacity: 1;
  transform: translateY(0);
}

.search-box {
  background: white;
  border-radius: 50rpx;
  padding: 24rpx 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  border: 2rpx solid #4A90E2;
}

.search-icon {
  margin-right: 20rpx;
  font-size: 32rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.clear-btn {
  color: #ccc;
  font-size: 36rpx;
  margin-left: 20rpx;
  padding: 0 10rpx;
  line-height: 1;
}

/* 快速入口动画样式 */
.quick-access {
  text-align: center;
  flex-shrink: 0;
  width: 100%;
  /* 初始状态：隐藏 */
  opacity: 0;
  transform: translateY(20rpx);
  transition: all 0.6s ease-out;
  margin-top: 0;
  position: relative;
  z-index: 1; /* 低于搜索容器，避免被下拉面板遮挡关系错误 */
}

.quick-access.slide-in {
  /* 动画结束状态：显示 */
  opacity: 1;
  transform: translateY(0);
}

.quick-title {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 24rpx;
  display: block;
}

.quick-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-btn {
  color: #666;
  font-size: 26rpx;
  margin: 0 16rpx;
  /* 添加按钮悬停效果 */
  transition: color 0.3s ease;
}

.quick-btn:hover {
  color: #4A90E2;
}

.divider {
  color: #ddd;
  font-size: 26rpx;
  margin: 0 16rpx;
}

/* 底部导航优化 */
.bottom-nav { 
  display: flex; 
  background: #fff; 
  border-top: 1rpx solid #eee; 
  padding: 16rpx 0; 
  position: fixed; 
  bottom: 0; 
  left: 0; 
  right: 0; 
  z-index: 1000; 
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.08); 
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); 
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rpx 0;
  transition: all 0.3s ease;
}

.nav-icon { font-size: 36rpx; margin-bottom: 6rpx; color: #999; }

.nav-icon-custom { width: 44rpx; height: 44rpx; background: #999; color: #fff; border-radius: 6rpx; display: flex; align-items: center; justify-content: center; font-size: 18rpx; font-weight: bold; margin-bottom: 6rpx; }

.nav-icon-grid { width: 44rpx; height: 44rpx; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 3rpx; margin-bottom: 6rpx; }

.grid-item { width: 18rpx; height: 18rpx; background: #999; border-radius: 2rpx; }

.nav-icon-user {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #999;
  margin-bottom: 6rpx;
  position: relative;
}

.nav-icon-user::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 22rpx;
  height: 22rpx;
  background: white;
  border-radius: 50%;
}

.nav-text { font-size: 22rpx; color: #999; }
.nav-text.active { color: #4A90E2; }
.nav-item.active .nav-icon { color: #4A90E2; }
.nav-item.active .nav-icon-custom { background: #4A90E2; }
.nav-item.active .grid-item { background: #4A90E2; }
</style>
