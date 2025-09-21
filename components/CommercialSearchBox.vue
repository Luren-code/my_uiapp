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
          
          <!-- 语音搜索按钮 -->
          <view class="voice-btn" @click="startVoiceSearch">
            <text>🎤</text>
          </view>
          
          <!-- 高级搜索按钮 -->
          <view class="advanced-btn" @click="toggleAdvancedSearch">
            <text>⚙️</text>
          </view>
        </view>
      </view>

      <!-- 高级搜索选项 -->
      <view v-if="showAdvancedSearch" class="advanced-search-panel">
        <view class="advanced-option">
          <text class="option-label">Category:</text>
          <picker 
            :value="selectedCategoryIndex"
            :range="categoryOptions"
            @change="onCategoryChange"
          >
            <view class="picker-text">{{ selectedCategory || 'All Categories' }}</view>
          </picker>
        </view>
        
        <view class="advanced-option">
          <text class="option-label">Visa Type:</text>
          <picker 
            :value="selectedVisaIndex"
            :range="visaOptions"
            @change="onVisaChange"
          >
            <view class="picker-text">{{ selectedVisa || 'All Visas' }}</view>
          </picker>
        </view>
        
        <view class="advanced-option">
          <text class="option-label">Skill Level:</text>
          <picker 
            :value="selectedSkillLevelIndex"
            :range="skillLevelOptions"
            @change="onSkillLevelChange"
          >
            <view class="picker-text">{{ selectedSkillLevel || 'All Levels' }}</view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 搜索建议 -->
    <view v-if="showSuggestions && (suggestions.length > 0 || searchHistory.length > 0)" class="suggestions-panel">
      <!-- 实时建议 -->
      <view v-if="suggestions.length > 0" class="suggestions-section">
        <view class="section-title">
          <text>💡 Suggestions</text>
        </view>
        <scroll-view scroll-y class="suggestions-list">
          <view 
            v-for="(suggestion, index) in suggestions" 
            :key="index"
            class="suggestion-item"
            @click="selectSuggestion(suggestion)"
          >
            <view class="suggestion-icon">
              <text>{{ getSuggestionIcon(suggestion.type) }}</text>
            </view>
            <view class="suggestion-content">
              <text class="suggestion-title">{{ suggestion.title }}</text>
              <text class="suggestion-subtitle">{{ suggestion.subtitle }}</text>
            </view>
            <view class="suggestion-meta">
              <text class="suggestion-type">{{ suggestion.type }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 搜索历史 -->
      <view v-if="searchHistory.length > 0 && !searchKeyword" class="history-section">
        <view class="section-title">
          <text>🕒 Recent Searches</text>
          <text class="clear-history-btn" @click="clearSearchHistory">Clear</text>
        </view>
        <view class="history-list">
          <view 
            v-for="(historyItem, index) in searchHistory" 
            :key="index"
            class="history-item"
            @click="selectHistory(historyItem)"
          >
            <text class="history-text">{{ historyItem }}</text>
            <view class="remove-history-btn" @click.stop="removeHistory(historyItem)">
              <text>✕</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 热门搜索 -->
      <view v-if="!searchKeyword" class="popular-section">
        <view class="section-title">
          <text>🔥 Popular Searches</text>
        </view>
        <view class="popular-tags">
          <view 
            v-for="(tag, index) in popularSearches" 
            :key="index"
            class="popular-tag"
            @click="selectPopularSearch(tag)"
          >
            <text>{{ tag }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索结果统计 -->
    <view v-if="searchResults.length > 0 || isSearching" class="search-stats">
      <view v-if="isSearching" class="loading-stats">
        <text>🔍 Searching...</text>
      </view>
      <view v-else class="results-stats">
        <text>Found {{ searchResults.length }} results</text>
        <text class="search-time">({{ searchTime }}ms)</text>
        <text class="data-quality">Quality: {{ dataQuality }}%</text>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view v-if="searchResults.length > 0" class="search-results">
      <CommercialSearchResults 
        :results="searchResults"
        :keyword="searchKeyword"
        :filters="searchFilters"
        @item-click="onResultClick"
        @load-more="loadMoreResults"
      />
    </view>

    <!-- 无结果提示 -->
    <view v-if="showNoResults" class="no-results">
      <view class="no-results-icon">
        <text>😔</text>
      </view>
      <text class="no-results-title">No Results Found</text>
      <text class="no-results-subtitle">Try adjusting your search terms or filters</text>
      <view class="no-results-suggestions">
        <text class="suggestion-title">Suggestions:</text>
        <text>• Check spelling</text>
        <text>• Use broader terms</text>
        <text>• Try different categories</text>
      </view>
    </view>

    <!-- 错误提示 -->
    <view v-if="searchError" class="search-error">
      <view class="error-icon">
        <text>⚠️</text>
      </view>
      <text class="error-title">Search Error</text>
      <text class="error-message">{{ searchError }}</text>
      <view class="error-actions">
        <button class="retry-btn" @click="retrySearch">Retry</button>
        <button class="fallback-btn" @click="useFallbackSearch">Use Offline Data</button>
      </view>
    </view>
  </view>
</template>

<script>
import enhancedAPIService from '../api/enhanced-api-service.js';
import searchHistoryManager from '../utils/searchHistory.js';

export default {
  name: 'CommercialSearchBox',
  
  props: {
    // 搜索配置
    placeholder: {
      type: String,
      default: 'Search occupations, codes, or keywords...'
    },
    
    // 是否启用高级搜索
    enableAdvancedSearch: {
      type: Boolean,
      default: true
    },
    
    // 是否启用语音搜索
    enableVoiceSearch: {
      type: Boolean,
      default: true
    },
    
    // 搜索防抖延迟
    debounceDelay: {
      type: Number,
      default: 300
    },
    
    // 最大搜索结果数
    maxResults: {
      type: Number,
      default: 50
    }
  },
  
  data() {
    return {
      // 搜索状态
      searchKeyword: '',
      isSearching: false,
      searchResults: [],
      searchError: null,
      searchTime: 0,
      dataQuality: 0,
      
      // UI状态
      showSuggestions: false,
      showAdvancedSearch: false,
      showNoResults: false,
      
      // 搜索建议
      suggestions: [],
      searchHistory: [],
      popularSearches: [
        'Software Engineer',
        'Registered Nurse', 
        'Civil Engineer',
        'Accountant',
        'ICT',
        '261313'
      ],
      
      // 高级搜索选项
      selectedCategory: '',
      selectedCategoryIndex: 0,
      selectedVisa: '',
      selectedVisaIndex: 0,
      selectedSkillLevel: '',
      selectedSkillLevelIndex: 0,
      
      categoryOptions: ['All Categories', 'ICT', 'Engineering', 'Healthcare', 'Management', 'Finance', 'Education', 'Social Work'],
      visaOptions: ['All Visas', '189', '190', '491', '482', '485'],
      skillLevelOptions: ['All Levels', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
      
      // 数据状态
      dataStatus: 'loading',
      dataSource: 'unknown',
      lastUpdated: null,
      isRefreshing: false,
      
      // 搜索防抖
      searchDebounceTimer: null,
      
      // 搜索索引
      searchIndex: null
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
        'cached': '📦',
        'fallback': '⚠️',
        'error': '❌'
      };
      return icons[this.dataStatus] || '❓';
    },
    
    dataStatusText() {
      const texts = {
        'loading': 'Loading Data',
        'healthy': 'Live Data',
        'cached': 'Cached Data',
        'fallback': 'Offline Data',
        'error': 'Data Error'
      };
      return texts[this.dataStatus] || 'Unknown';
    },
    
    dataStatusDetail() {
      if (this.lastUpdated) {
        const time = new Date(this.lastUpdated);
        const now = new Date();
        const diff = now - time;
        
        if (diff < 60000) {
          return 'Just updated';
        } else if (diff < 3600000) {
          return `${Math.floor(diff / 60000)}m ago`;
        } else if (diff < 86400000) {
          return `${Math.floor(diff / 3600000)}h ago`;
        } else {
          return `${Math.floor(diff / 86400000)}d ago`;
        }
      }
      return '';
    },
    
    searchFilters() {
      return {
        category: this.selectedCategory,
        visa: this.selectedVisa,
        skillLevel: this.selectedSkillLevel
      };
    }
  },
  
  async mounted() {
    await this.initializeSearch();
  },
  
  methods: {
    /**
     * 初始化搜索功能
     */
    async initializeSearch() {
      console.log('🔍 初始化商业级搜索功能...');
      
      try {
        // 加载搜索历史
        this.searchHistory = searchHistoryManager.getSearchHistory();
        
        // 初始化数据
        await this.loadInitialData();
        
        // 启动实时监控
        enhancedAPIService.startRealTimeMonitoring();
        
        console.log('✅ 搜索功能初始化完成');
      } catch (error) {
        console.error('❌ 搜索功能初始化失败:', error);
        this.dataStatus = 'error';
      }
    },
    
    /**
     * 加载初始数据
     */
    async loadInitialData() {
      this.dataStatus = 'loading';
      
      try {
        const result = await enhancedAPIService.fetchCommercialData();
        
        if (result && result.data) {
          this.dataStatus = result.metadata?.fallbackMode ? 'fallback' : 'healthy';
          this.dataSource = result.metadata?.dataSources?.join(', ') || 'unknown';
          this.lastUpdated = result.metadata?.lastUpdated;
          this.dataQuality = result.quality?.score || 0;
          
          // 构建搜索索引
          await this.buildSearchIndex(result.data);
          
          console.log(`✅ 加载了 ${result.data.length} 条数据，质量评分: ${this.dataQuality}%`);
        } else {
          throw new Error('无法获取数据');
        }
      } catch (error) {
        console.error('❌ 数据加载失败:', error);
        this.dataStatus = 'error';
        this.searchError = error.message;
      }
    },
    
    /**
     * 构建搜索索引
     */
    async buildSearchIndex(data) {
      try {
        // 尝试获取缓存的搜索索引
        let searchIndex = enhancedAPIService.getCachedData('search_index');
        
        if (!searchIndex) {
          // 重建搜索索引
          searchIndex = await enhancedAPIService.rebuildSearchIndex();
        }
        
        this.searchIndex = searchIndex;
        console.log('✅ 搜索索引构建完成');
      } catch (error) {
        console.error('❌ 搜索索引构建失败:', error);
        // 降级到简单搜索
        this.searchIndex = { fullText: data.map(item => ({ item, searchableText: '', keywords: [] })) };
      }
    },
    
    /**
     * 搜索输入处理
     */
    onSearchInput(event) {
      const keyword = event.detail.value;
      this.searchKeyword = keyword;
      
      // 清除之前的防抖定时器
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      
      // 设置新的防抖定时器
      this.searchDebounceTimer = setTimeout(() => {
        this.performSearch(keyword);
      }, this.debounceDelay);
      
      // 实时更新建议
      this.updateSuggestions(keyword);
    },
    
    /**
     * 搜索焦点处理
     */
    onSearchFocus() {
      this.showSuggestions = true;
      this.updateSuggestions(this.searchKeyword);
    },
    
    /**
     * 搜索失焦处理
     */
    onSearchBlur() {
      // 延迟隐藏建议，允许用户点击建议项
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200);
    },
    
    /**
     * 执行搜索
     */
    async performSearch(keyword) {
      if (!keyword || keyword.trim() === '') {
        this.searchResults = [];
        this.showNoResults = false;
        this.searchError = null;
        return;
      }
      
      const trimmedKeyword = keyword.trim();
      const startTime = Date.now();
      
      this.isSearching = true;
      this.searchError = null;
      this.showNoResults = false;
      
      try {
        console.log(`🔍 开始搜索: "${trimmedKeyword}"`);
        
        // 执行智能搜索
        const results = await this.intelligentSearch(trimmedKeyword);
        
        this.searchTime = Date.now() - startTime;
        this.searchResults = results.slice(0, this.maxResults);
        this.showNoResults = results.length === 0;
        
        // 保存搜索历史
        if (results.length > 0) {
          searchHistoryManager.saveSearchHistory(trimmedKeyword);
          this.searchHistory = searchHistoryManager.getSearchHistory();
        }
        
        console.log(`✅ 搜索完成: 找到 ${results.length} 个结果，耗时 ${this.searchTime}ms`);
        
      } catch (error) {
        console.error('❌ 搜索失败:', error);
        this.searchError = error.message;
        this.searchResults = [];
      } finally {
        this.isSearching = false;
      }
    },
    
    /**
     * 智能搜索算法
     */
    async intelligentSearch(keyword) {
      if (!this.searchIndex) {
        throw new Error('搜索索引未初始化');
      }
      
      const results = new Map();
      const searchTerm = keyword.toLowerCase();
      
      // 1. 精确匹配（最高优先级）
      if (this.searchIndex.byCode) {
        const exactMatch = this.searchIndex.byCode.get(searchTerm);
        if (exactMatch) {
          results.set(exactMatch.code, { ...exactMatch, score: 100, matchType: 'exact_code' });
        }
      }
      
      // 2. 名称匹配
      if (this.searchIndex.byName) {
        for (const [name, items] of this.searchIndex.byName) {
          if (name.includes(searchTerm)) {
            const score = name === searchTerm ? 95 : 85;
            items.forEach(item => {
              if (!results.has(item.code) || results.get(item.code).score < score) {
                results.set(item.code, { ...item, score, matchType: 'name' });
              }
            });
          }
        }
      }
      
      // 3. 类别匹配
      if (this.searchIndex.byCategory) {
        for (const [category, items] of this.searchIndex.byCategory) {
          if (category.includes(searchTerm)) {
            items.forEach(item => {
              if (!results.has(item.code) || results.get(item.code).score < 70) {
                results.set(item.code, { ...item, score: 70, matchType: 'category' });
              }
            });
          }
        }
      }
      
      // 4. 全文搜索
      if (this.searchIndex.fullText) {
        this.searchIndex.fullText.forEach(({ item, searchableText, keywords }) => {
          let score = 0;
          
          // 关键词匹配
          const matchingKeywords = keywords.filter(kw => kw.includes(searchTerm));
          if (matchingKeywords.length > 0) {
            score = Math.min(60, 20 + matchingKeywords.length * 10);
          }
          
          // 全文匹配
          if (searchableText.includes(searchTerm)) {
            score = Math.max(score, 50);
          }
          
          if (score > 0 && (!results.has(item.code) || results.get(item.code).score < score)) {
            results.set(item.code, { ...item, score, matchType: 'fulltext' });
          }
        });
      }
      
      // 应用高级搜索过滤器
      let filteredResults = Array.from(results.values());
      filteredResults = this.applyAdvancedFilters(filteredResults);
      
      // 按分数排序
      filteredResults.sort((a, b) => b.score - a.score);
      
      return filteredResults;
    },
    
    /**
     * 应用高级搜索过滤器
     */
    applyAdvancedFilters(results) {
      let filtered = results;
      
      // 类别过滤
      if (this.selectedCategory && this.selectedCategory !== 'All Categories') {
        filtered = filtered.filter(item => item.category === this.selectedCategory);
      }
      
      // 签证类型过滤
      if (this.selectedVisa && this.selectedVisa !== 'All Visas') {
        filtered = filtered.filter(item => 
          item.visaSubclasses && item.visaSubclasses.includes(this.selectedVisa)
        );
      }
      
      // 技能等级过滤
      if (this.selectedSkillLevel && this.selectedSkillLevel !== 'All Levels') {
        const level = parseInt(this.selectedSkillLevel.replace('Level ', ''));
        filtered = filtered.filter(item => item.skillLevel === level);
      }
      
      return filtered;
    },
    
    /**
     * 更新搜索建议
     */
    updateSuggestions(keyword) {
      if (!keyword || keyword.length < 2) {
        this.suggestions = [];
        return;
      }
      
      const suggestions = [];
      const searchTerm = keyword.toLowerCase();
      
      // 基于搜索索引生成建议
      if (this.searchIndex) {
        // 代码建议
        if (this.searchIndex.byCode) {
          for (const [code, item] of this.searchIndex.byCode) {
            if (code.includes(searchTerm) && suggestions.length < 5) {
              suggestions.push({
                title: item.englishName,
                subtitle: `Code: ${item.code}`,
                type: 'code',
                value: item.code
              });
            }
          }
        }
        
        // 名称建议
        if (this.searchIndex.byName) {
          for (const [name, items] of this.searchIndex.byName) {
            if (name.includes(searchTerm) && suggestions.length < 8) {
              const item = items[0];
              suggestions.push({
                title: item.englishName,
                subtitle: item.chineseName || item.category,
                type: 'occupation',
                value: item.englishName
              });
            }
          }
        }
        
        // 类别建议
        if (this.searchIndex.byCategory) {
          for (const [category, items] of this.searchIndex.byCategory) {
            if (category.includes(searchTerm) && suggestions.length < 10) {
              suggestions.push({
                title: category,
                subtitle: `${items.length} occupations`,
                type: 'category',
                value: category
              });
            }
          }
        }
      }
      
      this.suggestions = suggestions;
    },
    
    /**
     * 选择搜索建议
     */
    selectSuggestion(suggestion) {
      this.searchKeyword = suggestion.value;
      this.showSuggestions = false;
      this.performSearch(suggestion.value);
    },
    
    /**
     * 选择搜索历史
     */
    selectHistory(historyItem) {
      this.searchKeyword = historyItem;
      this.showSuggestions = false;
      this.performSearch(historyItem);
    },
    
    /**
     * 选择热门搜索
     */
    selectPopularSearch(tag) {
      this.searchKeyword = tag;
      this.showSuggestions = false;
      this.performSearch(tag);
    },
    
    /**
     * 获取建议图标
     */
    getSuggestionIcon(type) {
      const icons = {
        'code': '🔢',
        'occupation': '💼',
        'category': '📁',
        'keyword': '🔍'
      };
      return icons[type] || '💡';
    },
    
    /**
     * 清除搜索
     */
    clearSearch() {
      this.searchKeyword = '';
      this.searchResults = [];
      this.showNoResults = false;
      this.searchError = null;
      this.suggestions = [];
    },
    
    /**
     * 清除搜索历史
     */
    clearSearchHistory() {
      searchHistoryManager.clearSearchHistory();
      this.searchHistory = [];
      uni.showToast({
        title: 'Search history cleared',
        icon: 'success'
      });
    },
    
    /**
     * 删除单个历史记录
     */
    removeHistory(historyItem) {
      searchHistoryManager.removeSearchItem(historyItem);
      this.searchHistory = searchHistoryManager.getSearchHistory();
    },
    
    /**
     * 启动语音搜索
     */
    startVoiceSearch() {
      if (!this.enableVoiceSearch) return;
      
      // 这里可以集成语音识别API
      uni.showToast({
        title: 'Voice search coming soon',
        icon: 'none'
      });
    },
    
    /**
     * 切换高级搜索
     */
    toggleAdvancedSearch() {
      this.showAdvancedSearch = !this.showAdvancedSearch;
    },
    
    /**
     * 高级搜索选项变更
     */
    onCategoryChange(event) {
      this.selectedCategoryIndex = event.detail.value;
      this.selectedCategory = this.categoryOptions[event.detail.value];
      if (this.selectedCategory === 'All Categories') {
        this.selectedCategory = '';
      }
      
      // 重新执行搜索
      if (this.searchKeyword) {
        this.performSearch(this.searchKeyword);
      }
    },
    
    onVisaChange(event) {
      this.selectedVisaIndex = event.detail.value;
      this.selectedVisa = this.visaOptions[event.detail.value];
      if (this.selectedVisa === 'All Visas') {
        this.selectedVisa = '';
      }
      
      if (this.searchKeyword) {
        this.performSearch(this.searchKeyword);
      }
    },
    
    onSkillLevelChange(event) {
      this.selectedSkillLevelIndex = event.detail.value;
      this.selectedSkillLevel = this.skillLevelOptions[event.detail.value];
      if (this.selectedSkillLevel === 'All Levels') {
        this.selectedSkillLevel = '';
      }
      
      if (this.searchKeyword) {
        this.performSearch(this.searchKeyword);
      }
    },
    
    /**
     * 刷新数据
     */
    async refreshData() {
      if (this.isRefreshing) return;
      
      this.isRefreshing = true;
      
      try {
        console.log('🔄 手动刷新数据...');
        
        const result = await enhancedAPIService.smartRefresh('all');
        
        if (result.commercial_data?.success) {
          await this.loadInitialData();
          
          uni.showToast({
            title: 'Data refreshed successfully',
            icon: 'success'
          });
          
          // 如果有搜索关键词，重新搜索
          if (this.searchKeyword) {
            this.performSearch(this.searchKeyword);
          }
        } else {
          throw new Error('数据刷新失败');
        }
        
      } catch (error) {
        console.error('❌ 数据刷新失败:', error);
        uni.showToast({
          title: 'Refresh failed',
          icon: 'none'
        });
      } finally {
        this.isRefreshing = false;
      }
    },
    
    /**
     * 重试搜索
     */
    async retrySearch() {
      this.searchError = null;
      
      if (this.searchKeyword) {
        await this.performSearch(this.searchKeyword);
      }
    },
    
    /**
     * 使用降级搜索
     */
    async useFallbackSearch() {
      try {
        // 强制使用本地数据
        const { occupationsData } = await import('../data/occupations.js');
        
        // 构建简单搜索索引
        this.searchIndex = {
          fullText: occupationsData.map(item => ({
            item,
            searchableText: [
              item.code,
              item.englishName,
              item.chineseName,
              item.category
            ].filter(Boolean).join(' ').toLowerCase(),
            keywords: []
          }))
        };
        
        this.dataStatus = 'fallback';
        this.searchError = null;
        
        if (this.searchKeyword) {
          await this.performSearch(this.searchKeyword);
        }
        
        uni.showToast({
          title: 'Using offline data',
          icon: 'success'
        });
        
      } catch (error) {
        console.error('❌ 降级搜索失败:', error);
        uni.showToast({
          title: 'Fallback search failed',
          icon: 'none'
        });
      }
    },
    
    /**
     * 搜索结果点击
     */
    onResultClick(item) {
      this.$emit('result-click', item);
    },
    
    /**
     * 加载更多结果
     */
    loadMoreResults() {
      // 实现分页加载逻辑
      this.$emit('load-more');
    }
  }
};
</script>

<style scoped>
.commercial-search-container {
  width: 100%;
  background: #fff;
}

/* 数据状态指示器 */
.data-status-bar {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.status-loading {
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
}

.status-healthy {
  background: linear-gradient(135deg, #00b894, #00cec9);
}

.status-cached {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
}

.status-fallback {
  background: linear-gradient(135deg, #fdcb6e, #e17055);
}

.status-error {
  background: linear-gradient(135deg, #fd79a8, #e84393);
}

.status-icon {
  margin-right: 10px;
}

.status-emoji {
  font-size: 16px;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}

.status-detail {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.refresh-btn {
  padding: 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.refresh-btn.refreshing {
  animation: spin 1s linear infinite;
}

.refresh-icon {
  font-size: 16px;
  color: #fff;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 搜索框样式 */
.search-box-wrapper {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-input-container {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.search-icon {
  margin-right: 10px;
  font-size: 18px;
  color: #666;
}

.search-input {
  flex: 1;
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
}

.search-placeholder {
  color: #999;
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-btn,
.voice-btn,
.advanced-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #f5f5f5;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.clear-btn:hover,
.voice-btn:hover,
.advanced-btn:hover {
  background: #e0e0e0;
  color: #333;
}

/* 高级搜索面板 */
.advanced-search-panel {
  padding: 15px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.advanced-option {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.option-label {
  width: 80px;
  font-size: 14px;
  color: #666;
  margin-right: 10px;
}

.picker-text {
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  min-width: 120px;
}

/* 搜索建议面板 */
.suggestions-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  overflow: hidden;
  max-height: 400px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9fa;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
}

.clear-history-btn {
  font-size: 12px;
  color: #007AFF;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 122, 255, 0.1);
}

/* 建议列表 */
.suggestions-list {
  max-height: 200px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.suggestion-item:hover {
  background: #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-icon {
  margin-right: 12px;
  font-size: 16px;
}

.suggestion-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.suggestion-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.suggestion-subtitle {
  font-size: 12px;
  color: #666;
}

.suggestion-meta {
  margin-left: 8px;
}

.suggestion-type {
  font-size: 10px;
  color: #999;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
}

/* 搜索历史 */
.history-list {
  padding: 8px 0;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 15px;
  transition: background-color 0.3s ease;
}

.history-item:hover {
  background: #f8f9fa;
}

.history-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.remove-history-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0f0f0;
  font-size: 12px;
  color: #666;
}

/* 热门搜索 */
.popular-tags {
  padding: 12px 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.popular-tag {
  padding: 6px 12px;
  background: #007AFF;
  color: #fff;
  border-radius: 16px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.popular-tag:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

/* 搜索统计 */
.search-stats {
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.loading-stats {
  font-size: 14px;
  color: #666;
}

.results-stats {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #333;
}

.search-time {
  color: #666;
  font-size: 12px;
}

.data-quality {
  color: #007AFF;
  font-size: 12px;
  font-weight: 600;
}

/* 无结果提示 */
.no-results {
  text-align: center;
  padding: 40px 20px;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-results-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.no-results-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.no-results-suggestions {
  text-align: left;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  display: inline-block;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

/* 错误提示 */
.search-error {
  text-align: center;
  padding: 30px 20px;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  margin: 10px 0;
}

.error-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.error-title {
  font-size: 16px;
  font-weight: 600;
  color: #e53e3e;
  margin-bottom: 8px;
}

.error-message {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.retry-btn,
.fallback-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn {
  background: #007AFF;
  color: #fff;
}

.retry-btn:hover {
  background: #0056b3;
}

.fallback-btn {
  background: #6c757d;
  color: #fff;
}

.fallback-btn:hover {
  background: #545b62;
}
</style>
