// 搜索历史管理工具
const SEARCH_HISTORY_KEY = 'eoi_search_history';
const MAX_HISTORY_COUNT = 10;

export default {
  // 保存搜索记录
  saveSearchHistory(keyword) {
    if (!keyword || keyword.trim() === '') {
      return;
    }
    
    const trimmedKeyword = keyword.trim();
    let history = this.getSearchHistory();
    
    // 移除重复项
    history = history.filter(item => item !== trimmedKeyword);
    
    // 添加到开头
    history.unshift(trimmedKeyword);
    
    // 限制数量
    if (history.length > MAX_HISTORY_COUNT) {
      history = history.slice(0, MAX_HISTORY_COUNT);
    }
    
    try {
      uni.setStorageSync(SEARCH_HISTORY_KEY, history);
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  },
  
  // 获取搜索历史
  getSearchHistory() {
    try {
      return uni.getStorageSync(SEARCH_HISTORY_KEY) || [];
    } catch (error) {
      console.error('获取搜索历史失败:', error);
      return [];
    }
  },
  
  // 清除搜索历史
  clearSearchHistory() {
    try {
      uni.removeStorageSync(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('清除搜索历史失败:', error);
    }
  },
  
  // 删除单个搜索记录
  removeSearchItem(keyword) {
    let history = this.getSearchHistory();
    history = history.filter(item => item !== keyword);
    
    try {
      uni.setStorageSync(SEARCH_HISTORY_KEY, history);
    } catch (error) {
      console.error('删除搜索记录失败:', error);
    }
  }
};

