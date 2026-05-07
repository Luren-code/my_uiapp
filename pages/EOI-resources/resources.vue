<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="header-title">EOI资源</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view class="main-content">
        
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
      
      </view>
    </view>

  </view>
</template>

<script setup>
// 方法
const goCalculator = () => {
  uni.navigateTo({ url: '/pages/index/EOI-calculator/calculator' })
}

const goAge = () => {
  uni.showToast({ title: '年龄计算器 敬请期待', icon: 'none' })
}

const goGuideQA = () => {
  uni.navigateTo({ url: '/pages/index/EOI-guide/guide' })
}

const comingSoon = (name) => {
  uni.showToast({ title: `${name} 敬请期待`, icon: 'none' })
}

const goIndex = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}

const goRanking = () => {
  uni.reLaunch({ url: '/pages/EOI-ranking/ranking' })
}

const goLandingCenter = () => {
  uni.reLaunch({ url: '/pages/landing-center/landing-center' })
}
</script>

<style scoped>
.container { height: 100vh; overflow: hidden; background: #F8F8F8; }

.header { background: #4A90E2; padding: 100rpx 0 24rpx 0; position: sticky; top: 0; z-index: 1001; text-align: center; }
.header-title { color: #fff; font-size: 36rpx; font-weight: 600; }

.grid { padding: 80rpx 40rpx 160rpx 40rpx; display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 44rpx 40rpx; }
.card { border-radius: 24rpx; padding: 50rpx 20rpx; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08); }
.card.light { background: #ffffff; }
.card.blue { background: #e8f2ff; }
.icon { font-size: 56rpx; color: #4a83cc; margin-bottom: 16rpx; }
.title { font-size: 32rpx; color: #2f4b73; font-weight: 700; }

</style>
