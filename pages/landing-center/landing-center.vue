<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="header-title">上岸中心</text>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 用户信息卡片 -->
      <view class="info-card">
        <view class="info-row">
          <text class="info-label">我的船票：</text>
          <text class="info-value">1025573522</text>
        </view>
        <view class="info-row">
          <text class="info-label">登船日期：</text>
          <text class="info-value">2025年8月15日</text>
        </view>
        <view class="info-row">
          <text class="info-label">加速截止：</text>
          <text class="info-value">2025年8月15日</text>
        </view>
      </view>

      <!-- 订阅方式1 -->
      <view class="subscription-section">
        <text class="subscription-title">订阅方式1：【微信支付】</text>
        <text class="subscription-note">*如需订单问题请加微信号：xilifaa*</text>
        
        <view class="subscription-options">
          <view class="option-card">
            <text class="option-duration">3天试用</text>
            <text class="option-price">15元</text>
          </view>
          <view class="option-card">
            <text class="option-duration">30天订阅</text>
            <text class="option-price">20元</text>
          </view>
          <view class="option-card">
            <text class="option-duration">90天订阅</text>
            <text class="option-price">50元</text>
          </view>
        </view>
      </view>

      <!-- 订阅方式2 -->
      <view class="subscription-section">
        <text class="subscription-title">订阅方式2：【加速码】</text>
        <text class="subscription-note">*小红书搜索baaadmonkey，在店铺内可购买*</text>
        
        <view class="code-section">
          <input 
            class="code-input" 
            placeholder="请输入加速码"
            v-model="accelerationCode"
          />
          <button class="verify-btn" @click="verifyCode">验证</button>
        </view>
      </view>

      <!-- 祝福语 -->
      <view class="blessing-section">
        <text class="blessing-text">--一道阻且长,行则将至,祝你我早日上岸--</text>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item" @click="goToIndex">
        <text class="nav-icon">🔍</text>
        <text class="nav-text">EOI职业</text>
      </view>
      <view class="nav-item" @click="goRanking">
        <view class="nav-icon-custom">EOI</view>
        <text class="nav-text">EOI排名</text>
      </view>
      <view class="nav-item" @click="goResources">
        <view class="nav-icon-grid">
          <view class="grid-item"></view>
          <view class="grid-item"></view>
          <view class="grid-item"></view>
          <view class="grid-item"></view>
        </view>
        <text class="nav-text">EOI资源</text>
      </view>
      <view class="nav-item active">
        <view class="nav-icon-user active"></view>
        <text class="nav-text active">上岸中心</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const accelerationCode = ref('')

// 方法
const verifyCode = () => {
  if (!accelerationCode.value.trim()) {
    uni.showToast({
      title: '请输入加速码',
      icon: 'none'
    })
    return
  }
  
  // 这里可以添加验证逻辑
  uni.showToast({
    title: '验证成功',
    icon: 'success'
  })
}

const goToIndex = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}

const goRanking = () => {
  uni.reLaunch({ url: '/pages/EOI-ranking/ranking' })
}

const goResources = () => {
  uni.reLaunch({ url: '/pages/EOI-resources/resources' })
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
  padding: 100rpx 0 24rpx 0;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1001;
}

.header-title {
  color: white;
  font-size: 36rpx;
  font-weight: 500;
}

.content {
  flex: 1;
  padding: 40rpx;
  padding-bottom: 200rpx;
  overflow-y: auto;
  background-color: #F8F8F8;
}

.info-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.subscription-section {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.subscription-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 15rpx;
  text-align: center;
}

.subscription-note {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 30rpx;
  text-align: center;
}

.subscription-options {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}

.option-card {
  flex: 1;
  background: #f8f9fa;
  border: 2rpx solid #4A90E2;
  border-radius: 15rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.option-duration {
  font-size: 26rpx;
  color: #4A90E2;
  font-weight: bold;
  margin-bottom: 15rpx;
  display: block;
}

.option-price {
  font-size: 32rpx;
  color: #4A90E2;
  font-weight: bold;
}

.code-section {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.code-input {
  flex: 1;
  background: #f8f9fa;
  border: 1rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 25rpx 20rpx;
  font-size: 28rpx;
  color: #333;
}

.verify-btn {
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 12rpx;
  padding: 25rpx 40rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.blessing-section {
  text-align: center;
  margin-top: 60rpx;
}

.blessing-text {
  font-size: 26rpx;
  color: #666;
  font-style: italic;
  line-height: 1.5;
}

/* 底部导航样式 */
.bottom-nav {
  display: flex;
  background: #fff;
  border-top: 1rpx solid #eee;
  padding: 20rpx 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.08);
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 0;
}

.nav-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
  color: #999;
}

.nav-icon-custom {
  width: 48rpx;
  height: 48rpx;
  background: #999;
  color: #fff;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.nav-icon-grid {
  width: 48rpx;
  height: 48rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 4rpx;
  margin-bottom: 8rpx;
}

.grid-item {
  width: 20rpx;
  height: 20rpx;
  background: #999;
}

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

.nav-text {
  font-size: 20rpx;
  color: #999;
}

.nav-text.active {
  color: #4A90E2;
}

.nav-item.active .nav-icon-custom {
  background: #4A90E2;
}

.nav-item.active .grid-item {
  background: #4A90E2;
}

.nav-item.active .nav-icon-user {
  background: #4A90E2;
}
</style>
