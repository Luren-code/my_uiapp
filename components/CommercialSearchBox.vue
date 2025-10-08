<template>
  <view class="commercial-search-container">
    <!-- 数据状态指示器 -->
    <view class="data-status-bar" :class="dataStatusClass">
      <view class="status-icon">
        <text class="status-emoji">{{ dataStatusIcon }}</text>
      </view>
      <view class="status-info">
        <text class="status-text">{{ dataStatusText }}</text>
        <text class="status-detail">{{ dataStatusDetail }}</text>
      </view>
      <view class="refresh-btn" @click="refreshData" :class="{ 'refreshing': isRefreshing }">
        <text class="refresh-icon">🔄</text>
      </view>
    </view>

    <!-- 搜索框主体 -->
    <view class="search-box-wrapper">
      <view class="search-input-container">
        <view class="search-icon">
          <text>🔍</text>
        </view>
        
        <input 
          class="search-input"
          type="text"
          :value="searchKeyword"
          @input="onSearchInput"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
          :placeholder="searchPlaceholder"
          placeholder-class="search-placeholder"
        />
        
        <view class="search-actions">
          <!-- 清除按钮 -->
          <view 
            v-if="searchKeyword" 
            class="clear-btn" 
            @click="clearSearch"
          >
            <text>✕</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-results-container" v-if="showResults">
      <!-- 搜索历史 -->
      <view class="search-history" v-if="showHistory && searchHistory.length > 0">
        <view class="history-header">
          <text class="history-title">Recent Searches</text>
          <text class="clear-history" @click="clearHistory">Clear</text>
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
          <text class="results-title">Search Results</text>
          <text class="results-count">{{ searchResults.length }} occupations found</text>
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
        <text class="no-results-text">No matching occupations found</text>
        <text class="no-results-tip">Try using occupation code or keywords</text>
      </view>
    </view>
  </view>
</template>

<script>
import { searchOccupations, occupationsData } from '../data/occupations.js';
import searchHistoryManager from '../utils/searchHistory.js';
import searchResultProcessor from '../utils/searchResultProcessor.js';

export default {
  name: 'CommercialSearchBox',
  
  props: {
    placeholder: {
      type: String,
      default: 'Search occupations...'
    }
  },
  
  data() {
    return {
      // 搜索相关
      searchKeyword: '',
      searchResults: [],
      searchHistory: [],
      hasSearched: false,
      showResults: false,
      isSearching: false,
      
      // 数据状态
      dataStatus: 'healthy',
      dataSource: 'Static Data',
      lastUpdated: new Date().toISOString(),
      isRefreshing: false,
      totalRecords: 0,
      
      // 搜索防抖
      searchDebounceTimer: null
    };
  },
  
  computed: {
    searchPlaceholder() {
      if (this.dataStatus === 'loading') {
        return 'Loading data...';
      }
      return this.placeholder;
    },
    
    dataStatusClass() {
      return `status-${this.dataStatus}`;
    },
    
    dataStatusIcon() {
      const icons = {
        'loading': '⏳',
        'healthy': '✅',
        'error': '❌'
      };
      return icons[this.dataStatus] || '❓';
    },
    
    dataStatusText() {
      const texts = {
        'loading': 'Loading Data',
        'healthy': 'Static Data',
        'error': 'Data Error'
      };
      return texts[this.dataStatus] || 'Unknown';
    },
    
    dataStatusDetail() {
      return `${this.totalRecords} occupations available`;
    },
    
    showHistory() {
      return !this.hasSearched && (!this.searchKeyword || this.searchKeyword.trim() === '');
    }
  },
  
  mounted() {
    this.initializeSearch();
  },
  
  methods: {
    /**
     * 初始化搜索功能
     */
    initializeSearch() {
      console.log('🔍 初始化搜索功能...');
      
      try {
        // 加载静态数据
        this.loadStaticData();
        
        // 加载搜索历史
        this.loadSearchHistory();
        
        console.log('✅ 搜索功能初始化完成');
      } catch (error) {
        console.error('❌ 搜索功能初始化失败:', error);
        this.dataStatus = 'error';
      }
    },
    
    /**
     * 加载静态数据
     */
    loadStaticData() {
      try {
        if (occupationsData && occupationsData.length > 0) {
          this.dataStatus = 'healthy';
          this.dataSource = 'Static Data';
          this.lastUpdated = new Date().toISOString();
          this.totalRecords = occupationsData.length;
          
          console.log(`✅ 静态数据加载成功: ${this.totalRecords} 条记录`);
        } else {
          throw new Error('静态数据不可用');
        }
      } catch (error) {
        console.error('❌ 静态数据加载失败:', error);
        this.dataStatus = 'error';
      }
    },
    
    /**
     * 搜索输入处理
     */
    onSearchInput(e) {
      this.searchKeyword = e.detail.value;
      
      // 防抖处理
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      
      this.searchDebounceTimer = setTimeout(() => {
        this.performSearch();
      }, 300);
    },
    
    /**
     * 搜索框聚焦
     */
    onSearchFocus() {
      this.showResults = true;
      if (!this.searchKeyword) {
        this.loadSearchHistory();
      }
    },
    
    /**
     * 搜索框失焦
     */
    onSearchBlur() {
      // 延迟隐藏，允许点击搜索结果
      setTimeout(() => {
        this.showResults = false;
      }, 200);
    },
    
    /**
     * 执行搜索
     */
    performSearch() {
      if (!this.searchKeyword.trim()) {
        this.searchResults = [];
        this.hasSearched = false;
        return;
      }

      this.isSearching = true;
      this.hasSearched = true;
      
      try {
        // 使用静态数据搜索
        const results = searchOccupations(this.searchKeyword);
        
        // 处理搜索结果
        this.searchResults = searchResultProcessor.processResults(results, {
          keyword: this.searchKeyword,
          highlightMatches: true,
          sortBy: 'relevance'
        });
        
        console.log(`🔍 搜索完成: "${this.searchKeyword}" 找到 ${this.searchResults.length} 个结果`);
        
      } catch (error) {
        console.error('❌ 搜索失败:', error);
        this.searchResults = [];
      } finally {
        this.isSearching = false;
      }
    },
    
    /**
     * 选择职业
     */
    selectOccupation(occupation) {
      console.log('选择职业:', occupation);
      
      // 保存搜索历史
      if (this.searchKeyword.trim()) {
        searchHistoryManager.saveSearchHistory(this.searchKeyword.trim());
        this.loadSearchHistory();
      }
      
      // 隐藏搜索结果
      this.showResults = false;
      
      // 触发选择事件
      this.$emit('select', occupation);
    },
    
    /**
     * 选择历史记录
     */
    selectHistoryItem(item) {
      this.searchKeyword = item;
      this.performSearch();
    },
    
    /**
     * 清除搜索
     */
    clearSearch() {
      this.searchKeyword = '';
      this.searchResults = [];
      this.hasSearched = false;
      this.loadSearchHistory();
    },
    
    /**
     * 加载搜索历史
     */
    loadSearchHistory() {
      this.searchHistory = searchHistoryManager.getSearchHistory();
    },
    
    /**
     * 清除搜索历史
     */
    clearHistory() {
      uni.showModal({
        title: 'Clear Search History',
        content: 'Are you sure you want to clear all search history?',
        success: (res) => {
          if (res.confirm) {
            searchHistoryManager.clearSearchHistory();
            this.searchHistory = [];
            uni.showToast({
              title: 'History cleared',
              icon: 'success',
              duration: 1500
            });
          }
        }
      });
    },
    
  }
};
</script>

<style scoped>
.commercial-search-container {
  width: 100%;
  position: relative;
}

/* 数据状态栏 */
.data-status-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.status-healthy {
  background: linear-gradient(135deg, #00b894, #00cec9);
  color: #fff;
}

.status-loading {
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
  color: #333;
}

.status-error {
  background: linear-gradient(135deg, #fd79a8, #e84393);
  color: #fff;
}

.status-icon {
  margin-right: 16rpx;
  font-size: 28rpx;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-text {
  font-size: 26rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.status-detail {
  font-size: 22rpx;
  opacity: 0.8;
}

.refresh-btn {
  padding: 12rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.refresh-btn.refreshing {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 搜索框样式 */
.search-box-wrapper {
  margin-bottom: 20rpx;
}

.search-input-container {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2rpx solid #4A90E2;
  border-radius: 50rpx;
  padding: 24rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(74, 144, 226, 0.1);
}

.search-icon {
  margin-right: 20rpx;
  font-size: 32rpx;
  color: #666;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  background: transparent;
  border: none;
}

.search-placeholder {
  color: #999;
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
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
  font-size: 28rpx;
}

/* 搜索结果样式 */
.search-results-container {
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
  padding: 30rpx;
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
  gap: 16rpx;
}

.history-item {
  padding: 12rpx 20rpx;
  background: #f8f9fa;
  border-radius: 24rpx;
  border: 1rpx solid #e9ecef;
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
</style>