<template>
  <view class="api-status-container">
    <view class="status-indicator" :class="statusClass">
      <view class="status-icon">{{ statusIcon }}</view>
      <view class="status-info">
        <text class="status-text">{{ statusText }}</text>
        <text class="status-detail">{{ statusDetail }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ApiStatusIndicator',
  
  props: {
    dataSource: {
      type: String,
      default: 'Unknown'
    },
    dataCount: {
      type: Number,
      default: 0
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: String,
      default: ''
    }
  },
  
  computed: {
    statusClass() {
      if (this.isLoading) return 'status-loading';
      if (this.dataSource === 'Official API') return 'status-official';
      if (this.dataSource === 'Cache') return 'status-cache';
      return 'status-fallback';
    },
    
    statusIcon() {
      if (this.isLoading) return '⏳';
      if (this.dataSource === 'Official API') return '🌐';
      if (this.dataSource === 'Cache') return '💾';
      return '📋';
    },
    
    statusText() {
      if (this.isLoading) return '加载中...';
      if (this.dataSource === 'Official API') return '官方实时数据';
      if (this.dataSource === 'Cache') return '缓存数据';
      return '备用数据';
    },
    
    statusDetail() {
      if (this.isLoading) return '正在获取最新数据...';
      
      let detail = `${this.dataCount} 个职业`;
      
      if (this.lastUpdated) {
        const updateTime = new Date(this.lastUpdated);
        const now = new Date();
        const diffMinutes = Math.floor((now - updateTime) / (1000 * 60));
        
        if (diffMinutes < 1) {
          detail += ' • 刚刚更新';
        } else if (diffMinutes < 60) {
          detail += ` • ${diffMinutes}分钟前更新`;
        } else {
          const diffHours = Math.floor(diffMinutes / 60);
          detail += ` • ${diffHours}小时前更新`;
        }
      }
      
      return detail;
    },
    
  },
  
  methods: {}
};
</script>

<style scoped>
.api-status-container {
  margin: 20rpx 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.status-loading {
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
  color: #333;
}

.status-official {
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: #fff;
}

.status-cache {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: #fff;
}

.status-fallback {
  background: linear-gradient(135deg, #fd79a8, #e84393);
  color: #fff;
}

.status-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-text {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.status-detail {
  font-size: 24rpx;
  opacity: 0.9;
}

.refresh-btn {
  padding: 12rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  font-size: 28rpx;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}
</style>

