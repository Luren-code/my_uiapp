<template>
  <view class="real-search-results-container" v-if="showResults">
    <!-- 搜索结果标题 -->
    <view class="results-header" v-if="searchResults.length > 0">
      <text class="results-title">官方数据搜索结果</text>
      <text class="results-count">找到 {{ searchResults.length }} 个官方职业</text>
      <text class="data-source">数据来源: {{ dataSourceInfo }}</text>
    </view>
    
    <!-- 搜索结果列表 -->
    <view class="results-list" v-if="searchResults.length > 0">
      <view 
        class="result-item official" 
        v-for="occupation in searchResults" 
        :key="occupation.code"
        @click="selectOccupation(occupation)"
      >
        <view class="occupation-header">
          <view class="occupation-code">{{ occupation.code }}</view>
          <view class="official-badge">官方</view>
        </view>
        <view class="occupation-info">
          <text class="occupation-english">{{ occupation.englishName }}</text>
          <text class="occupation-chinese" v-if="occupation.chineseName">{{ occupation.chineseName }}</text>
        </view>
        <view class="occupation-meta" v-if="occupation.source">
          <text class="meta-source">来源: {{ occupation.source }}</text>
          <text class="meta-updated" v-if="occupation.lastUpdated">
            更新: {{ formatTime(occupation.lastUpdated) }}
          </text>
        </view>
      </view>
    </view>
    
    <!-- 无搜索结果 -->
    <view class="no-results official" v-else-if="hasSearched">
      <view class="no-results-icon">🔍</view>
      <text class="no-results-text">未在官方数据中找到匹配职业</text>
      <text class="no-results-tip">
        • 尝试使用6位职业代码搜索（如：261313）<br/>
        • 尝试使用英文职业名称搜索<br/>
        • 确认职业在澳洲移民局SkillSelect列表中
      </text>
      <view class="official-link">
        <text class="link-text" @click="openOfficialList">📋 查看完整官方职业列表</text>
      </view>
    </view>
    
    <!-- 搜索历史 - 仅显示成功的官方搜索 -->
    <view class="search-history official" v-if="showHistory && officialSearchHistory.length > 0">
      <view class="history-header">
        <text class="history-title">官方数据搜索历史</text>
        <text class="clear-history" @click="clearHistory">清除</text>
      </view>
      <view class="history-list">
        <view 
          class="history-item" 
          v-for="(item, index) in officialSearchHistory" 
          :key="index"
          @click="selectHistoryItem(item)"
        >
          <text class="history-text">{{ item.keyword }}</text>
          <text class="history-count">{{ item.resultCount }}个结果</text>
          <text class="remove-history" @click.stop="removeHistoryItem(item)">×</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RealSearchResults',
  
  props: {
    searchKeyword: {
      type: String,
      default: ''
    },
    showResults: {
      type: Boolean,
      default: false
    },
    officialData: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      searchResults: [],
      hasSearched: false,
      showHistory: true,
      officialSearchHistory: [],
      dataSourceInfo: ''
    };
  },
  
  watch: {
    searchKeyword: {
      handler(newKeyword) {
        if (newKeyword && newKeyword.trim()) {
          this.performOfficialSearch(newKeyword.trim());
        } else {
          this.searchResults = [];
          this.hasSearched = false;
          this.loadSearchHistory();
        }
      },
      immediate: true
    },
    
    officialData: {
      handler(newData) {
        if (newData && newData.length > 0) {
          this.dataSourceInfo = newData[0].source || '澳洲移民局官方';
          // 如果有搜索关键词，重新搜索
          if (this.searchKeyword && this.searchKeyword.trim()) {
            this.performOfficialSearch(this.searchKeyword.trim());
          }
        }
      },
      immediate: true
    }
  },
  
  mounted() {
    this.loadSearchHistory();
  },
  
  methods: {
    /**
     * 执行官方数据搜索
     */
    performOfficialSearch(keyword) {
      if (!keyword || keyword.trim() === '') {
        this.searchResults = [];
        this.hasSearched = false;
        return;
      }
      
      if (!this.officialData || this.officialData.length === 0) {
        console.warn('没有可用的官方数据进行搜索');
        this.searchResults = [];
        this.hasSearched = true;
        return;
      }
      
      this.hasSearched = true;
      
      try {
        const searchTerm = keyword.toLowerCase().trim();
        
        // 在官方数据中搜索
        this.searchResults = this.officialData.filter(occupation => {
          const code = (occupation.code || '').toLowerCase();
          const englishName = (occupation.englishName || '').toLowerCase();
          const chineseName = occupation.chineseName || '';
          const category = (occupation.category || '').toLowerCase();
          
          return code.includes(searchTerm) ||
                 englishName.includes(searchTerm) ||
                 chineseName.includes(keyword.trim()) || // 中文搜索保持原始大小写
                 category.includes(searchTerm);
        });
        
        console.log(`官方数据搜索完成: "${keyword}" 找到 ${this.searchResults.length} 个结果`);
        
      } catch (error) {
        console.error('官方数据搜索失败:', error);
        this.searchResults = [];
        
        uni.showToast({
          title: '搜索失败',
          icon: 'error',
          duration: 2000
        });
      }
    },
    
    /**
     * 选择职业
     */
    selectOccupation(occupation) {
      // 保存成功的官方搜索历史
      this.saveOfficialSearchHistory(this.searchKeyword, this.searchResults.length);
      
      // 触发选择事件
      this.$emit('select', occupation);
      
      // 显示选择提示
      uni.showToast({
        title: `已选择官方职业: ${occupation.code}`,
        icon: 'success',
        duration: 2000
      });
    },
    
    /**
     * 保存官方搜索历史
     */
    saveOfficialSearchHistory(keyword, resultCount) {
      if (!keyword || keyword.trim() === '') return;
      
      try {
        // 移除重复项
        this.officialSearchHistory = this.officialSearchHistory.filter(
          item => item.keyword !== keyword.trim()
        );
        
        // 添加新的搜索记录
        this.officialSearchHistory.unshift({
          keyword: keyword.trim(),
          resultCount: resultCount,
          timestamp: new Date().toISOString(),
          dataSource: this.dataSourceInfo
        });
        
        // 限制历史记录数量
        if (this.officialSearchHistory.length > 8) {
          this.officialSearchHistory = this.officialSearchHistory.slice(0, 8);
        }
        
        // 保存到本地存储
        uni.setStorageSync('official_search_history', this.officialSearchHistory);
        
      } catch (error) {
        console.error('保存官方搜索历史失败:', error);
      }
    },
    
    /**
     * 加载搜索历史
     */
    loadSearchHistory() {
      try {
        const history = uni.getStorageSync('official_search_history');
        this.officialSearchHistory = Array.isArray(history) ? history : [];
      } catch (error) {
        console.error('加载搜索历史失败:', error);
        this.officialSearchHistory = [];
      }
    },
    
    /**
     * 选择历史项目
     */
    selectHistoryItem(item) {
      this.$emit('search', item.keyword);
    },
    
    /**
     * 移除历史项目
     */
    removeHistoryItem(item) {
      try {
        this.officialSearchHistory = this.officialSearchHistory.filter(
          historyItem => historyItem.keyword !== item.keyword || 
                        historyItem.timestamp !== item.timestamp
        );
        
        // 更新本地存储
        uni.setStorageSync('official_search_history', this.officialSearchHistory);
        
      } catch (error) {
        console.error('移除历史项目失败:', error);
      }
    },
    
    /**
     * 清除历史
     */
    clearHistory() {
      uni.showModal({
        title: '确认清除',
        content: '确定要清除所有官方搜索历史吗？',
        success: (res) => {
          if (res.confirm) {
            this.officialSearchHistory = [];
            try {
              uni.removeStorageSync('official_search_history');
            } catch (error) {
              console.error('清除历史失败:', error);
            }
          }
        }
      });
    },
    
    /**
     * 打开官方职业列表
     */
    openOfficialList() {
      uni.showActionSheet({
        itemList: [
          'SkillSelect官方职业列表',
          '移民局技能职业列表',
          '澳洲统计局ANZSCO分类'
        ],
        success: (res) => {
          const urls = [
            'https://www.homeaffairs.gov.au/trav/work/work/skills-assessment-and-assessing-authorities/skilled-occupations-lists/combined-stsol-mltssl',
            'https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list',
            'https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations'
          ];
          
          // #ifdef H5
          window.open(urls[res.tapIndex], '_blank');
          // #endif
          
          // #ifndef H5
          uni.setClipboardData({
            data: urls[res.tapIndex],
            success: () => {
              uni.showToast({
                title: '链接已复制，请在浏览器中打开',
                icon: 'success',
                duration: 3000
              });
            }
          });
          // #endif
        }
      });
    },
    
    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      try {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // 1分钟内
          return '刚刚';
        } else if (diff < 3600000) { // 1小时内
          return Math.floor(diff / 60000) + '分钟前';
        } else if (diff < 86400000) { // 1天内
          return Math.floor(diff / 3600000) + '小时前';
        } else {
          return date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric'
          });
        }
      } catch (error) {
        return '';
      }
    }
  }
};
</script>

<style scoped>
.real-search-results-container {
  margin-top: 20rpx;
}

.results-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24rpx 30rpx;
  border-radius: 16rpx 16rpx 0 0;
  margin-bottom: 2rpx;
}

.results-title {
  font-size: 28rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 8rpx;
}

.results-count {
  font-size: 24rpx;
  opacity: 0.9;
  display: block;
  margin-bottom: 4rpx;
}

.data-source {
  font-size: 22rpx;
  opacity: 0.8;
  display: block;
}

.results-list {
  background: white;
  border-radius: 0 0 16rpx 16rpx;
  overflow: hidden;
}

.result-item.official {
  padding: 24rpx 30rpx;
  border-bottom: 2rpx solid #f5f5f5;
  transition: background-color 0.2s;
  border-left: 4rpx solid #34C759;
}

.result-item.official:last-child {
  border-bottom: none;
}

.result-item.official:active {
  background-color: #f8f9fa;
}

.occupation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.occupation-code {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.official-badge {
  background: #34C759;
  color: white;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
  font-weight: bold;
}

.occupation-info {
  margin-bottom: 8rpx;
}

.occupation-english {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.occupation-chinese {
  display: block;
  font-size: 26rpx;
  color: #666;
}

.occupation-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-source, .meta-updated {
  font-size: 22rpx;
  color: #999;
}

.no-results.official {
  background: white;
  padding: 60rpx 40rpx;
  text-align: center;
  border-radius: 16rpx;
  border-left: 4rpx solid #FF9500;
}

.no-results-icon {
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.no-results-text {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.no-results-tip {
  display: block;
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  text-align: left;
  margin-bottom: 24rpx;
}

.official-link {
  margin-top: 20rpx;
}

.link-text {
  color: #007AFF;
  font-size: 26rpx;
  text-decoration: underline;
}

.search-history.official {
  background: white;
  border-radius: 16rpx;
  margin-top: 20rpx;
  overflow: hidden;
  border-left: 4rpx solid #5856D6;
}

.history-header {
  background: linear-gradient(135deg, #5856D6, #007AFF);
  color: white;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-title {
  font-size: 26rpx;
  font-weight: bold;
}

.clear-history {
  font-size: 24rpx;
  opacity: 0.9;
}

.history-list {
  padding: 0;
}

.history-item {
  padding: 20rpx 30rpx;
  border-bottom: 2rpx solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-item:last-child {
  border-bottom: none;
}

.history-text {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.history-count {
  font-size: 22rpx;
  color: #34C759;
  margin-right: 20rpx;
}

.remove-history {
  color: #ccc;
  font-size: 32rpx;
  width: 40rpx;
  text-align: center;
}
</style>
