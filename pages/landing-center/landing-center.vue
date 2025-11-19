<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="header-title">上岸中心</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view class="main-content">
        
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
</script>

<style scoped>

.main-content {
  width: 100%;
  max-width: 700rpx;
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

</style>
