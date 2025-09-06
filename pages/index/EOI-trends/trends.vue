<template>
  <view class="container" :class="{ entered }">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">递交趋势</text>
      <view class="header-right">
        <view class="capsule" @click="onCapsuleTap">
          <view class="capsule-item">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
          <view class="capsule-divider"></view>
          <view class="capsule-item">
            <view class="minus"></view>
          </view>
          <view class="capsule-divider"></view>
          <view class="capsule-item">
            <view class="ring">
              <view class="ring-inner"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 内容区域：取消滚动条，统一留白 -->
    <view class="content">
      <!-- 内容包装器（不额外留白） -->
      <view class="content-wrapper">
        <!-- 趋势概览 -->
        <view class="section">
          <text class="section-title">EOI递交趋势</text>
          <text class="section-content">
            了解澳洲技术移民EOI的递交趋势，帮助您把握最佳申请时机。
          </text>
        </view>

        <!-- 月度趋势 -->
        <view class="section">
          <text class="section-title">月度递交数量</text>
          <view class="trend-chart">
            <view class="chart-item" v-for="(item, index) in monthlyTrends" :key="index">
              <view class="chart-bar" :style="{ height: item.height + 'rpx' }"></view>
              <text class="chart-label">{{ item.month }}</text>
              <text class="chart-value">{{ item.value }}</text>
            </view>
          </view>
        </view>

        <!-- 热门职业 -->
        <view class="section">
          <text class="section-title">热门职业排行</text>
          <view class="job-ranking">
            <view class="ranking-item" v-for="(job, index) in topJobs" :key="index">
              <view class="ranking-number">{{ index + 1 }}</view>
              <view class="job-info">
                <text class="job-name">{{ job.name }}</text>
                <text class="job-code">{{ job.code }}</text>
              </view>
              <text class="job-count">{{ job.count }}人</text>
            </view>
          </view>
        </view>

        <!-- 地区分布 -->
        <view class="section">
          <text class="section-title">申请人地区分布</text>
          <view class="region-stats">
            <view class="region-item" v-for="(region, index) in regionData" :key="index">
              <text class="region-name">{{ region.name }}</text>
              <text class="region-percentage">{{ region.percentage }}%</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {

  
  onReady() {
    // 触发从右侧滑入的进入动画（H5/小程序通用CSS动画实现）
    this.$nextTick(() => {
      setTimeout(() => { this.entered = true }, 20)
    })
  },
  
  data() {
    return {
      entered: false,
      monthlyTrends: [
        { month: '1月', value: '2.3万', height: 120 },
        { month: '2月', value: '2.1万', height: 110 },
        { month: '3月', value: '2.8万', height: 140 },
        { month: '4月', value: '2.5万', height: 125 },
        { month: '5月', value: '3.2万', height: 160 },
        { month: '6月', value: '3.0万', height: 150 }
      ],
      topJobs: [
        { name: '软件工程师', code: '261313', count: '1.2万' },
        { name: '会计师', code: '221111', count: '8.5千' },
        { name: '注册护士', code: '254418', count: '7.8千' },
        { name: '土木工程师', code: '233211', count: '6.2千' },
        { name: '机械工程师', code: '233512', count: '5.9千' }
      ],
      regionData: [
        { name: '中国', percentage: 35 },
        { name: '印度', percentage: 28 },
        { name: '英国', percentage: 15 },
        { name: '其他', percentage: 22 }
      ],

    }
  },
  
  methods: {
    goBack() {
      uni.navigateBack();
    },
    
    onCapsuleTap() {
      uni.showActionSheet({
        itemList: ['分享', '收藏', '反馈'],
        success: (res) => {
          const index = res.tapIndex
          if (index === 0) uni.showToast({ title: '点击了分享', icon: 'none' })
          if (index === 1) uni.showToast({ title: '已收藏', icon: 'success' })
          if (index === 2) uni.showToast({ title: '感谢反馈', icon: 'none' })
        }
      })
    },
    

  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  background: #F8F8F8;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateX(100%);
  z-index: 1000;
  overflow-y: auto;
  box-shadow: -10rpx 0 30rpx rgba(0, 0, 0, 0.3);
  will-change: transform;
}

.container.entered {
  transform: translateX(0);
  transition: transform 0.35s ease-out;
}

.header {
  background: #4A90E2;
  padding: 38rpx 0 10rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-left {
  width: 65rpx;
  padding-left: 20rpx;
}

.back-icon {
  color: white;
  font-size: 48rpx;
  font-weight: bold;
}

.header-title {
  color: white;
  font-size: 30rpx;
  font-family: Arial, Helvetica, sans-serif;
}

.header-right {
  width: 120rpx;
  display: flex;
  gap: 20rpx;
  justify-content: flex-end;
}

/* 微信小程序胶囊按钮样式 */
.capsule { height: 45rpx; background: rgba(0,0,0,0.25); border-radius: 999rpx; display: flex; align-items: center; padding: 0 10rpx; backdrop-filter: blur(4px); }
.capsule-item { height: 64rpx; padding: 0 16rpx; display: flex; align-items: center; justify-content: center; }
.capsule-divider { width: 2rpx; height: 36rpx; background: rgba(255,255,255,0.2); }
.dot { width: 8rpx; height: 8rpx; background: #fff; border-radius: 50%; margin: 0 4rpx; }
.minus { width: 20rpx; height: 4rpx; background: #fff; border-radius: 4rpx; }
.ring { width: 28rpx; height: 28rpx; border-radius: 50%; border: 4rpx solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.ring-inner { width: 8rpx; height: 8rpx; background: #fff; border-radius: 50%; }

.content {
  flex: 1;
  padding: 30rpx 20rpx 30rpx 30rpx; /* 与 calculator 一致的左右留白 */
  box-sizing: border-box;
}

.content-wrapper { padding: 0; box-sizing: border-box; }

.section {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30rpx;
  display: block;
}

.trend-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200rpx;
  margin-top: 40rpx;
}

.chart-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.chart-bar {
  width: 40rpx;
  background: linear-gradient(to top, #4A90E2, #7BB3F0);
  border-radius: 20rpx 20rpx 0 0;
  margin-bottom: 20rpx;
  transition: all 0.3s ease;
}

.chart-label {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.chart-value {
  font-size: 20rpx;
  color: #999;
}

.job-ranking {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-number {
  width: 60rpx;
  height: 60rpx;
  background: #4A90E2;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: bold;
  margin-right: 30rpx;
}

.job-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.job-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.job-code {
  font-size: 24rpx;
  color: #999;
}

.job-count {
  font-size: 28rpx;
  color: #4A90E2;
  font-weight: 500;
}

.region-stats {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.region-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.region-item:last-child {
  border-bottom: none;
}

.region-name {
  font-size: 28rpx;
  color: #333;
}

.region-percentage {
  font-size: 28rpx;
  color: #4A90E2;
  font-weight: 500;
}

/* 新增动画样式 */
.slide-in {
  animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>