<template>
  <view class="data-status-container">
    <!-- 静态数据状态显示 -->
    <view class="status-card success">
      <view class="status-icon">✅</view>
      <text class="status-title">本地数据已加载</text>
      <text class="status-message">
        来源: 静态数据 | 
        数据量: {{ dataCount }} 个职业 | 
        状态: 可用
      </text>
      <view class="action-buttons">
        <text class="info-btn" @click="showDataInfo">📊 数据信息</text>
      </view>
    </view>

    <!-- 数据信息展示 -->
    <view class="validation-result" v-if="showValidation">
      <view class="validation-header">
        <text class="validation-title">数据信息</text>
        <text class="close-btn" @click="showValidation = false">×</text>
      </view>
      
      <view class="validation-content">
        <view class="validation-item">
          <text class="validation-label">数据状态:</text>
          <text class="validation-value success">✅ 可用</text>
        </view>
        
        <view class="validation-item">
          <text class="validation-label">数据量:</text>
          <text class="validation-value">{{ dataCount }} 个职业</text>
        </view>
        
        <view class="validation-item">
          <text class="validation-label">数据类型:</text>
          <text class="validation-value">本地静态数据</text>
        </view>

        <view class="validation-item">
          <text class="validation-label">响应速度:</text>
          <text class="validation-value">即时响应</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { occupationsData } from '../data/occupations.js';

export default {
  name: 'OfficialDataStatus',
  
  data() {
    return {
      dataStatus: 'success',
      dataSource: 'Static Data',
      dataCount: 0,
      showValidation: false
    };
  },

  mounted() {
    this.initializeData();
  },

  methods: {
    /**
     * 初始化数据状态
     */
    initializeData() {
      if (occupationsData && occupationsData.length > 0) {
        this.dataCount = occupationsData.length;
        
        // 触发数据加载完成事件
        this.$emit('dataLoaded', {
          data: occupationsData,
          source: 'Static Data',
          quality: 'Good'
        });
      }
    },

    /**
     * 显示数据信息
     */
    showDataInfo() {
      this.showValidation = true;
    }
  }
};
</script>

<style scoped>
.data-status-container {
  margin: 20rpx 0;
}

/* 状态卡片样式 */
.status-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  border-left: 6rpx solid #00b894;
}

.status-card.success {
  border-left-color: #00b894;
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: #fff;
}

.status-icon {
  font-size: 48rpx;
  text-align: center;
  margin-bottom: 20rpx;
}

.status-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
  text-align: center;
}

.status-message {
  display: block;
  font-size: 26rpx;
  opacity: 0.9;
  text-align: center;
  margin-bottom: 20rpx;
  line-height: 1.4;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-top: 20rpx;
}

.info-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 16rpx 32rpx;
  border-radius: 24rpx;
  font-size: 26rpx;
  text-align: center;
  transition: all 0.3s ease;
}

.info-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* 验证结果样式 */
.validation-result {
  background: #fff;
  border-radius: 16rpx;
  margin-top: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.validation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  background: #f8f9fa;
  border-bottom: 1rpx solid #e9ecef;
}

.validation-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e9ecef;
  color: #666;
  font-size: 32rpx;
  font-weight: bold;
}

.validation-content {
  padding: 30rpx;
}

.validation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.validation-item:last-child {
  border-bottom: none;
}

.validation-label {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}

.validation-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 600;
}

.validation-value.success {
  color: #00b894;
}

.validation-value.error {
  color: #e17055;
}

/* 响应式适配 */
@media screen and (max-width: 750rpx) {
  .status-card {
    padding: 24rpx;
    margin: 16rpx 0;
  }
  
  .status-icon {
    font-size: 40rpx;
  }
  
  .status-title {
    font-size: 28rpx;
  }
  
  .status-message {
    font-size: 24rpx;
  }
  
  .info-btn {
    padding: 12rpx 24rpx;
    font-size: 24rpx;
  }
}
</style>