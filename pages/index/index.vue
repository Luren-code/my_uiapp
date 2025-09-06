<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="header-title">EOI职业</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 主标题 -->
      <view class="main-title">
        <text class="title-text">{{ displayTitle }}</text>
        <text class="cursor" v-if="showCursor">|</text>
      </view>

      <!-- 搜索框 - 添加动画类 -->
      <view class="search-container" :class="{ 'slide-in': showSearchBox }">
        <view class="search-box">
          <text class="search-icon">🔍</text>
          <input 
            class="search-input" 
            placeholder="输入职业名称或代码搜索" 
          />
        </view>
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

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item active">
        <text class="nav-icon">🔍</text>
        <text class="nav-text active">EOI职业</text>
      </view>
      <view class="nav-item" @click="goRanking">
        <view class="nav-icon-custom">EOI</view>
        <text class="nav-text">EOI排名</text>
      </view>
      <view class="nav-item" @click="goResources">
        <view class="nav-icon-grid">
          <view class="grid-item"> </view>
          <view class="grid-item"></view>
          <view class="grid-item"></view>
          <view class="grid-item"></view>
        </view>
        <text class="nav-text">EOI资源</text>
      </view>
      <view class="nav-item">
        <view class="nav-icon-user"></view>
        <text class="nav-text">上岸中心</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      displayTitle: '',
      showCursor: false,
      fullTitle: '澳洲技术移民职业查询',
      typeTimer: null,
      showSearchBox: false,    // 控制搜索框显示
      showQuickAccess: false   // 控制快速入口显示
    }
  },
  
  onLoad() {
    this.startTyping();
  },
  
  onUnload() {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
    }
  },
  
  methods: {
    startTyping() {
      const fullTitle = this.fullTitle;
      let currentIndex = 0;
      
      this.typeTimer = setInterval(() => {
        if (currentIndex <= fullTitle.length) {
          this.displayTitle = fullTitle.substring(0, currentIndex);
          currentIndex++;
        } else {
          // 打字完成后的处理
          clearInterval(this.typeTimer);
          
          // 延时显示搜索框
          setTimeout(() => {
            this.showSearchBox = true;
          }, 300);
          
          // 延时显示快速入口
          setTimeout(() => {
            this.showQuickAccess = true;
          }, 600);
          
          // 延时隐藏光标
          setTimeout(() => {
            this.showCursor = false;
          }, 2000);
        }
      }, 80);
    },
    
    // 快速入口跳转
    navigateToEOICalculator() {
      console.log('跳转到EOI计算器');
      uni.navigateTo({
        url: '/pages/index/EOI-calculator/calculator',
        success: () => {
          console.log('跳转成功');
        },
        fail: (err) => {
          console.error('跳转失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },
    
    navigateToGuide() {
      console.log('跳转到新手入门');
      uni.navigateTo({
        url: '/pages/index/EOI-guide/guide',
        success: () => {
          console.log('跳转成功');
        },
        fail: (err) => {
          console.error('跳转失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },
    
    navigateToTrends() {
      console.log('跳转到递交趋势');
      uni.navigateTo({
        url: '/pages/index/EOI-trends/trends',
        success: () => {
          console.log('跳转成功');
        },
        fail: (err) => {
          console.error('跳转失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },
    goRanking() {
      uni.navigateTo({ url: '/pages/EOI-ranking/ranking' });
    },
    goResources() {
      uni.navigateTo({ url: '/pages/EOI-resources/resources' });
    }
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  background: linear-gradient(to bottom, #4A90E2, #F8F8F8);
  display: flex;
  flex-direction: column;
}

.header {
  background: #4A90E2;
  padding: 38rpx 0 10rpx 0;
  text-align: center;
  flex-shrink: 0;
}

.header-title {
  color: white;
  font-size: 36rpx;
  font-weight: 500;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 40rpx;
  padding-bottom: 200rpx;
  overflow-y: auto;
  background-color: #F8F8F8;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0 60rpx 0;
  flex-shrink: 0;
}

.title-text {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  line-height: 1.2;
}

.cursor {
  font-size: 44rpx;
  color: #333;
  animation: blink 1s infinite;
  margin-left: 4rpx;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 搜索框动画样式 */
.search-container {
  margin-bottom: 60rpx;
  flex-shrink: 0;
  /* 初始状态：隐藏在上方 */
  opacity: 0;
  transform: translateY(-50rpx);
  transition: all 0.6s ease-out;
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

/* 快速入口动画样式 */
.quick-access {
  text-align: center;
  flex-shrink: 0;
  /* 初始状态：隐藏在上方 */
  opacity: 0;
  transform: translateY(-30rpx);
  transition: all 0.6s ease-out;
}

.quick-access.slide-in {
  /* 动画结束状态：显示 */
  opacity: 1;
  transform: translateY(0);
}

.quick-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
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
  font-size: 28rpx;
  margin: 0 20rpx;
  /* 添加按钮悬停效果 */
  transition: color 0.3s ease;
}

.quick-btn:hover {
  color: #4A90E2;
}

.divider {
  color: #ddd;
  font-size: 28rpx;
  margin: 0 20rpx;
}

/* 底部导航保持原样 */
.bottom-nav { display: flex; background: #fff; border-top: 1rpx solid #eee; padding: 20rpx 0; position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.08); padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); }

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 0;
}

.nav-icon { font-size: 40rpx; margin-bottom: 8rpx; color: #007AFF; }

.nav-icon-custom { width: 48rpx; height: 48rpx; background: #2f5c8d; color: #fff; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; font-size: 20rpx; font-weight: bold; margin-bottom: 8rpx; }

.nav-icon-grid { width: 48rpx; height: 48rpx; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 4rpx; margin-bottom: 8rpx; }

.grid-item { width: 20rpx; height: 20rpx; background: #2f5c8d; }

.nav-icon-user {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #999;
  margin-bottom: 8rpx;
  position: relative;
}

.nav-icon-user::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24rpx;
  height: 24rpx;
  background: white;
  border-radius: 50%;
}

.nav-text { font-size: 20rpx; color: #999; }
.nav-text.active { color: #35b34a; }
.nav-item.active .nav-icon-custom { background: #35b34a; }
.nav-item.active .grid-item { background: #35b34a; }
</style>