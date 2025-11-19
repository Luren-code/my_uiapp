<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="header-title">EOI排名</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view class="main-content">
        
        <!-- 倒计时提示 -->
        <view class="countdown">
          <view class="pill">
            <text>距离{{ fiscalYear }}财年结束</text>
          </view>
          <text class="days-text">还有 <text class="days-num">{{ daysLeft }}</text> 天</text>
        </view>

        <!-- 功能网格 -->
        <view class="grid">
          <view class="grid-card" @click="comingSoon('全澳EOI排名')">
            <view class="icon aus"></view>
            <text class="card-text">全澳EOI排名</text>
          </view>
          <view class="grid-card" @click="comingSoon('各州EOI排名')">
            <view class="icon states"></view>
            <text class="card-text">各州EOI排名</text>
          </view>
          <view class="grid-card" @click="goTrends">
            <view class="icon trend"></view>
            <text class="card-text">EOI递交趋势</text>
          </view>
          <view class="grid-card" @click="comingSoon('州担保配额')">
            <view class="icon quota"></view>
            <text class="card-text">州担保配额</text>
          </view>
        </view>

        <!-- 数据说明按钮 -->
        <view class="explain" @click="showExplain">
          <view class="explain-icon">📘</view>
          <text class="explain-text">数据说明</text>
        </view>
      
      </view>
    </view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      fiscalYear: '',
      daysLeft: 0
    }
  },
  onLoad() {
    this.updateCountdown();
  },
  methods: {
    updateCountdown() {
      const now = new Date();
      // 计算当前财政年度（7月1日开始，次年6月30日结束）
      const year = now.getMonth() + 1 >= 7 ? now.getFullYear() : now.getFullYear() - 1;
      const endDate = new Date(year + 1, 5, 30, 23, 59, 59); // 次年6月30日
      const startTwoDigits = String(year).slice(2);
      const endTwoDigits = String(year + 1).slice(2);
      this.fiscalYear = `${startTwoDigits}-${endTwoDigits}`;
      const diff = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      this.daysLeft = diff;
    },
    goTrends() {
      uni.navigateTo({ url: '/pages/index/EOI-trends/trends' });
    },
    comingSoon(name) {
      uni.showToast({ title: `${name} 敬请期待`, icon: 'none' });
    },
    showExplain() {
      uni.showModal({
        title: '数据说明',
        content: '页面展示的均为演示数据，用于说明交互与布局。',
        showCancel: false
      })
    }
  }
}
</script>

<style scoped>

.main-content {
  width: 100%;
  max-width: 700rpx;
}

.countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0 20rpx 0;
}

.pill {
  background: #4A90E2;
  color: #fff;
  border-radius: 18rpx;
  padding: 12rpx 28rpx;
  margin-bottom: 16rpx;
}

.days-text {
  color: #4A90E2;
  font-size: 36rpx;
  font-weight: 700;
}

.days-num {
  font-size: 52rpx;
  color: orangered;
  margin: 0 8rpx;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 28rpx;
  padding: 20rpx 40rpx 80rpx 40rpx;
}

.grid-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 46rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
}

.icon {
  width: 88rpx;
  height: 88rpx;
  margin-bottom: 18rpx;
  border-radius: 18rpx;
  background: #e7effb;
  position: relative;
}

.icon.aus::after {
  content: '🇦🇺';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}

.icon.states::after {
  content: '🗺️';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}

.icon.trend::after {
  content: '📈';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}

.icon.quota::after {
  content: '🧾';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
}

.card-text {
  font-size: 30rpx;
  color: #2f4b73;
  font-weight: 600;
  margin-top: 6rpx;
}

.explain {
  width: 300rpx;
  max-width: calc(100% - 80rpx);
  margin: 10rpx auto 140rpx;
  background: #e3f0ff;
  border-radius: 24rpx;
  padding: 30rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  color: #2f4b73;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
}

.explain-icon {
  font-size: 40rpx;
}

.explain-text {
  font-size: 32rpx;
  font-weight: 700;
}

</style>

