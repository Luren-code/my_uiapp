<template>
  <view class="search-wrapper">
    <!-- 使用 uv-ui 的搜索组件 -->
    <uv-search
      v-model="searchKeyword"
      placeholder="输入职业名称或代码搜索"
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
    <view class="dropdown-panel" v-if="showDropdown">
      <view class="dropdown-content">
        <!-- 搜索历史 -->
        <view class="history-section" v-if="showHistory">
          <view class="section-header">
            <text class="section-title">最近搜索</text>
            <uv-button
              text="清除"
              type="info"
              plain
              size="mini"
              @click="clearHistory"
            ></uv-button>
          </view>
          
          <view class="history-tags">
            <uv-tag
              v-for="(item, index) in searchHistory"
              :key="index"
              :text="item"
              plain
              size="mini"
              type="info"
              @click="selectHistory(item)"
              customStyle="margin: 8rpx"
            ></uv-tag>
          </view>
        </view>

        <!-- 搜索结果 -->
        <view class="results-section" v-if="showResults">
          <view class="section-title">搜索结果</view>
          
          <uv-list>
            <uv-list-item
              v-for="occupation in searchResults"
              :key="occupation.code"
              @click="selectOccupation(occupation)"
            >
              <template #content>
                <view class="result-content">
                  <uv-badge
                    :text="occupation.code"
                    type="primary"
                    :inverted="false"
                  ></uv-badge>
                  <view class="occupation-info">
                    <text class="occupation-name-en">{{ occupation.englishName }}</text>
                    <text class="occupation-name-zh">{{ occupation.chineseName }}</text>
                  </view>
                </view>
              </template>
            </uv-list-item>
          </uv-list>
        </view>

        <!-- 无结果 -->
        <uv-empty
          v-if="hasSearched && searchResults.length === 0"
          mode="search"
          text="未找到匹配的职业"
        ></uv-empty>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { searchOccupations } from '../data/occupations.js'

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
  showDropdown.value = true
}

const onSearchBlur = () => {
  // 延迟隐藏，允许点击结果
  setTimeout(() => {
    if (!searchKeyword.value && !showResults.value) {
      showDropdown.value = false
    }
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
  z-index: 999;
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

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

/* 搜索结果 */
.results-section {
  margin-top: 20rpx;
}

.result-content {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
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
</style>
