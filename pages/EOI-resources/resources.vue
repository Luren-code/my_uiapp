<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <text class="header-title">EOI资源</text>
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
            <view class="ring"><view class="ring-inner"></view></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 内容 -->
    <view class="grid">
      <view class="card light" @click="goCalculator">
        <view class="icon">🧮</view>
        <text class="title">EOI打分表</text>
      </view>
      <view class="card light" @click="goAge">
        <view class="icon">📅</view>
        <text class="title">年龄计算器</text>
      </view>
      <view class="card blue" @click="goGuideQA">
        <view class="icon">❓</view>
        <text class="title">EOI申请Q&A</text>
      </view>
      <view class="card blue" @click="comingSoon('DIY获邀分享')">
        <view class="icon">↗️</view>
        <text class="title">DIY获邀分享</text>
      </view>
      <view class="card blue" @click="comingSoon('PTE报名优惠码')">
        <view class="icon">📚</view>
        <text class="title">PTE报名优惠码</text>
      </view>
      <view class="card blue" @click="comingSoon('DIY资料大全')">
        <view class="icon">📘</view>
        <text class="title">DIY资料大全</text>
      </view>
    </view>

    <!-- 底部导航，第三项高亮 -->
    <view class="bottom-nav">
      <view class="nav-item" @click="goIndex">
        <text class="nav-icon">🔍</text>
        <text class="nav-text">EOI职业</text>
      </view>
      <view class="nav-item" @click="goRanking">
        <view class="nav-icon-custom">EOI</view>
        <text class="nav-text">EOI排名</text>
      </view>
      <view class="nav-item active">
        <view class="nav-icon-grid">
          <view class="grid-dot"></view>
          <view class="grid-dot"></view>
          <view class="grid-dot"></view>
          <view class="grid-dot"></view>
        </view>
        <text class="nav-text active">EOI资源</text>
      </view>
      <view class="nav-item" @click="comingSoon('上岸中心')">
        <view class="nav-icon-user"></view>
        <text class="nav-text">上岸中心</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    onCapsuleTap() {
      uni.showActionSheet({
        itemList: ['反馈', '分享'],
        success: (res) => {
          if (res.tapIndex === 0) uni.showToast({ title: '感谢反馈', icon: 'none' })
          if (res.tapIndex === 1) uni.showToast({ title: '已分享', icon: 'success' })
        }
      })
    },
    goCalculator() {
      uni.navigateTo({ url: '/pages/index/EOI-calculator/calculator' })
    },
    goAge() {
      uni.showToast({ title: '年龄计算器 敬请期待', icon: 'none' })
    },
    goGuideQA() {
      uni.navigateTo({ url: '/pages/index/EOI-guide/guide' })
    },
    comingSoon(name) {
      uni.showToast({ title: `${name} 敬请期待`, icon: 'none' })
    },
    goIndex() {
      uni.reLaunch({ url: '/pages/index/index' })
    },
    goRanking() {
      uni.reLaunch({ url: '/pages/EOI-ranking/ranking' })
    }
  }
}
</script>

<style scoped>
.container { height: 100vh; overflow: hidden; background: #F8F8F8; }

.header { background: #4A90E2; padding: 38rpx 20rpx 10rpx 20rpx; position: relative; text-align: center; }
.header-title { color: #fff; font-size: 36rpx; font-weight: 600; }
.header-right { position: absolute; right: 20rpx; top: 32rpx; }
.capsule { height: 45rpx; background: rgba(255,255,255,0.25); border-radius: 999rpx; display: flex; align-items: center; padding: 0 10rpx; backdrop-filter: blur(4px); }
.capsule-item { height: 64rpx; padding: 0 16rpx; display: flex; align-items: center; justify-content: center; }
.capsule-divider { width: 2rpx; height: 36rpx; background: rgba(255,255,255,0.35); }
.dot { width: 8rpx; height: 8rpx; background: #fff; border-radius: 50%; margin: 0 4rpx; }
.minus { width: 20rpx; height: 4rpx; background: #fff; border-radius: 4rpx; }
.ring { width: 28rpx; height: 28rpx; border: 4rpx solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.ring-inner { width: 8rpx; height: 8rpx; background: #fff; border-radius: 50%; }

.grid { padding: 80rpx 40rpx 160rpx 40rpx; display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 44rpx 40rpx; }
.card { border-radius: 24rpx; padding: 50rpx 20rpx; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08); }
.card.light { background: #ffffff; }
.card.blue { background: #e8f2ff; }
.icon { font-size: 56rpx; color: #4a83cc; margin-bottom: 16rpx; }
.title { font-size: 32rpx; color: #2f4b73; font-weight: 700; }

.bottom-nav { display: flex; background: #fff; border-top: 1rpx solid #eee; padding: 20rpx 0; position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.08); padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); }
.nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 10rpx 0; }
.nav-icon { font-size: 40rpx; margin-bottom: 8rpx; color: #007AFF; }
.nav-icon-custom { width: 48rpx; height: 48rpx; background: #2f5c8d; color: #fff; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; font-size: 20rpx; font-weight: bold; margin-bottom: 8rpx; }
.nav-icon-grid { width: 48rpx; height: 48rpx; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 4rpx; margin-bottom: 8rpx; }
.grid-dot { width: 20rpx; height: 20rpx; background: #2f5c8d; }
.nav-icon-user { width: 48rpx; height: 48rpx; border-radius: 50%; background: #999; margin-bottom: 8rpx; position: relative; }
.nav-icon-user::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24rpx; height: 24rpx; background: #fff; border-radius: 50%; }
.nav-text { font-size: 20rpx; color: #999; }
.nav-text.active { color: #35b34a; }
.nav-item.active .grid-dot { background: #35b34a; }
</style>

