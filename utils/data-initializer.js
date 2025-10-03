// 静态数据初始化工具
// 用于初始化和管理本地静态数据

import { occupationsData } from '../data/occupations.js';

class DataInitializer {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * 初始化静态数据
   */
  initialize() {
    if (this.isInitialized) {
      return true;
    }

    try {
      console.log('开始初始化静态数据...');

      if (occupationsData && occupationsData.length > 0) {
        console.log(`成功初始化 ${occupationsData.length} 个职业数据`);
        this.isInitialized = true;
        return true;
      }

      console.warn('静态数据不可用');
      return false;
    } catch (error) {
      console.error('数据初始化失败:', error);
      return false;
    }
  }

  /**
   * 刷新数据（重新加载静态数据）
   */
  refreshData() {
    try {
      console.log('刷新静态数据...');
      this.isInitialized = false;
      
      const success = this.initialize();
      if (success) {
        uni.showToast({
          title: 'Data refreshed successfully',
          icon: 'success'
        });
      } else {
        uni.showToast({
          title: 'Data refresh failed',
          icon: 'none'
        });
      }
      
      return success;
    } catch (error) {
      console.error('刷新失败:', error);
      uni.showToast({
        title: 'Refresh failed',
        icon: 'none'
      });
      return false;
    }
  }

  /**
   * 获取数据状态
   */
  getDataStatus() {
    return {
      isInitialized: this.isInitialized,
      hasCachedData: false, // 静态数据无需缓存
      lastUpdated: null, // 静态数据无更新时间
      recordCount: occupationsData?.length || 0,
      source: 'Static Data'
    };
  }

  /**
   * 清除缓存数据（仅清除搜索历史）
   */
  clearCache() {
    try {
      uni.removeStorageSync('eoi_search_history');
      
      console.log('搜索历史已清除');
      uni.showToast({
        title: 'Search history cleared',
        icon: 'success'
      });
    } catch (error) {
      console.error('清除缓存失败:', error);
    }
  }

  /**
   * 导出数据（用于调试）
   */
  exportData() {
    try {
      const exportData = {
        exportTime: new Date().toISOString(),
        version: '1.0',
        source: 'Static Data',
        totalCount: occupationsData.length,
        occupations: occupationsData
      };

      // 在开发环境中，可以将数据保存到文件或打印到控制台
      console.log('导出数据:', exportData);
      
      return exportData;
    } catch (error) {
      console.error('导出数据失败:', error);
      throw error;
    }
  }

  /**
   * 验证数据完整性
   */
  validateData() {
    try {
      const validationResults = {
        totalRecords: occupationsData.length,
        validRecords: 0,
        invalidRecords: 0,
        missingFields: [],
        errors: []
      };

      const requiredFields = ['code', 'englishName', 'category', 'anzscoCode'];

      for (const occupation of occupationsData) {
        let isValid = true;
        const missingFields = [];

        for (const field of requiredFields) {
          if (!occupation[field]) {
            isValid = false;
            missingFields.push(field);
          }
        }

        if (isValid) {
          validationResults.validRecords++;
        } else {
          validationResults.invalidRecords++;
          validationResults.errors.push({
            code: occupation.code || 'Unknown',
            missingFields
          });
        }
      }

      console.log('数据验证结果:', validationResults);
      return validationResults;
    } catch (error) {
      console.error('数据验证失败:', error);
      throw error;
    }
  }
}

// 创建全局实例
const dataInitializer = new DataInitializer();

export default dataInitializer;

// 导出便捷方法
export const {
  initialize,
  refreshData,
  getDataStatus,
  clearCache,
  exportData,
  validateData
} = dataInitializer;