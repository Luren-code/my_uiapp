<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <text class="header-title">EOI资源</text>
    </view>

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

<script>
export default {
  methods: {
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
  }
}
</script>


<style scoped>

.main-content {
  width: 100%;
  max-width: 700rpx;
}

.grid {
  padding: 80rpx 40rpx 160rpx 40rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 44rpx 40rpx;
}

.card {
  border-radius: 24rpx;
  padding: 50rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.08);
}

.card.light {
  background: #ffffff;
}

.card.blue {
  background: #e8f2ff;
}

.icon {
  font-size: 56rpx;
  color: #4a83cc;
  margin-bottom: 16rpx;
}

.title {
  font-size: 32rpx;
  color: #2f4b73;
  font-weight: 700;
}

</style>

