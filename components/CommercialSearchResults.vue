<template>
  <view class="commercial-search-results">
    <!-- 结果排序和过滤控制 -->
    <view class="results-controls">
      <view class="sort-controls">
        <text class="control-label">Sort by:</text>
        <picker 
          :value="selectedSortIndex"
          :range="sortOptions"
          @change="onSortChange"
        >
          <view class="sort-picker">{{ currentSort }}</view>
        </picker>
      </view>
      
      <view class="view-controls">
        <view 
          class="view-btn"
          :class="{ active: viewMode === 'list' }"
          @click="setViewMode('list')"
        >
          <text>☰</text>
        </view>
        <view 
          class="view-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="setViewMode('grid')"
        >
          <text>⊞</text>
        </view>
      </view>
    </view>

    <!-- 搜索结果列表 -->
    <scroll-view 
      class="results-container"
      :class="viewModeClass"
      scroll-y
      @scrolltolower="handleLoadMore"
      enhanced
      show-scrollbar
    >
      <!-- 列表视图 -->
      <view v-if="viewMode === 'list'" class="list-view">
        <view 
          v-for="(item, index) in sortedResults" 
          :key="item.code"
          class="result-item list-item"
          :class="{ 'even': index % 2 === 0 }"
          @click="onItemClick(item)"
        >
          <!-- 职业基本信息 -->
          <view class="item-header">
            <view class="occupation-info">
              <view class="occupation-title">
                <text class="english-name">{{ item.englishName }}</text>
                <view class="match-indicator" :class="getMatchClass(item.matchType)">
                  <text class="match-text">{{ getMatchText(item.matchType) }}</text>
                  <text class="match-score">{{ item.score }}%</text>
                </view>
              </view>
              
              <view class="occupation-subtitle">
                <text class="chinese-name">{{ item.chineseName }}</text>
                <text class="occupation-code">Code: {{ item.anzscoCode }}</text>
              </view>
            </view>
            
            <view class="item-actions">
              <view class="favorite-btn" @click.stop="toggleFavorite(item)">
                <text>{{ item.isFavorite ? '❤️' : '🤍' }}</text>
              </view>
              <view class="share-btn" @click.stop="shareItem(item)">
                <text>📤</text>
              </view>
            </view>
          </view>

          <!-- 职业详细信息 -->
          <view class="item-content">
            <view class="info-row">
              <view class="info-item">
                <text class="info-label">Category:</text>
                <view class="category-tag" :class="getCategoryClass(item.category)">
                  <text>{{ item.category }}</text>
                </view>
              </view>
              
              <view class="info-item">
                <text class="info-label">Skill Level:</text>
                <view class="skill-level">
                  <text>Level {{ item.skillLevel }}</text>
                  <view class="skill-stars">
                    <text v-for="n in 5" :key="n" class="star" :class="{ filled: n <= item.skillLevel }">★</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 签证信息 -->
            <view class="visa-info">
              <text class="info-label">Eligible Visas:</text>
              <view class="visa-tags">
                <view 
                  v-for="visa in item.visaSubclasses" 
                  :key="visa"
                  class="visa-tag"
                  :class="getVisaClass(visa)"
                >
                  <text>{{ visa }}</text>
                </view>
              </view>
            </view>

            <!-- 职业列表状态 -->
            <view class="occupation-lists">
              <view v-if="item.mltssl" class="list-badge mltssl">
                <text>MLTSSL</text>
              </view>
              <view v-if="item.stsol" class="list-badge stsol">
                <text>STSOL</text>
              </view>
              <view v-if="item.rol" class="list-badge rol">
                <text>ROL</text>
              </view>
            </view>

            <!-- 评估机构和薪资 -->
            <view class="additional-info">
              <view class="assessment-info">
                <text class="info-label">Assessment:</text>
                <text class="assessment-authority">{{ item.assessmentAuthority }}</text>
              </view>
              
              <view v-if="item.averageSalary" class="salary-info">
                <text class="info-label">Salary:</text>
                <text class="salary-range">{{ item.averageSalary }}</text>
              </view>
            </view>

            <!-- 邀请数据 -->
            <view v-if="item.invitationData && item.invitationData.lastRound" class="invitation-info">
              <view class="invitation-header">
                <text class="info-label">Latest Invitation Round:</text>
                <text class="last-round">{{ formatDate(item.invitationData.lastRound) }}</text>
              </view>
              
              <view class="invitation-details">
                <view class="invitation-item">
                  <text class="invitation-label">Min Points:</text>
                  <text class="invitation-value points">{{ item.invitationData.minPoints }}</text>
                </view>
                <view class="invitation-item">
                  <text class="invitation-label">Invitations:</text>
                  <text class="invitation-value count">{{ item.invitationData.invitationCount }}</text>
                </view>
              </view>
            </view>

            <!-- 数据质量指示器 -->
            <view class="data-quality">
              <view class="quality-bar">
                <view class="quality-fill" :style="{ width: item.dataQuality?.confidence + '%' }"></view>
              </view>
              <text class="quality-text">Data Quality: {{ item.dataQuality?.confidence || 85 }}%</text>
              <text class="data-source">Source: {{ getDataSource(item.dataSources) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 网格视图 -->
      <view v-else class="grid-view">
        <view 
          v-for="item in sortedResults" 
          :key="item.code"
          class="result-item grid-item"
          @click="onItemClick(item)"
        >
          <view class="grid-header">
            <view class="occupation-title">
              <text class="english-name">{{ truncateText(item.englishName, 20) }}</text>
              <text class="occupation-code">{{ item.anzscoCode }}</text>
            </view>
            <view class="match-score">{{ item.score }}%</view>
          </view>
          
          <view class="grid-content">
            <text class="chinese-name">{{ truncateText(item.chineseName, 15) }}</text>
            
            <view class="category-tag" :class="getCategoryClass(item.category)">
              <text>{{ item.category }}</text>
            </view>
            
            <view class="visa-summary">
              <text class="visa-count">{{ item.visaSubclasses?.length || 0 }} visas</text>
            </view>
            
            <view class="quick-info">
              <text class="skill-level">Level {{ item.skillLevel }}</text>
              <text class="assessment">{{ truncateText(item.assessmentAuthority, 10) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多指示器 -->
      <view v-if="hasMore" class="load-more-container">
        <view v-if="isLoadingMore" class="loading-more">
          <text>Loading more results...</text>
        </view>
        <view v-else class="load-more-btn" @click="handleLoadMore">
          <text>Load More Results</text>
        </view>
      </view>

      <!-- 结果底部信息 -->
      <view class="results-footer">
        <text class="results-summary">
          Showing {{ sortedResults.length }} of {{ totalResults }} results
        </text>
        <text class="search-info">
          Search completed in {{ searchTime }}ms with {{ dataQuality }}% data quality
        </text>
      </view>
    </scroll-view>

    <!-- 快速操作面板 -->
    <view v-if="selectedItems.length > 0" class="batch-actions">
      <view class="batch-header">
        <text>{{ selectedItems.length }} items selected</text>
        <view class="clear-selection" @click="clearSelection">
          <text>Clear</text>
        </view>
      </view>
      
      <view class="batch-buttons">
        <button class="batch-btn compare-btn" @click="compareSelected">
          Compare
        </button>
        <button class="batch-btn export-btn" @click="exportSelected">
          Export
        </button>
        <button class="batch-btn favorite-btn" @click="favoriteSelected">
          Add to Favorites
        </button>
      </view>
    </view>

    <!-- 详情预览弹窗 -->
    <view v-if="showPreview" class="preview-modal" @click="closePreview">
      <view class="preview-content" @click.stop>
        <view class="preview-header">
          <text class="preview-title">{{ previewItem?.englishName }}</text>
          <view class="close-preview" @click="closePreview">
            <text>✕</text>
          </view>
        </view>
        
        <scroll-view class="preview-body" scroll-y>
          <view class="preview-section">
            <text class="section-title">Basic Information</text>
            <view class="preview-info">
              <text class="preview-label">Chinese Name:</text>
              <text class="preview-value">{{ previewItem?.chineseName }}</text>
            </view>
            <view class="preview-info">
              <text class="preview-label">ANZSCO Code:</text>
              <text class="preview-value">{{ previewItem?.anzscoCode }}</text>
            </view>
            <view class="preview-info">
              <text class="preview-label">Category:</text>
              <text class="preview-value">{{ previewItem?.category }}</text>
            </view>
          </view>
          
          <view v-if="previewItem?.description" class="preview-section">
            <text class="section-title">Description</text>
            <text class="description-text">{{ previewItem.description }}</text>
          </view>
          
          <view v-if="previewItem?.tasks && previewItem.tasks.length > 0" class="preview-section">
            <text class="section-title">Key Tasks</text>
            <view class="task-list">
              <text 
                v-for="(task, index) in previewItem.tasks" 
                :key="index"
                class="task-item"
              >
                • {{ task }}
              </text>
            </view>
          </view>
        </scroll-view>
        
        <view class="preview-actions">
          <button class="preview-btn details-btn" @click="viewFullDetails">
            View Full Details
          </button>
          <button class="preview-btn favorite-btn" @click="togglePreviewFavorite">
            {{ previewItem?.isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CommercialSearchResults',
  
  props: {
    // 搜索结果数据
    results: {
      type: Array,
      default: () => []
    },
    
    // 搜索关键词
    keyword: {
      type: String,
      default: ''
    },
    
    // 搜索过滤器
    filters: {
      type: Object,
      default: () => ({})
    },
    
    // 搜索时间
    searchTime: {
      type: Number,
      default: 0
    },
    
    // 数据质量
    dataQuality: {
      type: Number,
      default: 100
    },
    
    // 总结果数
    totalResults: {
      type: Number,
      default: 0
    },
    
    // 是否有更多结果
    hasMore: {
      type: Boolean,
      default: false
    },
    
    // 是否正在加载更多
    isLoadingMore: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      // 视图模式
      viewMode: 'list', // 'list' | 'grid'
      
      // 排序选项
      sortOptions: [
        'Relevance',
        'Name A-Z',
        'Name Z-A', 
        'Code',
        'Category',
        'Skill Level',
        'Latest Invitation',
        'Min Points'
      ],
      selectedSortIndex: 0,
      currentSort: 'Relevance',
      
      // 选择状态
      selectedItems: [],
      
      // 预览状态
      showPreview: false,
      previewItem: null,
      
      // 收藏列表
      favorites: []
    };
  },
  
  computed: {
    viewModeClass() {
      return `view-${this.viewMode}`;
    },
    
    sortedResults() {
      let sorted = [...this.results];
      
      switch (this.currentSort) {
        case 'Name A-Z':
          sorted.sort((a, b) => a.englishName.localeCompare(b.englishName));
          break;
        case 'Name Z-A':
          sorted.sort((a, b) => b.englishName.localeCompare(a.englishName));
          break;
        case 'Code':
          sorted.sort((a, b) => a.anzscoCode.localeCompare(b.anzscoCode));
          break;
        case 'Category':
          sorted.sort((a, b) => a.category.localeCompare(b.category));
          break;
        case 'Skill Level':
          sorted.sort((a, b) => a.skillLevel - b.skillLevel);
          break;
        case 'Latest Invitation':
          sorted.sort((a, b) => {
            const dateA = new Date(a.invitationData?.lastRound || 0);
            const dateB = new Date(b.invitationData?.lastRound || 0);
            return dateB - dateA;
          });
          break;
        case 'Min Points':
          sorted.sort((a, b) => {
            const pointsA = a.invitationData?.minPoints || 999;
            const pointsB = b.invitationData?.minPoints || 999;
            return pointsA - pointsB;
          });
          break;
        default: // Relevance
          sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
      }
      
      return sorted;
    }
  },
  
  mounted() {
    this.loadFavorites();
  },
  
  methods: {
    /**
     * 设置视图模式
     */
    setViewMode(mode) {
      this.viewMode = mode;
      
      // 保存用户偏好
      uni.setStorageSync('search_view_mode', mode);
    },
    
    /**
     * 排序变更
     */
    onSortChange(event) {
      this.selectedSortIndex = event.detail.value;
      this.currentSort = this.sortOptions[event.detail.value];
    },
    
    /**
     * 项目点击处理
     */
    onItemClick(item) {
      // 显示预览或直接跳转到详情页
      if (this.viewMode === 'list') {
        this.showItemPreview(item);
      } else {
        this.viewItemDetails(item);
      }
      
      this.$emit('item-click', item);
    },
    
    /**
     * 显示项目预览
     */
    showItemPreview(item) {
      this.previewItem = { ...item };
      this.showPreview = true;
    },
    
    /**
     * 关闭预览
     */
    closePreview() {
      this.showPreview = false;
      this.previewItem = null;
    },
    
    /**
     * 查看完整详情
     */
    viewItemDetails(item = this.previewItem) {
      this.closePreview();
      
      uni.navigateTo({
        url: `/pages/occupation-detail/detail?code=${item.anzscoCode}&name=${encodeURIComponent(item.englishName)}`
      });
    },
    
    /**
     * 查看完整详情
     */
    viewFullDetails() {
      this.viewItemDetails();
    },
    
    /**
     * 切换收藏状态
     */
    toggleFavorite(item) {
      const index = this.favorites.findIndex(fav => fav.code === item.code);
      
      if (index >= 0) {
        this.favorites.splice(index, 1);
        item.isFavorite = false;
      } else {
        this.favorites.push({
          code: item.code,
          englishName: item.englishName,
          chineseName: item.chineseName,
          category: item.category,
          addedAt: new Date().toISOString()
        });
        item.isFavorite = true;
      }
      
      this.saveFavorites();
      
      uni.showToast({
        title: item.isFavorite ? 'Added to favorites' : 'Removed from favorites',
        icon: 'success',
        duration: 1500
      });
    },
    
    /**
     * 切换预览项收藏状态
     */
    togglePreviewFavorite() {
      if (this.previewItem) {
        this.toggleFavorite(this.previewItem);
      }
    },
    
    /**
     * 分享项目
     */
    shareItem(item) {
      const shareContent = `${item.englishName} (${item.chineseName})\nANZSCO Code: ${item.anzscoCode}\nCategory: ${item.category}`;
      
      // 这里可以集成分享API
      uni.setClipboardData({
        data: shareContent,
        success: () => {
          uni.showToast({
            title: 'Copied to clipboard',
            icon: 'success'
          });
        }
      });
    },
    
    /**
     * 加载更多结果
     */
    handleLoadMore() {
      if (!this.hasMore || this.isLoadingMore) return;
      
      this.$emit('load-more');
    },
    
    /**
     * 清除选择
     */
    clearSelection() {
      this.selectedItems = [];
    },
    
    /**
     * 比较选中项
     */
    compareSelected() {
      if (this.selectedItems.length < 2) {
        uni.showToast({
          title: 'Please select at least 2 items',
          icon: 'none'
        });
        return;
      }
      
      // 跳转到比较页面
      const codes = this.selectedItems.map(item => item.code).join(',');
      uni.navigateTo({
        url: `/pages/occupation-compare/compare?codes=${codes}`
      });
    },
    
    /**
     * 导出选中项
     */
    exportSelected() {
      const exportData = this.selectedItems.map(item => ({
        code: item.anzscoCode,
        englishName: item.englishName,
        chineseName: item.chineseName,
        category: item.category,
        skillLevel: item.skillLevel,
        visaSubclasses: item.visaSubclasses?.join(', '),
        assessmentAuthority: item.assessmentAuthority,
        averageSalary: item.averageSalary
      }));
      
      const csvContent = this.convertToCSV(exportData);
      
      // 这里可以实现文件下载或分享
      uni.setClipboardData({
        data: csvContent,
        success: () => {
          uni.showToast({
            title: 'Data copied to clipboard',
            icon: 'success'
          });
        }
      });
    },
    
    /**
     * 批量添加到收藏
     */
    favoriteSelected() {
      let addedCount = 0;
      
      this.selectedItems.forEach(item => {
        if (!this.favorites.find(fav => fav.code === item.code)) {
          this.favorites.push({
            code: item.code,
            englishName: item.englishName,
            chineseName: item.chineseName,
            category: item.category,
            addedAt: new Date().toISOString()
          });
          item.isFavorite = true;
          addedCount++;
        }
      });
      
      if (addedCount > 0) {
        this.saveFavorites();
        uni.showToast({
          title: `Added ${addedCount} items to favorites`,
          icon: 'success'
        });
      } else {
        uni.showToast({
          title: 'All items already in favorites',
          icon: 'none'
        });
      }
      
      this.clearSelection();
    },
    
    /**
     * 获取匹配类型样式类
     */
    getMatchClass(matchType) {
      return `match-${matchType || 'default'}`;
    },
    
    /**
     * 获取匹配类型文本
     */
    getMatchText(matchType) {
      const texts = {
        'exact_code': 'Exact',
        'name': 'Name',
        'category': 'Category',
        'fulltext': 'Content',
        'default': 'Match'
      };
      return texts[matchType] || 'Match';
    },
    
    /**
     * 获取类别样式类
     */
    getCategoryClass(category) {
      return `category-${(category || '').toLowerCase().replace(/\s+/g, '-')}`;
    },
    
    /**
     * 获取签证样式类
     */
    getVisaClass(visa) {
      const classes = {
        '189': 'visa-189',
        '190': 'visa-190', 
        '491': 'visa-491',
        '482': 'visa-482',
        '485': 'visa-485'
      };
      return classes[visa] || 'visa-default';
    },
    
    /**
     * 获取数据源显示文本
     */
    getDataSource(sources) {
      if (!sources || sources.length === 0) return 'Unknown';
      
      const sourceNames = {
        'SKILLSELECT': 'Official',
        'ABS': 'ABS',
        'DATA_GOV_AU': 'Gov Data',
        'LOCAL_BACKUP': 'Local'
      };
      
      return sources.map(source => sourceNames[source] || source).join(', ');
    },
    
    /**
     * 截断文本
     */
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    
    /**
     * 格式化日期
     */
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    /**
     * 转换为CSV格式
     */
    convertToCSV(data) {
      if (!data || data.length === 0) return '';
      
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => 
        Object.values(item).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      );
      
      return [headers, ...rows].join('\n');
    },
    
    /**
     * 加载收藏列表
     */
    loadFavorites() {
      try {
        const saved = uni.getStorageSync('occupation_favorites');
        this.favorites = saved || [];
        
        // 标记结果中的收藏项
        this.results.forEach(item => {
          item.isFavorite = this.favorites.some(fav => fav.code === item.code);
        });
      } catch (error) {
        console.error('加载收藏列表失败:', error);
      }
    },
    
    /**
     * 保存收藏列表
     */
    saveFavorites() {
      try {
        uni.setStorageSync('occupation_favorites', this.favorites);
      } catch (error) {
        console.error('保存收藏列表失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.commercial-search-results {
  width: 100%;
  background: #fff;
}

/* 结果控制栏 */
.results-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-label {
  font-size: 14px;
  color: #666;
}

.sort-picker {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  min-width: 100px;
}

.view-controls {
  display: flex;
  gap: 8px;
}

.view-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 16px;
  color: #666;
  transition: all 0.3s ease;
}

.view-btn.active {
  background: #007AFF;
  border-color: #007AFF;
  color: #fff;
}

/* 结果容器 */
.results-container {
  height: 600px;
}

/* 列表视图 */
.list-view {
  padding: 0;
}

.list-item {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.list-item:hover {
  background: #f8f9fa;
}

.list-item.even {
  background: rgba(0, 122, 255, 0.02);
}

/* 项目头部 */
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.occupation-info {
  flex: 1;
}

.occupation-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.english-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.match-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.match-exact_code {
  background: #d4edda;
  color: #155724;
}

.match-name {
  background: #cce5ff;
  color: #004085;
}

.match-category {
  background: #fff3cd;
  color: #856404;
}

.match-fulltext {
  background: #f8d7da;
  color: #721c24;
}

.match-default {
  background: #e2e3e5;
  color: #495057;
}

.occupation-subtitle {
  display: flex;
  align-items: center;
  gap: 15px;
}

.chinese-name {
  font-size: 14px;
  color: #666;
}

.occupation-code {
  font-size: 12px;
  color: #999;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.favorite-btn,
.share-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #f5f5f5;
  font-size: 16px;
  transition: all 0.3s ease;
}

.favorite-btn:hover,
.share-btn:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

/* 项目内容 */
.item-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  gap: 30px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.category-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
}

.category-ict {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.category-engineering {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.category-healthcare {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.category-management {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.category-finance {
  background: linear-gradient(135deg, #fa709a, #fee140);
}

.category-education {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #333;
}

.category-social-work {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  color: #333;
}

.skill-level {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 12px;
  color: #ddd;
}

.star.filled {
  color: #ffd700;
}

/* 签证信息 */
.visa-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.visa-tags {
  display: flex;
  gap: 6px;
}

.visa-tag {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
  color: #fff;
}

.visa-189 {
  background: #28a745;
}

.visa-190 {
  background: #007bff;
}

.visa-491 {
  background: #ffc107;
  color: #333;
}

.visa-482 {
  background: #6f42c1;
}

.visa-485 {
  background: #fd7e14;
}

.visa-default {
  background: #6c757d;
}

/* 职业列表徽章 */
.occupation-lists {
  display: flex;
  gap: 8px;
}

.list-badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mltssl {
  background: #d4edda;
  color: #155724;
}

.stsol {
  background: #cce5ff;
  color: #004085;
}

.rol {
  background: #fff3cd;
  color: #856404;
}

/* 附加信息 */
.additional-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assessment-info,
.salary-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.assessment-authority {
  font-size: 12px;
  color: #007AFF;
  font-weight: 500;
}

.salary-range {
  font-size: 12px;
  color: #28a745;
  font-weight: 600;
}

/* 邀请信息 */
.invitation-info {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #007AFF;
}

.invitation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.last-round {
  font-size: 12px;
  color: #007AFF;
  font-weight: 600;
}

.invitation-details {
  display: flex;
  gap: 20px;
}

.invitation-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.invitation-label {
  font-size: 11px;
  color: #666;
}

.invitation-value {
  font-size: 12px;
  font-weight: 600;
}

.invitation-value.points {
  color: #e74c3c;
}

.invitation-value.count {
  color: #27ae60;
}

/* 数据质量指示器 */
.data-quality {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.quality-bar {
  width: 60px;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.quality-fill {
  height: 100%;
  background: linear-gradient(90deg, #e74c3c, #f39c12, #27ae60);
  transition: width 0.3s ease;
}

.quality-text {
  font-size: 10px;
  color: #666;
}

.data-source {
  font-size: 9px;
  color: #999;
  background: #f0f0f0;
  padding: 1px 4px;
  border-radius: 3px;
}

/* 网格视图 */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  padding: 15px;
}

.grid-item {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-color: #007AFF;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.grid-header .occupation-title {
  flex: 1;
}

.grid-header .english-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  display: block;
}

.grid-header .occupation-code {
  font-size: 11px;
  color: #999;
  background: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
}

.match-score {
  font-size: 12px;
  font-weight: 600;
  color: #007AFF;
  background: rgba(0, 122, 255, 0.1);
  padding: 4px 6px;
  border-radius: 6px;
}

.grid-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.grid-content .chinese-name {
  font-size: 13px;
  color: #666;
}

.visa-summary {
  font-size: 11px;
  color: #666;
}

.visa-count {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 10px;
}

.quick-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #999;
}

/* 加载更多 */
.load-more-container {
  padding: 20px;
  text-align: center;
}

.loading-more {
  font-size: 14px;
  color: #666;
}

.load-more-btn {
  padding: 12px 24px;
  background: #007AFF;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.load-more-btn:hover {
  background: #0056b3;
}

/* 结果底部信息 */
.results-footer {
  padding: 20px 15px;
  text-align: center;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.results-summary {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  display: block;
}

.search-info {
  font-size: 12px;
  color: #666;
}

/* 批量操作面板 */
.batch-actions {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 16px;
  z-index: 1000;
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.clear-selection {
  font-size: 12px;
  color: #007AFF;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 122, 255, 0.1);
}

.batch-buttons {
  display: flex;
  gap: 10px;
}

.batch-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.compare-btn {
  background: #007AFF;
  color: #fff;
}

.export-btn {
  background: #28a745;
  color: #fff;
}

.batch-btn.favorite-btn {
  background: #e74c3c;
  color: #fff;
}

/* 预览弹窗 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.preview-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.close-preview {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0f0f0;
  font-size: 16px;
  color: #666;
  cursor: pointer;
}

.preview-body {
  flex: 1;
  padding: 20px;
  max-height: 400px;
}

.preview-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.preview-info {
  display: flex;
  margin-bottom: 8px;
}

.preview-label {
  width: 120px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.preview-value {
  flex: 1;
  font-size: 13px;
  color: #333;
}

.description-text {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-item {
  font-size: 13px;
  line-height: 1.5;
  color: #555;
}

.preview-actions {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

.preview-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.details-btn {
  background: #007AFF;
  color: #fff;
}

.details-btn:hover {
  background: #0056b3;
}

.preview-btn.favorite-btn {
  background: #e74c3c;
  color: #fff;
}

.preview-btn.favorite-btn:hover {
  background: #c0392b;
}
</style>
