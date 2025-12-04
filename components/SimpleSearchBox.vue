<template>
  <view class="search-container">
    <!-- 搜索框 -->
    <view class="search-box">
      <view class="search-icon">
        <text>🔍</text>
      </view>
      <input 
        class="search-input"
        type="text"
        v-model="searchKeyword"
        @input="onSearchInput"
        @focus="onSearchFocus"
        @blur="onSearchBlur"
        :placeholder="placeholder"
        placeholder-class="search-placeholder"
      />
      <view class="clear-btn" v-if="searchKeyword" @click="clearSearch">
        <text>×</text>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-results" v-if="showResults">
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
          </view>
        </view>
      </view>

      <!-- 搜索结果列表 -->
      <view class="results-section" v-if="searchResults.length > 0">
        <view class="results-header">
          <text class="results-title">搜索结果</text>
          <text class="results-count">找到 {{ searchResults.length }} 个职业</text>
        </view>
        <view class="results-list">
          <view 
            class="result-item" 
            v-for="occupation in searchResults" 
            :key="occupation.code"
            @click="selectOccupation(occupation)"
          >
            <view class="occupation-code">{{ occupation.code }}</view>
            <view class="occupation-info">
              <text class="occupation-english">{{ occupation.englishName }}</text>
              <text class="occupation-chinese" v-if="occupation.chineseName">{{ occupation.chineseName }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 无搜索结果 -->
      <view class="no-results" v-else-if="hasSearched && searchKeyword">
        <text class="no-results-text">未找到匹配的职业</text>
        <text class="no-results-tip">请尝试使用职业代码或关键词搜索</text>
      </view>
    </view>
  </view>
</template>

<script>
import { searchOccupations } from '../data/occupations.js';
import searchHistoryUtil from '../utils/searchHistory.js';

export default {
  name: 'SimpleSearchBox',
  
  props: {
    placeholder: {
      type: String,
      default: '输入职业名称或代码搜索'
    }
  },
  
  data() {
    return {
      searchKeyword: '',
      searchResults: [],
      searchHistory: [],
      hasSearched: false,
      showResults: false,
      searchTimeout: null
    };
  },
  
  computed: {
    showHistory() {
      return this.showResults && (!this.searchKeyword || this.searchKeyword.trim() === '') && this.searchHistory.length > 0;
    }
  },
  
  mounted() {
    this.loadSearchHistory();
    // 如果没有搜索历史，添加一些示例数据
    if (this.searchHistory.length === 0) {
      this.addDefaultSearchHistory();
    }
  },
  
  methods: {
    onSearchInput(e) {
      this.searchKeyword = e.detail.value;
      
      // 防抖处理
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 300);
    },
    
    onSearchFocus() {
      this.showResults = true;
      if (!this.searchKeyword) {
        this.loadSearchHistory();
      }
    },
    
    onSearchBlur() {
      // 延迟处理，允许点击搜索结果
      setTimeout(() => {
        const keyword = this.searchKeyword && this.searchKeyword.trim();
        this.showResults = !!keyword;
      }, 200);
    },
    
    performSearch() {
      const keyword = this.searchKeyword.trim();
      
      if (!keyword) {
        this.searchResults = [];
        this.hasSearched = false;
        this.loadSearchHistory();
        return;
      }
      
      this.hasSearched = true;
      
      try {
        this.searchResults = searchOccupations(keyword);
        console.log(`搜索 "${keyword}" 找到 ${this.searchResults.length} 个结果`);
      } catch (error) {
        console.error('搜索失败:', error);
        this.searchResults = [];
      }
    },
    
    selectOccupation(occupation) {
      console.log('🔍 搜索框中选择职业:', occupation);
      
      // 保存搜索历史
      if (this.searchKeyword.trim()) {
        searchHistoryUtil.saveSearchHistory(this.searchKeyword.trim());
        this.loadSearchHistory();
      }
      
      // 隐藏搜索结果
      this.showResults = false;
      
      // 延迟触发选择事件，确保toast显示
      setTimeout(() => {
        console.log('🚀 触发父组件选择事件');
        this.$emit('select', occupation);
      }, 100);
    },
    
    selectHistoryItem(item) {
      this.searchKeyword = item;
      this.performSearch();
    },
    
    clearSearch() {
      this.searchKeyword = '';
      this.searchResults = [];
      this.hasSearched = false;
      this.loadSearchHistory();
      this.showResults = false;
    },
    
    loadSearchHistory() {
      this.searchHistory = searchHistoryUtil.getSearchHistory();
    },
    
    clearHistory() {
      uni.showModal({
        title: '清除搜索历史',
        content: '确定要清除所有搜索历史记录吗？',
        success: (res) => {
          if (res.confirm) {
            searchHistoryUtil.clearSearchHistory();
            this.searchHistory = [];
            uni.showToast({
              title: '历史记录已清除',
              icon: 'success',
              duration: 1500
            });
          }
        }
      });
    },
    
    addDefaultSearchHistory() {
      // 添加一些示例搜索历史
      const defaultHistory = ['261313', '261312', '261311'];
      defaultHistory.forEach(item => {
        searchHistoryUtil.saveSearchHistory(item);
      });
      this.loadSearchHistory();
    }
  }
};
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
}

/* 搜索框样式 - 优化小程序显示 */
.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2rpx solid #4A90E2;
  border-radius: 50rpx;
  padding: 20rpx 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(74, 144, 226, 0.15);
  transition: all 0.3s ease;
  margin: 0 8rpx;
}

.search-box:focus-within {
  border-color: #2c5aa0;
  box-shadow: 0 4rpx 24rpx rgba(74, 144, 226, 0.2);
}

.search-icon {
  margin-right: 16rpx;
  font-size: 28rpx;
  color: #666;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
  line-height: 1.4;
}

.search-placeholder {
  color: #999;
}

.clear-btn {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0f0f0;
  color: #666;
  font-size: 32rpx;
  margin-left: 20rpx;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #e0e0e0;
  transform: scale(1.1);
}

/* 搜索结果容器 */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  margin-top: 20rpx;
  max-height: 600rpx;
  overflow: hidden;
  z-index: 1000;
}

/* 搜索历史 */
.search-history {
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.history-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
}

.clear-history {
  font-size: 24rpx;
  color: #4A90E2;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  background: rgba(74, 144, 226, 0.1);
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 8rpx;
}

.history-item {
  padding: 8rpx 16rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  border: 1rpx solid #e0e0e0;
  transition: all 0.3s ease;
  margin: 4rpx;
}

.history-item:hover {
  background: #e9ecef;
  border-color: #4A90E2;
}

.history-text {
  font-size: 26rpx;
  color: #666;
}

/* 搜索结果 */
.results-section {
  max-height: 500rpx;
  overflow-y: auto;
}

.results-header {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background: #fafafa;
}

.results-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.results-count {
  font-size: 24rpx;
  color: #666;
}

.results-list {
  padding: 0;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f8f8f8;
  transition: background-color 0.3s ease;
}

.result-item:hover {
  background-color: #f8f9fa;
}

.result-item:last-child {
  border-bottom: none;
}

.occupation-code {
  background: #4A90E2;
  color: #fff;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 600;
  margin-right: 24rpx;
  min-width: 120rpx;
  text-align: center;
  flex-shrink: 0;
}

.occupation-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.occupation-english {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.occupation-chinese {
  font-size: 24rpx;
  color: #666;
}

/* 无结果提示 */
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

/* 响应式适配 */
@media screen and (max-width: 750rpx) {
  .search-box {
    padding: 20rpx 24rpx;
  }
  
  .search-input {
    font-size: 26rpx;
  }
  
  .occupation-code {
    font-size: 22rpx;
    padding: 6rpx 12rpx;
    min-width: 100rpx;
  }
  
  .occupation-english {
    font-size: 26rpx;
  }
  
  .occupation-chinese {
    font-size: 22rpx;
  }
}
</style>
