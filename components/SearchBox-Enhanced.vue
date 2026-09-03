<template>
  <view class="search-wrapper">
    <!-- 使用 uv-ui 的搜索组件 -->
    <uv-search
      v-model="searchKeyword"
      :placeholder="placeholder"
      :show-action="false"
      shape="round"
      bg-color="#FFFFFF"
      border-color="#4A90E2"
      @search="performSearch"
      @input="onSearchInput"
      @focus="onSearchFocus"
      @blur="onSearchBlur"
      @clear="clearSearch"
    ></uv-search>

    <!-- 下拉面板 -->
    <view class="dropdown-panel" v-show="showDropdown">
      <view class="dropdown-content">
        <!-- 搜索历史 -->
        <view class="history-section" v-if="showHistory">
          <view class="section-header">
            <text class="section-title">最近搜索</text>
            <text class="clear-history-btn" @click="clearHistory">清除</text>
          </view>
          
          <view class="history-tags">
            <view
              v-for="(item, index) in searchHistory"
              :key="index"
              class="history-tag"
              @click="selectHistory(item)"
            >
              {{ item }}
            </view>
          </view>
        </view>

        <!-- 搜索结果 -->
        <view class="results-section" v-if="showResults">
          <view class="section-title">搜索结果</view>
          
          <view class="results-list">
            <view
              v-for="occupation in searchResults"
              :key="occupation.code"
              class="result-item"
              @click="selectOccupation(occupation)"
            >
              <view class="result-content">
                <view class="occupation-code">{{ occupation.code }}</view>
                <view class="occupation-info">
                  <text class="occupation-name-en">{{ occupation.englishName }}</text>
                  <text class="occupation-name-zh">{{ occupation.chineseName }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 无结果 -->
        <view class="empty-state" v-if="hasSearched && searchResults.length === 0">
          <text class="empty-icon">🔍</text>
          <text class="empty-text">未找到匹配的职业</text>
          <text class="empty-hint">试试其他关键词或职业代码</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { searchOccupations } from '@/data/occupations.js'

// Props
const props = defineProps({
  placeholder: {
    type: String,
    default: '输入职业名称或代码搜索'
  }
})

// Emits
const emit = defineEmits(['select'])

// 响应式数据
const searchKeyword = ref('')
const searchResults = ref([])
const searchHistory = ref([])
const showDropdown = ref(false)
const hasSearched = ref(false)
let searchTimeout = null
let blurTimeout = null

// 计算属性
const showHistory = computed(() => {
  return !searchKeyword.value && searchHistory.value.length > 0
})

const showResults = computed(() => {
  return searchKeyword.value && searchResults.value.length > 0
})

// 生命周期
onMounted(() => {
  loadSearchHistory()
})

// 方法
const onSearchInput = (value) => {
  // 防抖处理
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    performSearch()
  }, 300)
}

const onSearchFocus = () => {
  // 1. 清除可能存在的隐藏操作（互斥锁）
  if (blurTimeout) {
    clearTimeout(blurTimeout)
    blurTimeout = null
  }

  // 2. 稍微延迟显示下拉，先让键盘稳稳地弹出来
  // 解决"单击失效，双击有效"的关键
  setTimeout(() => {
    showDropdown.value = true
  }, 200)
}

const onSearchBlur = () => {
  // 延迟隐藏，给用户操作留出时间，也防止键盘收起时的误触
  blurTimeout = setTimeout(() => {
    // 只有当真正需要隐藏时才隐藏
    showDropdown.value = false
  }, 200)
}

const performSearch = () => {
  const keyword = searchKeyword.value.trim()
  
  if (!keyword) {
    searchResults.value = []
    hasSearched.value = false
    return
  }
  
  hasSearched.value = true
  
  try {
    searchResults.value = searchOccupations(keyword)
    showDropdown.value = true
    console.log(`搜索 "${keyword}" 找到 ${searchResults.value.length} 个结果`)
  } catch (error) {
    console.error('搜索失败:', error)
    searchResults.value = []
  }
}

const selectOccupation = (occupation) => {
  console.log('选择职业:', occupation)
  
  // 保存搜索历史
  if (searchKeyword.value.trim()) {
    saveSearchHistory(searchKeyword.value.trim())
  }
  
  // 隐藏下拉框
  showDropdown.value = false
  
  // 显示选择提示
  uni.showToast({
    title: `已选择: ${occupation.code}`,
    icon: 'success',
    duration: 1000
  })
  
  // 触发父组件事件
  setTimeout(() => {
    emit('select', occupation)
  }, 100)
}

const selectHistory = (item) => {
  searchKeyword.value = item
  performSearch()
}

const clearSearch = () => {
  searchKeyword.value = ''
  searchResults.value = []
  hasSearched.value = false
}

const clearHistory = () => {
  uni.showModal({
    title: '清除搜索历史',
    content: '确定要清除所有搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        try {
          uni.removeStorageSync('eoi_search_history')
          searchHistory.value = []
          uni.showToast({
            title: '已清除',
            icon: 'success'
          })
        } catch (error) {
          console.error('清除历史失败:', error)
        }
      }
    }
  })
}

const loadSearchHistory = () => {
  try {
    const history = uni.getStorageSync('eoi_search_history') || []
    searchHistory.value = history.slice(0, 10)
  } catch (error) {
    console.error('加载搜索历史失败:', error)
    searchHistory.value = []
  }
}

const saveSearchHistory = (keyword) => {
  try {
    let history = uni.getStorageSync('eoi_search_history') || []
    history = history.filter(item => item !== keyword)
    history.unshift(keyword)
    if (history.length > 10) {
      history = history.slice(0, 10)
    }
    uni.setStorageSync('eoi_search_history', history)
    loadSearchHistory()
  } catch (error) {
    console.error('保存搜索历史失败:', error)
  }
}
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 16rpx);
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
  max-height: 600rpx;
  overflow: hidden;
  z-index: 9999;
}

.dropdown-content {
  padding: 30rpx 20rpx;
  max-height: 600rpx;
  overflow-y: auto;
}

/* 搜索历史 */
.history-section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.clear-history-btn {
  font-size: 24rpx;
  color: #4A90E2;
  padding: 4rpx 16rpx;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.history-tag {
  display: inline-block;
  padding: 8rpx 20rpx;
  background: #F0F4F8;
  border: 1rpx solid #D0DCE8;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #4A90E2;
  transition: all 0.3s;
}

.history-tag:active {
  background: #E0EAF4;
  transform: scale(0.95);
}

/* 搜索结果 */
.results-section {
  margin-top: 20rpx;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.result-item {
  background: #F8FAFB;
  border-radius: 12rpx;
  padding: 20rpx;
  transition: all 0.3s;
  border: 1rpx solid #E8ECF0;
}

.result-item:active {
  background: #EEF2F6;
  transform: scale(0.98);
}

.result-content {
  display: flex;
  align-items: center;
}

.occupation-code {
  background: #4A90E2;
  color: white;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 600;
  min-width: 120rpx;
  text-align: center;
}

.occupation-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-left: 20rpx;
}

.occupation-name-en {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.occupation-name-zh {
  font-size: 24rpx;
  color: #666;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  text-align: center;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #999;
}
</style>
