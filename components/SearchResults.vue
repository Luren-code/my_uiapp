
<template>
  <view class="search-results-container" v-if="showResults">
    <!-- 搜索结果标题 -->
    <view class="results-header" v-if="searchResults.length > 0">
      <text class="results-title">搜索结果</text>
      <text class="results-count">找到 {{ searchResults.length }} 个职业</text>
    </view>
    
    <!-- 搜索结果列表 -->
    <view class="results-list" v-if="searchResults.length > 0">
      <view 
        class="result-item" 
        v-for="occupation in searchResults" 
        :key="occupation.code"
        @click="selectOccupation(occupation)"
      >
        <view class="occupation-code">{{ occupation.code }}</view>
        <view class="occupation-info">
          <text class="occupation-english">{{ occupation.englishName }}</text>
          <text class="occupation-chinese">{{ occupation.chineseName }}</text>
        </view>
      </view>
    </view>
    
    <!-- 无搜索结果 -->
    <view class="no-results" v-else-if="hasSearched">
      <text class="no-results-text">未找到匹配的职业</text>
      <text class="no-results-tip">请尝试使用职业代码或关键词搜索</text>
    </view>
    
    <!-- 搜索历史 -->
    <view class="search-history" v-if="showHistory && searchHistory.length > 0">
      <view class="history-header">
        <text class="history-title">最近搜索</text>
        <text class="clear-history" @click="clearHistory">清除</text>
      </view>
      <view class="history-list">
        <view 
          class="history-item" 
          v-for="(item, index) in searchHistory" 
          :key="index"
          @click="selectHistoryItem(item)"
        >
          <text class="history-text">{{ item }}</text>
          <text class="remove-history" @click.stop="removeHistoryItem(item)">×</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { searchOccupations } from '../data/occupations.js';
import searchHistoryUtil from '../utils/searchHistory.js';

export default {
  name: 'SearchResults',
  props: {
    searchKeyword: {
      type: String,
      default: ''
    },
    showResults: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      searchResults: [],
      searchHistory: [],
      hasSearched: false
    };
  },
  
  computed: {
    showHistory() {
      return !this.hasSearched && this.searchKeyword.trim() === '';
    }
  },
  
  watch: {
    searchKeyword: {
      handler(newKeyword) {
        this.performSearch(newKeyword);
      },
      immediate: true
    },
    
    showResults: {
      handler(show) {
        if (show) {
          this.loadSearchHistory();
        }
      },
      immediate: true
    }
  },
  
  methods: {
    performSearch(keyword) {
      if (!keyword || keyword.trim() === '') {
        this.searchResults = [];
        this.hasSearched = false;
        this.loadSearchHistory();
        return;
      }
      
      this.hasSearched = true;
      try {
        // 调用搜索函数
        this.searchResults = searchOccupations(keyword);
      } catch (error) {
        console.error('搜索失败:', error);
        this.searchResults = [];
      }
    },
    
    selectOccupation(occupation) {
      // 保存搜索历史
      searchHistoryUtil.saveSearchHistory(this.searchKeyword);
      
      // 触发选择事件
      this.$emit('select', occupation);
      
      // 显示选择提示
      uni.showToast({
        title: `已选择: ${occupation.code}`,
        icon: 'success',
        duration: 2000
      });
    },
    
    loadSearchHistory() {
      this.searchHistory = searchHistoryUtil.getSearchHistory();
    },
    
    selectHistoryItem(item) {
      this.$emit('search', item);
    },
    
    removeHistoryItem(item) {
      searchHistoryUtil.removeSearchItem(item);
      this.loadSearchHistory();
    },
    
    clearHistory() {
      uni.showModal({
        title: '清除搜索历史',
        content: '确定要清除所有搜索历史记录吗？',
        success: (res) => {
          if (res.confirm) {
            searchHistoryUtil.clearSearchHistory();
            this.loadSearchHistory();
            uni.showToast({
              title: '历史记录已清除',
              icon: 'success'
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.search-results-container {
  background: white;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  margin-top: 20rpx;
  max-height: 600rpx;
  overflow-y: auto;
}

.results-header {
  padding: 30rpx 30rpx 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.results-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.results-count {
  font-size: 24rpx;
  color: #666;
}

.results-list {
  padding: 0 30rpx;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f8f8f8;
  transition: background-color 0.2s ease;
}

.result-item:hover {
  background-color: #f8f9fa;
}

.result-item:last-child {
  border-bottom: none;
}

.occupation-code {
  background: #4A90E2;
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: bold;
  margin-right: 24rpx;
  min-width: 120rpx;
  text-align: center;
}

.occupation-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.occupation-english {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.occupation-chinese {
  font-size: 24rpx;
  color: #666;
}

.no-results {
  padding: 60rpx 30rpx;
  text-align: center;
}

.no-results-text {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 12rpx;
}

.no-results-tip {
  font-size: 24rpx;
  color: #999;
}

.search-history {
  padding: 30rpx;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.history-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.clear-history {
  font-size: 24rpx;
  color: #4A90E2;
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.history-item {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 24rpx;
  padding: 12rpx 20rpx;
  border: 1rpx solid #e9ecef;
}

.history-text {
  font-size: 26rpx;
  color: #666;
  margin-right: 12rpx;
}

.remove-history {
  font-size: 32rpx;
  color: #ccc;
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
