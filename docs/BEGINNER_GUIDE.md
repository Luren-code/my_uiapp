// 新手友好的API服务
// 专为没有后端经验的开发者设计

class BeginnerFriendlyAPI {
  constructor() {
    // 使用简单对象存储，避免复杂的Map/Set
    this.cache = {};
    this.isLoading = false;
  }

  /**
   * 主要方法：获取职业数据
   * 这是您需要调用的唯一方法
   */
  async getOccupationData() {
    console.log('🔍 开始获取职业数据...');
    
    try {
      // 第1步：检查本地缓存
      const cachedData = this.getLocalCache();
      if (cachedData && cachedData.length > 0) {
        console.log('✅ 使用本地缓存数据');
        return {
          success: true,
          data: cachedData,
          source: 'Local Cache',
          message: '使用缓存数据，速度更快'
        };
      }

      // 第2步：尝试获取官方数据
      console.log('📡 尝试获取官方数据...');
      const officialData = await this.fetchOfficialData();
      
      if (officialData && officialData.length > 0) {
        // 保存到缓存
        this.saveToCache(officialData);
        
        return {
          success: true,
          data: officialData,
          source: 'Official API',
          message: '获取到最新官方数据'
        };
      }

      // 第3步：使用备用数据
      console.log('📋 使用备用数据...');
      const backupData = this.getBackupData();
      
      return {
        success: true,
        data: backupData,
        source: 'Backup Data',
        message: '官方API暂不可用，使用备用数据'
      };

    } catch (error) {
      console.error('❌ 数据获取失败:', error);
      
      return {
        success: false,
        data: this.getBackupData(),
        source: 'Error Fallback',
        message: '数据获取失败，使用备用数据'
      };
    }
  }

  /**
   * 从官方API获取数据
   */
  async fetchOfficialData() {
    try {
      // 调用澳洲政府开放数据API
      const response = await uni.request({
        url: 'https://data.gov.au/api/3/action/package_search',
        method: 'GET',
        data: {
          q: 'anzsco occupation',
          rows: 100
        },
        header: {
          'Accept': 'application/json'
        },
        timeout: 10000 // 10秒超时
      });

      if (response.statusCode === 200 && response.data.success) {
        console.log('✅ 官方API调用成功');
        return this.processOfficialData(response.data.result.results);
      }

      console.warn('⚠️ 官方API响应异常');
      return [];

    } catch (error) {
      console.error('❌ 官方API调用失败:', error);
      return [];
    }
  }

  /**
   * 处理官方API返回的数据
   */
  processOfficialData(rawResults) {
    if (!Array.isArray(rawResults)) return [];

    const occupations = [];

    // 处理政府数据集
    for (const dataset of rawResults) {
      if (dataset.title && dataset.title.toLowerCase().includes('occupation')) {
        // 从数据集标题提取职业信息
        occupations.push({
          code: this.extractCode(dataset.title),
          englishName: dataset.title,
          chineseName: this.getChineseTranslation(dataset.title),
          category: this.guessCategory(dataset.title),
          description: dataset.notes || '官方数据集',
          source: 'Government API',
          lastUpdated: dataset.metadata_modified || new Date().toISOString()
        });
      }
    }

    return occupations.slice(0, 50); // 限制数量
  }

  /**
   * 搜索功能
   */
  searchOccupations(keyword, data) {
    if (!keyword || !data) return [];

    const searchTerm = keyword.toLowerCase().trim();
    
    return data.filter(item => {
      return (item.code || '').toLowerCase().includes(searchTerm) ||
             (item.englishName || '').toLowerCase().includes(searchTerm) ||
             (item.chineseName || '').includes(keyword) ||
             (item.category || '').toLowerCase().includes(searchTerm);
    });
  }

  /**
   * 获取热门职业
   */
  getPopularOccupations(data) {
    // 返回预定义的热门职业
    const popularCodes = ['261313', '234113', '233211', '254111', '221111'];
    
    return data.filter(item => popularCodes.includes(item.code));
  }

  /**
   * 本地缓存操作
   */
  getLocalCache() {
    try {
      const cached = uni.getStorageSync('beginner_occupation_cache');
      
      if (cached && cached.expiry && cached.expiry > Date.now()) {
        return cached.data;
      }
      
      return null;
    } catch (error) {
      console.error('读取缓存失败:', error);
      return null;
    }
  }

  saveToCache(data) {
    try {
      const cacheData = {
        data: data,
        expiry: Date.now() + (6 * 60 * 60 * 1000), // 6小时过期
        saved: new Date().toISOString()
      };
      
      uni.setStorageSync('beginner_occupation_cache', cacheData);
      console.log('✅ 数据已缓存');
    } catch (error) {
      console.error('保存缓存失败:', error);
    }
  }

  /**
   * 备用数据 - 确保应用始终可用
   */
  getBackupData() {
    return [
      {
        code: '261313',
        englishName: 'Software Engineer',
        chineseName: '软件工程师',
        category: 'ICT',
        description: '设计、开发、测试、实施和维护软件系统。',
        assessmentAuthority: 'ACS',
        visaSubclasses: ['189', '190', '491'],
        source: 'Backup Data'
      },
      {
        code: '234113',
        englishName: 'Forester / Forest Scientist',
        chineseName: '林业员/森林科学家',
        category: 'Agriculture',
        description: '研究、开发和管理森林资源。',
        assessmentAuthority: 'VETASSESS',
        visaSubclasses: ['189', '190', '491'],
        source: 'Backup Data'
      },
      {
        code: '233211',
        englishName: 'Civil Engineer',
        chineseName: '土木工程师',
        category: 'Engineering',
        description: '设计、开发和监督土木工程项目。',
        assessmentAuthority: 'Engineers Australia',
        visaSubclasses: ['189', '190', '491'],
        source: 'Backup Data'
      },
      {
        code: '254111',
        englishName: 'Midwife',
        chineseName: '助产士',
        category: 'Healthcare',
        description: '为孕妇、产妇和新生儿提供护理服务。',
        assessmentAuthority: 'ANMAC',
        visaSubclasses: ['189', '190', '491'],
        source: 'Backup Data'
      },
      {
        code: '221111',
        englishName: 'Accountant (General)',
        chineseName: '会计师(一般)',
        category: 'Finance',
        description: '编制和维护财务记录，编制财务报表。',
        assessmentAuthority: 'CPA Australia',
        visaSubclasses: ['189', '190', '491'],
        source: 'Backup Data'
      }
    ];
  }

  // 辅助方法
  extractCode(title) {
    // 尝试从标题中提取职业代码
    const match = title.match(/\b\d{6}\b/);
    return match ? match[0] : 'unknown';
  }

  getChineseTranslation(englishName) {
    const translations = {
      'Software Engineer': '软件工程师',
      'Civil Engineer': '土木工程师',
      'Forester': '林业员',
      'Forest Scientist': '森林科学家',
      'Midwife': '助产士',
      'Accountant': '会计师'
    };

    // 查找匹配的翻译
    for (const [eng, chn] of Object.entries(translations)) {
      if (englishName.includes(eng)) {
        return chn;
      }
    }

    return englishName; // 没有翻译时返回原文
  }

  guessCategory(title) {
    const categoryKeywords = {
      'ICT': ['software', 'computer', 'programmer', 'developer'],
      'Engineering': ['engineer', 'civil', 'mechanical'],
      'Healthcare': ['nurse', 'midwife', 'medical'],
      'Finance': ['accountant', 'finance', 'audit'],
      'Education': ['teacher', 'education'],
      'Agriculture': ['forest', 'agricultural', 'farm']
    };

    const lowerTitle = title.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerTitle.includes(keyword))) {
        return category;
      }
    }

    return 'Other';
  }
}

// 导出单例实例
export default new BeginnerFriendlyAPI();




