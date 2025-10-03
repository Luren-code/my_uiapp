// 搜索结果处理器
// 处理不同类型的搜索结果，统一数据格式和样式

/**
 * 搜索结果类型枚举
 */
export const SEARCH_RESULT_TYPES = {
  EXACT_MATCH: 'exact_match',      // 精确匹配
  NAME_MATCH: 'name_match',        // 名称匹配
  CODE_MATCH: 'code_match',        // 代码匹配
  CATEGORY_MATCH: 'category_match', // 类别匹配
  CONTENT_MATCH: 'content_match',   // 内容匹配
  FUZZY_MATCH: 'fuzzy_match'       // 模糊匹配
};

/**
 * 数据质量等级
 */
export const DATA_QUALITY_LEVELS = {
  EXCELLENT: 'excellent',  // 90-100%
  GOOD: 'good',           // 75-89%
  FAIR: 'fair',           // 60-74%
  POOR: 'poor'            // <60%
};

/**
 * 数据来源类型
 */
export const DATA_SOURCE_TYPES = {
  OFFICIAL: 'official',           // 官方数据
  COMMERCIAL: 'commercial',       // 商业数据源
  GOVERNMENT: 'government',       // 政府开放数据
  THIRD_PARTY: 'third_party',    // 第三方数据
  LOCAL: 'local',                // 本地数据
  CACHED: 'cached'               // 缓存数据
};

class SearchResultProcessor {
  constructor() {
    this.resultCache = new Map();
    this.processingRules = this.initializeProcessingRules();
  }

  /**
   * 初始化处理规则
   */
  initializeProcessingRules() {
    return {
      // 结果排序权重
      sortWeights: {
        [SEARCH_RESULT_TYPES.EXACT_MATCH]: 100,
        [SEARCH_RESULT_TYPES.CODE_MATCH]: 95,
        [SEARCH_RESULT_TYPES.NAME_MATCH]: 90,
        [SEARCH_RESULT_TYPES.CATEGORY_MATCH]: 70,
        [SEARCH_RESULT_TYPES.CONTENT_MATCH]: 60,
        [SEARCH_RESULT_TYPES.FUZZY_MATCH]: 50
      },

      // 数据质量权重
      qualityWeights: {
        [DATA_QUALITY_LEVELS.EXCELLENT]: 1.0,
        [DATA_QUALITY_LEVELS.GOOD]: 0.9,
        [DATA_QUALITY_LEVELS.FAIR]: 0.8,
        [DATA_QUALITY_LEVELS.POOR]: 0.6
      },

      // 数据源权重
      sourceWeights: {
        [DATA_SOURCE_TYPES.OFFICIAL]: 1.0,
        [DATA_SOURCE_TYPES.GOVERNMENT]: 0.95,
        [DATA_SOURCE_TYPES.COMMERCIAL]: 0.9,
        [DATA_SOURCE_TYPES.THIRD_PARTY]: 0.8,
        [DATA_SOURCE_TYPES.CACHED]: 0.7,
        [DATA_SOURCE_TYPES.LOCAL]: 0.6
      }
    };
  }

  /**
   * 处理搜索结果
   */
  processSearchResults(rawResults, searchKeyword, options = {}) {
    const {
      maxResults = 50,
      enableGrouping = true,
      enableScoring = true,
      enableFiltering = true
    } = options;

    console.log(`🔍 处理搜索结果: ${rawResults.length} 条原始结果`);

    // 1. 标准化结果格式
    let processedResults = this.normalizeResults(rawResults);

    // 2. 确定匹配类型和评分
    if (enableScoring) {
      processedResults = this.scoreResults(processedResults, searchKeyword);
    }

    // 3. 过滤和去重
    if (enableFiltering) {
      processedResults = this.filterAndDeduplicate(processedResults);
    }

    // 4. 排序
    processedResults = this.sortResults(processedResults);

    // 5. 分组（如果启用）
    if (enableGrouping) {
      processedResults = this.groupResults(processedResults);
    }

    // 6. 限制结果数量
    processedResults = processedResults.slice(0, maxResults);

    // 7. 增强显示信息
    processedResults = this.enhanceDisplayInfo(processedResults);

    console.log(`✅ 搜索结果处理完成: ${processedResults.length} 条结果`);

    return {
      results: processedResults,
      metadata: {
        totalProcessed: rawResults.length,
        totalReturned: processedResults.length,
        processingTime: Date.now(),
        searchKeyword,
        hasMoreResults: rawResults.length > maxResults
      }
    };
  }

  /**
   * 标准化结果格式
   */
  normalizeResults(rawResults) {
    return rawResults.map(item => {
      const normalized = {
        // 基础字段
        id: item.id || item.code || item.anzscoCode,
        code: item.code || item.anzscoCode,
        anzscoCode: item.anzscoCode || item.code,
        englishName: item.englishName || item.title || item.name,
        chineseName: item.chineseName || this.translateToChinese(item.englishName),
        
        // 分类和等级
        category: item.category || this.inferCategory(item.anzscoCode || item.code),
        skillLevel: item.skillLevel || this.inferSkillLevel(item.anzscoCode || item.code),
        
        // 详细信息
        description: item.description || '',
        tasks: item.tasks || [],
        requirements: item.requirements || [],
        
        // 签证和评估
        visaSubclasses: this.normalizeVisaSubclasses(item.visaSubclasses || item.visas),
        assessmentAuthority: item.assessmentAuthority || this.inferAssessmentAuthority(item.category),
        
        // 职业列表状态
        mltssl: item.mltssl || false,
        stsol: item.stsol || false,
        rol: item.rol || false,
        
        // 薪资信息
        averageSalary: item.averageSalary || item.salary,
        
        // 邀请数据
        invitationData: item.invitationData || this.extractInvitationData(item),
        
        // 数据质量和来源
        dataQuality: item.dataQuality || this.assessDataQuality(item),
        dataSources: item.dataSources || this.inferDataSources(item),
        lastUpdated: item.lastUpdated || item.updatedAt || new Date().toISOString(),
        
        // 原始数据（用于调试）
        _raw: item
      };

      // 确保必需字段存在
      if (!normalized.englishName || !normalized.anzscoCode) {
        console.warn('结果缺少必需字段:', normalized);
        return null;
      }

      return normalized;
    }).filter(Boolean);
  }

  /**
   * 对结果进行评分
   */
  scoreResults(results, searchKeyword) {
    const keyword = searchKeyword.toLowerCase().trim();
    
    return results.map(item => {
      let score = 0;
      let matchType = SEARCH_RESULT_TYPES.FUZZY_MATCH;

      // 1. 匹配类型评分
      if (item.anzscoCode === keyword || item.code === keyword) {
        score = 100;
        matchType = SEARCH_RESULT_TYPES.EXACT_MATCH;
      } else if (item.anzscoCode?.includes(keyword) || item.code?.includes(keyword)) {
        score = 95;
        matchType = SEARCH_RESULT_TYPES.CODE_MATCH;
      } else if (item.englishName?.toLowerCase() === keyword) {
        score = 90;
        matchType = SEARCH_RESULT_TYPES.NAME_MATCH;
      } else if (item.englishName?.toLowerCase().includes(keyword)) {
        score = 85;
        matchType = SEARCH_RESULT_TYPES.NAME_MATCH;
      } else if (item.chineseName?.includes(searchKeyword.trim())) {
        score = 80;
        matchType = SEARCH_RESULT_TYPES.NAME_MATCH;
      } else if (item.category?.toLowerCase().includes(keyword)) {
        score = 70;
        matchType = SEARCH_RESULT_TYPES.CATEGORY_MATCH;
      } else if (this.searchInContent(item, keyword)) {
        score = 60;
        matchType = SEARCH_RESULT_TYPES.CONTENT_MATCH;
      } else {
        score = 50;
        matchType = SEARCH_RESULT_TYPES.FUZZY_MATCH;
      }

      // 2. 数据质量调整
      const qualityLevel = this.getQualityLevel(item.dataQuality);
      const qualityWeight = this.processingRules.qualityWeights[qualityLevel] || 0.8;
      score *= qualityWeight;

      // 3. 数据源调整
      const sourceType = this.getSourceType(item.dataSources);
      const sourceWeight = this.processingRules.sourceWeights[sourceType] || 0.8;
      score *= sourceWeight;

      // 4. 新鲜度调整
      const freshnessWeight = this.getFreshnessWeight(item.lastUpdated);
      score *= freshnessWeight;

      return {
        ...item,
        score: Math.round(score),
        matchType,
        displayScore: Math.round(score)
      };
    });
  }

  /**
   * 在内容中搜索关键词
   */
  searchInContent(item, keyword) {
    const searchableText = [
      item.description,
      ...(item.tasks || []),
      ...(item.requirements || []),
      item.assessmentAuthority
    ].filter(Boolean).join(' ').toLowerCase();

    return searchableText.includes(keyword);
  }

  /**
   * 过滤和去重
   */
  filterAndDeduplicate(results) {
    const seen = new Set();
    const filtered = [];

    for (const item of results) {
      const key = item.anzscoCode || item.code;
      
      if (seen.has(key)) {
        // 如果已存在，保留评分更高的
        const existingIndex = filtered.findIndex(existing => 
          (existing.anzscoCode || existing.code) === key
        );
        
        if (existingIndex >= 0 && item.score > filtered[existingIndex].score) {
          filtered[existingIndex] = item;
        }
      } else {
        seen.add(key);
        filtered.push(item);
      }
    }

    return filtered;
  }

  /**
   * 排序结果
   */
  sortResults(results) {
    return results.sort((a, b) => {
      // 首先按评分排序
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // 评分相同时按匹配类型排序
      const aWeight = this.processingRules.sortWeights[a.matchType] || 0;
      const bWeight = this.processingRules.sortWeights[b.matchType] || 0;
      
      if (bWeight !== aWeight) {
        return bWeight - aWeight;
      }

      // 最后按职业代码排序
      return (a.anzscoCode || '').localeCompare(b.anzscoCode || '');
    });
  }

  /**
   * 分组结果
   */
  groupResults(results) {
    const groups = {
      exactMatches: [],
      nameMatches: [],
      categoryMatches: [],
      contentMatches: [],
      others: []
    };

    results.forEach(item => {
      switch (item.matchType) {
        case SEARCH_RESULT_TYPES.EXACT_MATCH:
        case SEARCH_RESULT_TYPES.CODE_MATCH:
          groups.exactMatches.push(item);
          break;
        case SEARCH_RESULT_TYPES.NAME_MATCH:
          groups.nameMatches.push(item);
          break;
        case SEARCH_RESULT_TYPES.CATEGORY_MATCH:
          groups.categoryMatches.push(item);
          break;
        case SEARCH_RESULT_TYPES.CONTENT_MATCH:
          groups.contentMatches.push(item);
          break;
        default:
          groups.others.push(item);
      }
    });

    // 重新组合，保持排序
    return [
      ...groups.exactMatches,
      ...groups.nameMatches,
      ...groups.categoryMatches,
      ...groups.contentMatches,
      ...groups.others
    ];
  }

  /**
   * 增强显示信息
   */
  enhanceDisplayInfo(results) {
    return results.map(item => ({
      ...item,
      displayInfo: {
        matchTypeText: this.getMatchTypeText(item.matchType),
        matchTypeIcon: this.getMatchTypeIcon(item.matchType),
        qualityText: this.getQualityText(item.dataQuality),
        qualityIcon: this.getQualityIcon(item.dataQuality),
        sourceText: this.getSourceText(item.dataSources),
        sourceIcon: this.getSourceIcon(item.dataSources),
        freshnessText: this.getFreshnessText(item.lastUpdated),
        freshnessIcon: this.getFreshnessIcon(item.lastUpdated)
      }
    }));
  }

  // 辅助方法
  translateToChinese(englishName) {
    const translations = {
      'Software Engineer': '软件工程师',
      'Developer Programmer': '开发程序员',
      'Analyst Programmer': '分析程序员',
      'Computer Network and Systems Engineer': '计算机网络和系统工程师',
      'ICT Security Specialist': 'ICT安全专家',
      'Civil Engineer': '土木工程师',
      'Mechanical Engineer': '机械工程师',
      'Registered Nurse': '注册护士',
      'Accountant (General)': '会计师(一般)',
      'Secondary School Teacher': '中学教师'
    };
    
    return translations[englishName] || englishName;
  }

  inferCategory(anzscoCode) {
    if (!anzscoCode) return 'Other';
    
    const code = anzscoCode.toString();
    const categoryMap = {
      '13': 'Management',
      '21': 'Finance',
      '22': 'Finance', 
      '24': 'Education',
      '25': 'Healthcare',
      '26': 'ICT',
      '27': 'Social Work',
      '23': 'Engineering'
    };
    
    const prefix = code.substring(0, 2);
    return categoryMap[prefix] || 'Other';
  }

  inferSkillLevel(anzscoCode) {
    if (!anzscoCode) return 1;
    
    const code = anzscoCode.toString();
    if (code.startsWith('1') || code.startsWith('2')) return 1;
    if (code.startsWith('3')) return 2;
    if (code.startsWith('4')) return 3;
    if (code.startsWith('5')) return 4;
    return 1;
  }

  normalizeVisaSubclasses(visas) {
    if (!visas) return ['189', '190', '491'];
    if (Array.isArray(visas)) return visas;
    if (typeof visas === 'string') {
      return visas.split(',').map(v => v.trim()).filter(Boolean);
    }
    return ['189', '190', '491'];
  }

  inferAssessmentAuthority(category) {
    const authorityMap = {
      'ICT': 'ACS',
      'Engineering': 'Engineers Australia',
      'Healthcare': 'ANMAC',
      'Management': 'VETASSESS',
      'Finance': 'CPA Australia',
      'Education': 'AITSL',
      'Social Work': 'AASW'
    };
    
    return authorityMap[category] || 'VETASSESS';
  }

  extractInvitationData(item) {
    return {
      lastRound: item.lastRound || item.lastInvitationRound,
      minPoints: item.minPoints || item.minimumPoints || 65,
      invitationCount: item.invitations || item.invitationsIssued || 0
    };
  }

  assessDataQuality(item) {
    let score = 50; // 基础分数
    
    // 根据字段完整性评分
    const requiredFields = ['englishName', 'anzscoCode', 'category'];
    const optionalFields = ['description', 'tasks', 'requirements', 'visaSubclasses'];
    
    requiredFields.forEach(field => {
      if (item[field]) score += 15;
    });
    
    optionalFields.forEach(field => {
      if (item[field] && (Array.isArray(item[field]) ? item[field].length > 0 : true)) {
        score += 5;
      }
    });
    
    return Math.min(score, 100);
  }

  inferDataSources(item) {
    if (item.source) return [item.source];
    if (item._raw && item._raw.source) return [item._raw.source];
    return ['LOCAL'];
  }

  getQualityLevel(quality) {
    const score = typeof quality === 'object' ? quality.score : quality;
    if (score >= 90) return DATA_QUALITY_LEVELS.EXCELLENT;
    if (score >= 75) return DATA_QUALITY_LEVELS.GOOD;
    if (score >= 60) return DATA_QUALITY_LEVELS.FAIR;
    return DATA_QUALITY_LEVELS.POOR;
  }

  getSourceType(sources) {
    if (!sources || sources.length === 0) return DATA_SOURCE_TYPES.LOCAL;
    
    const source = sources[0];
    if (source.includes('SKILLSELECT') || source.includes('IMMIGRATION')) {
      return DATA_SOURCE_TYPES.OFFICIAL;
    }
    if (source.includes('GOV') || source.includes('ABS')) {
      return DATA_SOURCE_TYPES.GOVERNMENT;
    }
    if (source.includes('COMMERCIAL')) {
      return DATA_SOURCE_TYPES.COMMERCIAL;
    }
    if (source.includes('CACHED')) {
      return DATA_SOURCE_TYPES.CACHED;
    }
    return DATA_SOURCE_TYPES.LOCAL;
  }

  getFreshnessWeight(lastUpdated) {
    if (!lastUpdated) return 0.8;
    
    const age = Date.now() - new Date(lastUpdated).getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (age <= oneDayMs) return 1.0;
    if (age <= 7 * oneDayMs) return 0.95;
    if (age <= 30 * oneDayMs) return 0.9;
    return 0.8;
  }

  getMatchTypeText(matchType) {
    const texts = {
      [SEARCH_RESULT_TYPES.EXACT_MATCH]: 'Exact Match',
      [SEARCH_RESULT_TYPES.CODE_MATCH]: 'Code Match',
      [SEARCH_RESULT_TYPES.NAME_MATCH]: 'Name Match',
      [SEARCH_RESULT_TYPES.CATEGORY_MATCH]: 'Category Match',
      [SEARCH_RESULT_TYPES.CONTENT_MATCH]: 'Content Match',
      [SEARCH_RESULT_TYPES.FUZZY_MATCH]: 'Related'
    };
    return texts[matchType] || 'Match';
  }

  getMatchTypeIcon(matchType) {
    const icons = {
      [SEARCH_RESULT_TYPES.EXACT_MATCH]: '🎯',
      [SEARCH_RESULT_TYPES.CODE_MATCH]: '🔢',
      [SEARCH_RESULT_TYPES.NAME_MATCH]: '📝',
      [SEARCH_RESULT_TYPES.CATEGORY_MATCH]: '📁',
      [SEARCH_RESULT_TYPES.CONTENT_MATCH]: '🔍',
      [SEARCH_RESULT_TYPES.FUZZY_MATCH]: '💭'
    };
    return icons[matchType] || '🔍';
  }

  getQualityText(quality) {
    const level = this.getQualityLevel(quality);
    const texts = {
      [DATA_QUALITY_LEVELS.EXCELLENT]: 'Excellent',
      [DATA_QUALITY_LEVELS.GOOD]: 'Good',
      [DATA_QUALITY_LEVELS.FAIR]: 'Fair',
      [DATA_QUALITY_LEVELS.POOR]: 'Poor'
    };
    return texts[level] || 'Unknown';
  }

  getQualityIcon(quality) {
    const level = this.getQualityLevel(quality);
    const icons = {
      [DATA_QUALITY_LEVELS.EXCELLENT]: '⭐',
      [DATA_QUALITY_LEVELS.GOOD]: '✨',
      [DATA_QUALITY_LEVELS.FAIR]: '💫',
      [DATA_QUALITY_LEVELS.POOR]: '⚡'
    };
    return icons[level] || '❓';
  }

  getSourceText(sources) {
    const type = this.getSourceType(sources);
    const texts = {
      [DATA_SOURCE_TYPES.OFFICIAL]: 'Official',
      [DATA_SOURCE_TYPES.GOVERNMENT]: 'Government',
      [DATA_SOURCE_TYPES.COMMERCIAL]: 'Commercial',
      [DATA_SOURCE_TYPES.THIRD_PARTY]: 'Third Party',
      [DATA_SOURCE_TYPES.CACHED]: 'Cached',
      [DATA_SOURCE_TYPES.LOCAL]: 'Local'
    };
    return texts[type] || 'Unknown';
  }

  getSourceIcon(sources) {
    const type = this.getSourceType(sources);
    const icons = {
      [DATA_SOURCE_TYPES.OFFICIAL]: '🏛️',
      [DATA_SOURCE_TYPES.GOVERNMENT]: '🏢',
      [DATA_SOURCE_TYPES.COMMERCIAL]: '💼',
      [DATA_SOURCE_TYPES.THIRD_PARTY]: '🌐',
      [DATA_SOURCE_TYPES.CACHED]: '📦',
      [DATA_SOURCE_TYPES.LOCAL]: '💾'
    };
    return icons[type] || '❓';
  }

  getFreshnessText(lastUpdated) {
    if (!lastUpdated) return 'Unknown';
    
    const age = Date.now() - new Date(lastUpdated).getTime();
    const minutes = Math.floor(age / (60 * 1000));
    const hours = Math.floor(age / (60 * 60 * 1000));
    const days = Math.floor(age / (24 * 60 * 60 * 1000));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  getFreshnessIcon(lastUpdated) {
    if (!lastUpdated) return '❓';
    
    const age = Date.now() - new Date(lastUpdated).getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (age <= oneDayMs) return '🟢';
    if (age <= 7 * oneDayMs) return '🟡';
    if (age <= 30 * oneDayMs) return '🟠';
    return '🔴';
  }
}

// 创建全局实例
const searchResultProcessor = new SearchResultProcessor();

export default searchResultProcessor;

// 导出主要方法
export const {
  processSearchResults
} = searchResultProcessor;




