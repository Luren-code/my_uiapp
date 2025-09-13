// 官方数据初始化和测试工具
// 用于测试和初始化SkillSelect官方API数据

import skillSelectAPI from '../api/skillselect-api.js';

class DataInitializer {
  constructor() {
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * 初始化官方数据
   */
  async initialize() {
    if (this.isInitialized) {
      return true;
    }

    if (this.initPromise) {
      return await this.initPromise;
    }

    this.initPromise = this.performInitialization();
    return await this.initPromise;
  }

  /**
   * 执行初始化
   */
  async performInitialization() {
    try {
      console.log('开始初始化官方数据...');

      // 测试API连接
      const isConnected = await this.testAPIConnection();
      if (!isConnected) {
        console.warn('官方API连接失败，将使用本地数据');
        return false;
      }

      // 获取并缓存官方数据
      const data = await skillSelectAPI.fetchAllOccupations();
      if (data && data.length > 0) {
        console.log(`成功初始化 ${data.length} 个职业数据`);
        this.isInitialized = true;
        return true;
      }

      console.warn('未获取到官方数据');
      return false;
    } catch (error) {
      console.error('数据初始化失败:', error);
      return false;
    }
  }

  /**
   * 测试API连接
   */
  async testAPIConnection() {
    try {
      console.log('测试官方API连接...');
      
      const response = await uni.request({
        url: 'https://api.dynamic.reports.employment.gov.au/anonap/extensions/hSKLS02_SkillSelect_EOI_Data/hSKLS02_SkillSelect_EOI_Data.html',
        method: 'GET',
        header: {
          'User-Agent': 'EOI-App/1.0'
        },
        timeout: 10000
      });

      const isSuccess = response.statusCode === 200;
      console.log(`API连接测试${isSuccess ? '成功' : '失败'}: ${response.statusCode}`);
      
      return isSuccess;
    } catch (error) {
      console.error('API连接测试失败:', error);
      return false;
    }
  }

  /**
   * 手动刷新数据
   */
  async refreshData() {
    try {
      console.log('手动刷新官方数据...');
      this.isInitialized = false;
      this.initPromise = null;
      
      const success = await this.initialize();
      if (success) {
        uni.showToast({
          title: 'Data updated successfully',
          icon: 'success'
        });
      } else {
        uni.showToast({
          title: 'Data update failed',
          icon: 'none'
        });
      }
      
      return success;
    } catch (error) {
      console.error('手动刷新失败:', error);
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
    const cachedData = uni.getStorageSync('skillselect_official_data');
    
    return {
      isInitialized: this.isInitialized,
      hasCachedData: !!cachedData,
      lastUpdated: cachedData?.lastUpdated || null,
      recordCount: cachedData?.data?.length || 0,
      source: cachedData?.source || 'Unknown'
    };
  }

  /**
   * 清除缓存数据
   */
  clearCache() {
    try {
      uni.removeStorageSync('skillselect_official_data');
      uni.removeStorageSync('eoi_search_history');
      this.isInitialized = false;
      this.initPromise = null;
      
      console.log('缓存数据已清除');
      uni.showToast({
        title: 'Cache cleared',
        icon: 'success'
      });
    } catch (error) {
      console.error('清除缓存失败:', error);
    }
  }

  /**
   * 导出数据（用于调试）
   */
  async exportData() {
    try {
      const data = await skillSelectAPI.fetchAllOccupations();
      const exportData = {
        exportTime: new Date().toISOString(),
        version: '1.0',
        source: 'Official SkillSelect API',
        totalCount: data.length,
        occupations: data
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
  async validateData() {
    try {
      const data = await skillSelectAPI.fetchAllOccupations();
      const validationResults = {
        totalRecords: data.length,
        validRecords: 0,
        invalidRecords: 0,
        missingFields: [],
        errors: []
      };

      const requiredFields = ['code', 'englishName', 'category', 'anzscoCode'];

      for (const occupation of data) {
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
