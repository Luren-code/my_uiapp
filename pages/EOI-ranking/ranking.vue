<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <text class="header-title">EOI排名</text>
    </view>

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

    <!-- 底部导航（第二项选中） -->
    <view class="bottom-nav">
      <view class="nav-item" @click="goIndex">
        <text class="nav-icon">🔍</text>
        <text class="nav-text">EOI职业</text>
      </view>
      <view class="nav-item active">
        <view class="nav-icon-custom">EOI</view>
        <text class="nav-text active">EOI排名</text>
      </view>
      <view class="nav-item" @click="goResources">
        <view class="nav-icon-grid">
          <view class="grid-dot"></view>
          <view class="grid-dot"></view>
          <view class="grid-dot"></view>
          <view class="grid-dot"></view>
        </view>
        <text class="nav-text">EOI资源</text>
      </view>
      <view class="nav-item" @click="goLandingCenter">
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
    goIndex() {
      uni.reLaunch({ url: '/pages/index/index' });
    },
    goTrends() {
      uni.navigateTo({ url: '/pages/index/EOI-trends/trends' });
    },
    goResources() {
      uni.reLaunch({ url: '/pages/EOI-resources/resources' });
    },
    goLandingCenter() {
      uni.reLaunch({ url: '/pages/landing-center/landing-center' });
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
.container { height: 100vh; overflow: hidden; background: #F8F8F8; }

.header { background: #4A90E2; padding: 100rpx 0 24rpx 0; position: sticky; top: 0; z-index: 1001; text-align: center; }
.header-title { color: #fff; font-size: 36rpx; font-weight: 500; }

.countdown { display: flex; flex-direction: column; align-items: center; padding: 40rpx 0 20rpx 0; }
.pill { background: #4A90E2; color: #fff; border-radius: 18rpx; padding: 12rpx 28rpx; margin-bottom: 16rpx; }
.days-text { color: #4A90E2; font-size: 36rpx; font-weight: 700; }
.days-num { font-size: 52rpx; color: orangered; margin: 0 8rpx; }

.grid { display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 28rpx; padding: 20rpx 40rpx 80rpx 40rpx; }
.grid-card { background: #fff; border-radius: 24rpx; padding: 46rpx 20rpx; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08); }
.icon { width: 88rpx; height: 88rpx; margin-bottom: 18rpx; border-radius: 18rpx; background: #e7effb; position: relative; }
.icon.aus::after { content: '🇦🇺'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 44rpx; }
.icon.states::after { content: '🗺️'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 44rpx; }
.icon.trend::after { content: '📈'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 44rpx; }
.icon.quota::after { 
  content: '🧾'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 44rpx; 
}
.card-text { font-size: 30rpx; color: #2f4b73; font-weight: 600; margin-top: 6rpx; }

.explain { width: 300rpx; max-width: calc(100% - 80rpx); margin: 10rpx auto 140rpx; background: #e3f0ff; border-radius: 24rpx; padding: 30rpx 24rpx; display: flex; align-items: center; justify-content: center; gap: 14rpx; color: #2f4b73; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08); }
.explain-icon { font-size: 40rpx; }
.explain-text { font-size: 32rpx; font-weight: 700; }

/* 底部导航与 index.vue 保持一致风格，选中第二项 */
.bottom-nav { display: flex; background: #fff; border-top: 1rpx solid #eee; padding: 20rpx 0; position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.08); padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 10rpx 0; }
.nav-icon { font-size: 40rpx; margin-bottom: 8rpx; color: #999; }
.nav-icon-custom { width: 48rpx; height: 48rpx; background: #999; color: #fff; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; font-size: 20rpx; font-weight: bold; margin-bottom: 8rpx; }
.nav-icon-grid { width: 48rpx; height: 48rpx; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 4rpx; margin-bottom: 8rpx; }
.grid-dot { width: 20rpx; height: 20rpx; background: #999; }
.nav-icon-user { width: 48rpx; height: 48rpx; border-radius: 50%; background: #999; margin-bottom: 8rpx; position: relative; }
.nav-icon-user::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24rpx; height: 24rpx; background: #fff; border-radius: 50%; }
.nav-text { font-size: 20rpx; color: #999; }
.nav-text.active { color: #4A90E2; }
.nav-item.active .nav-icon-custom { background: #4A90E2; }
</style>

