// 商业级搜索配置文件
// 统一管理搜索相关的配置参数和环境变量

// 环境配置
const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TESTING: 'testing'
};

// 当前环境（可以通过构建工具或环境变量设置）
const CURRENT_ENV = ENV.PRODUCTION; // 默认生产环境

// API配置
export const API_CONFIG = {
  // 官方数据源配置
  DATA_SOURCES: {
    AUSTRALIA_IMMIGRATION: {
      name: 'Australia Immigration',
      priority: 1,
      reliability: 100,
      endpoints: {
        SKILLSELECT_EOI: 'https://api.dynamic.reports.employment.gov.au/anonap/extensions/hSKLS02_SkillSelect_EOI_Data/hSKLS02_SkillSelect_EOI_Data.html',
        OCCUPATION_LIST: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list',
        INVITATION_ROUNDS: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skillselect',
        OCCUPATION_CEILINGS: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect/invitation-rounds'
      },
      timeout: 30000,
      retries: 3
    },
    
    AUSTRALIAN_BUREAU_STATISTICS: {
      name: 'Australian Bureau of Statistics',
      priority: 2,
      reliability: 95,
      endpoints: {
        ANZSCO_CLASSIFICATION: 'https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations',
        LABOUR_FORCE_STATS: 'https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia',
        EARNINGS_STATS: 'https://www.abs.gov.au/statistics/labour/earnings-and-work-hours/employee-earnings-and-hours-australia'
      },
      timeout: 25000,
      retries: 2
    },
    
    DATA_GOV_AU: {
      name: 'Australian Government Open Data',
      priority: 3,
      reliability: 90,
      endpoints: {
        BASE_URL: 'https://data.gov.au/api/3/action/',
        OCCUPATION_DATASETS: 'package_search?q=occupation+anzsco+skillselect',
        MIGRATION_DATASETS: 'package_search?q=migration+visa+statistics',
        EMPLOYMENT_DATASETS: 'package_search?q=employment+labour+market'
      },
      timeout: 20000,
      retries: 2
    },
    
    THIRD_PARTY_SOURCES: {
      name: 'Third Party Sources',
      priority: 4,
      reliability: 75,
      endpoints: {
        JOB_OUTLOOK: 'https://joboutlook.gov.au/api/occupations'
      },
      timeout: 15000,
      retries: 1
    }
  },
  
  // 请求配置
  REQUEST: {
    DEFAULT_TIMEOUT: 15000,
    MAX_CONCURRENT_REQUESTS: 5,
    RATE_LIMIT_PER_SECOND: 10,
    RATE_LIMIT_BURST: 20,
    USER_AGENT: 'Commercial-EOI-Search/2.0',
    DEFAULT_HEADERS: {
      'Accept': 'application/json, text/html',
      'Accept-Language': 'en-AU,en;q=0.9',
      'Cache-Control': 'no-cache'
    }
  },
  
  // 重试配置
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 10000,
    BACKOFF_MULTIPLIER: 2,
    RETRY_CONDITIONS: ['NETWORK_ERROR', 'TIMEOUT', 'SERVER_ERROR']
  },
  
  // 熔断器配置
  CIRCUIT_BREAKER: {
    FAILURE_THRESHOLD: 5,
    RECOVERY_TIMEOUT: 60000,
    MONITOR_WINDOW: 300000
  }
};

// 缓存配置
export const CACHE_CONFIG = {
  // 缓存策略
  STRATEGIES: {
    COMMERCIAL_DATA: {
      TTL: 24 * 60 * 60 * 1000,        // 24小时
      REFRESH_THRESHOLD: 0.8,           // 80%时间后开始预刷新
      MAX_SIZE: 50 * 1024 * 1024,       // 50MB
      COMPRESSION: true
    },
    
    SEARCH_INDEX: {
      TTL: 7 * 24 * 60 * 60 * 1000,     // 7天
      REFRESH_THRESHOLD: 0.9,
      MAX_SIZE: 20 * 1024 * 1024,       // 20MB
      COMPRESSION: true
    },
    
    SEARCH_RESULTS: {
      TTL: 60 * 60 * 1000,              // 1小时
      REFRESH_THRESHOLD: 0.5,
      MAX_SIZE: 10 * 1024 * 1024,       // 10MB
      COMPRESSION: false
    },
    
    SEARCH_HISTORY: {
      TTL: 30 * 24 * 60 * 60 * 1000,    // 30天
      MAX_ITEMS: 100,
      COMPRESSION: false
    }
  },
  
  // 缓存键前缀
  KEY_PREFIXES: {
    COMMERCIAL_DATA: 'commercial_data_',
    SEARCH_INDEX: 'search_index_',
    SEARCH_RESULTS: 'search_results_',
    SEARCH_HISTORY: 'search_history_',
    API_RESPONSE: 'api_response_',
    DATA_QUALITY: 'data_quality_'
  },
  
  // 清理配置
  CLEANUP: {
    INTERVAL: 30 * 60 * 1000,           // 30分钟清理一次
    MAX_CACHE_SIZE: 100 * 1024 * 1024,  // 总缓存限制100MB
    CLEANUP_RATIO: 0.2                   // 清理20%的过期项
  }
};

// 搜索配置
export const SEARCH_CONFIG = {
  // 搜索引擎配置
  ENGINE: {
    ALGORITHM: 'HYBRID',                 // HYBRID | FUZZY | EXACT
    MAX_RESULTS: 100,
    DEFAULT_RESULTS: 20,
    SEARCH_TIMEOUT: 5000,
    DEBOUNCE_DELAY: 300
  },
  
  // 搜索权重配置
  SCORING: {
    EXACT_MATCH: {
      CODE: 100,
      NAME: 95,
      CATEGORY: 85
    },
    
    PARTIAL_MATCH: {
      NAME_START: 90,
      NAME_CONTAIN: 80,
      DESCRIPTION: 70,
      TASKS: 60,
      REQUIREMENTS: 50
    },
    
    FUZZY_MATCH: {
      SIMILAR_NAME: 75,
      SIMILAR_CODE: 85,
      PHONETIC: 65
    },
    
    BOOST_FACTORS: {
      POPULAR_OCCUPATION: 1.2,
      RECENT_INVITATION: 1.15,
      HIGH_QUALITY_DATA: 1.1,
      MULTIPLE_SOURCES: 1.05
    }
  },
  
  // 搜索过滤器
  FILTERS: {
    CATEGORIES: [
      'All Categories',
      'ICT',
      'Engineering', 
      'Healthcare',
      'Management',
      'Finance',
      'Education',
      'Social Work',
      'Other'
    ],
    
    VISA_TYPES: [
      'All Visas',
      '189',
      '190',
      '191',
      '491',
      '482',
      '485',
      '494'
    ],
    
    SKILL_LEVELS: [
      'All Levels',
      'Level 1',
      'Level 2', 
      'Level 3',
      'Level 4',
      'Level 5'
    ],
    
    OCCUPATION_LISTS: [
      'All Lists',
      'MLTSSL',
      'STSOL',
      'ROL'
    ]
  },
  
  // 搜索建议配置
  SUGGESTIONS: {
    MAX_SUGGESTIONS: 8,
    MIN_QUERY_LENGTH: 2,
    SUGGESTION_TYPES: ['code', 'occupation', 'category', 'keyword'],
    ENABLE_AUTOCOMPLETE: true,
    ENABLE_SPELL_CHECK: true
  },
  
  // 搜索历史配置
  HISTORY: {
    MAX_ITEMS: 20,
    EXCLUDE_PATTERNS: ['^$', '^\\s*$', '^.{1}$'], // 排除空白和单字符
    SAVE_THRESHOLD: 1000,                          // 搜索时间超过1秒才保存
    AUTO_CLEANUP: true
  }
};

// 数据验证配置
export const VALIDATION_CONFIG = {
  // 验证规则
  RULES: {
    REQUIRED_FIELDS: [
      'code',
      'englishName',
      'category', 
      'anzscoCode'
    ],
    
    FIELD_FORMATS: {
      anzscoCode: /^\d{6}$/,
      code: /^\d{6}$/,
      englishName: /^[A-Za-z\s\(\)\-\/&,\.]{2,100}$/,
      category: /^[A-Za-z\s]{2,50}$/,
      skillLevel: /^[1-5]$/,
      visaSubclasses: /^(189|190|191|491|482|485|494|858|864)$/
    },
    
    VALUE_RANGES: {
      skillLevel: { min: 1, max: 5 },
      minPoints: { min: 0, max: 200 },
      invitationCount: { min: 0, max: 10000 }
    }
  },
  
  // 质量阈值
  QUALITY_THRESHOLDS: {
    EXCELLENT: 90,
    GOOD: 75,
    ACCEPTABLE: 60,
    POOR: 40
  },
  
  // 验证权重
  QUALITY_WEIGHTS: {
    COMPLETENESS: 0.3,
    ACCURACY: 0.25,
    CONSISTENCY: 0.2,
    FRESHNESS: 0.15,
    RELIABILITY: 0.1
  },
  
  // 异常检测配置
  ANOMALY_DETECTION: {
    ENABLE: true,
    SCORE_DEVIATION_THRESHOLD: 2,
    DUPLICATE_RATIO_THRESHOLD: 0.1,
    MISSING_FIELD_RATIO_THRESHOLD: 0.3
  },
  
  // 监控配置
  MONITORING: {
    INTERVAL: 60000,                    // 1分钟
    SAMPLE_SIZE: 10,
    ALERT_THRESHOLD: 70,
    ENABLE_ALERTS: true
  }
};

// UI配置
export const UI_CONFIG = {
  // 搜索框配置
  SEARCH_BOX: {
    PLACEHOLDER: 'Search occupations, codes, or keywords...',
    MAX_LENGTH: 100,
    ENABLE_VOICE_SEARCH: true,
    ENABLE_ADVANCED_SEARCH: true,
    SHOW_SEARCH_STATS: true,
    SHOW_DATA_STATUS: true
  },
  
  // 搜索结果配置
  SEARCH_RESULTS: {
    DEFAULT_VIEW: 'list',               // 'list' | 'grid'
    ITEMS_PER_PAGE: 20,
    ENABLE_INFINITE_SCROLL: true,
    SHOW_MATCH_SCORE: true,
    SHOW_DATA_QUALITY: true,
    ENABLE_BATCH_OPERATIONS: true
  },
  
  // 动画配置
  ANIMATIONS: {
    SEARCH_DELAY: 300,
    RESULT_FADE_IN: 200,
    STATUS_UPDATE: 500,
    LOADING_SPINNER: true,
    SKELETON_LOADING: true
  },
  
  // 主题配置
  THEME: {
    PRIMARY_COLOR: '#007AFF',
    SUCCESS_COLOR: '#28a745',
    WARNING_COLOR: '#ffc107',
    ERROR_COLOR: '#dc3545',
    INFO_COLOR: '#17a2b8',
    BORDER_RADIUS: 8,
    BOX_SHADOW: '0 2px 12px rgba(0, 0, 0, 0.1)'
  }
};

// 性能配置
export const PERFORMANCE_CONFIG = {
  // 渲染优化
  RENDERING: {
    VIRTUAL_SCROLLING: true,
    LAZY_LOADING: true,
    IMAGE_LAZY_LOADING: true,
    COMPONENT_CACHING: true
  },
  
  // 内存管理
  MEMORY: {
    MAX_SEARCH_RESULTS_CACHE: 50,
    MAX_COMPONENT_INSTANCES: 100,
    GARBAGE_COLLECTION_INTERVAL: 300000  // 5分钟
  },
  
  // 网络优化
  NETWORK: {
    REQUEST_POOLING: true,
    RESPONSE_COMPRESSION: true,
    CDN_OPTIMIZATION: true,
    PREFETCH_POPULAR_SEARCHES: true
  },
  
  // 监控配置
  MONITORING: {
    ENABLE_PERFORMANCE_TRACKING: true,
    TRACK_USER_INTERACTIONS: true,
    TRACK_SEARCH_PERFORMANCE: true,
    REPORT_INTERVAL: 600000             // 10分钟
  }
};

// 安全配置
export const SECURITY_CONFIG = {
  // 输入验证
  INPUT_VALIDATION: {
    MAX_QUERY_LENGTH: 200,
    ALLOWED_CHARACTERS: /^[A-Za-z0-9\s\-\(\)\&\/\.\,]*$/,
    XSS_PROTECTION: true,
    SQL_INJECTION_PROTECTION: true
  },
  
  // 请求限制
  RATE_LIMITING: {
    MAX_REQUESTS_PER_MINUTE: 100,
    MAX_CONCURRENT_REQUESTS: 10,
    BLOCK_DURATION: 300000              // 5分钟
  },
  
  // 数据保护
  DATA_PROTECTION: {
    ENCRYPT_SENSITIVE_CACHE: false,     // 当前数据为公开信息
    SECURE_STORAGE: true,
    DATA_RETENTION_DAYS: 30
  }
};

// 错误处理配置
export const ERROR_CONFIG = {
  // 错误类型
  ERROR_TYPES: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    API_ERROR: 'API_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    CACHE_ERROR: 'CACHE_ERROR',
    SEARCH_ERROR: 'SEARCH_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
  },
  
  // 错误处理策略
  HANDLING_STRATEGIES: {
    NETWORK_ERROR: 'RETRY_WITH_FALLBACK',
    API_ERROR: 'FALLBACK_TO_CACHE',
    VALIDATION_ERROR: 'SHOW_USER_MESSAGE',
    CACHE_ERROR: 'CONTINUE_WITHOUT_CACHE',
    SEARCH_ERROR: 'FALLBACK_TO_SIMPLE_SEARCH'
  },
  
  // 用户消息
  USER_MESSAGES: {
    NETWORK_ERROR: 'Network connection issue. Using cached data.',
    API_ERROR: 'Service temporarily unavailable. Using backup data.',
    SEARCH_ERROR: 'Search temporarily unavailable. Please try again.',
    DATA_QUALITY_LOW: 'Data quality is lower than usual.',
    FALLBACK_MODE: 'Using offline data. Some information may be outdated.'
  },
  
  // 错误报告
  REPORTING: {
    ENABLE_ERROR_REPORTING: CURRENT_ENV === ENV.PRODUCTION,
    REPORT_ENDPOINT: null,              // 可配置错误报告服务
    INCLUDE_STACK_TRACE: CURRENT_ENV !== ENV.PRODUCTION,
    BATCH_SIZE: 10,
    REPORT_INTERVAL: 300000             // 5分钟
  }
};

// 环境特定配置
export const ENVIRONMENT_CONFIG = {
  [ENV.DEVELOPMENT]: {
    DEBUG_MODE: true,
    VERBOSE_LOGGING: true,
    MOCK_DATA: false,
    API_TIMEOUT: 60000,
    CACHE_TTL_MULTIPLIER: 0.1,          // 开发时缓存时间缩短
    ENABLE_DEV_TOOLS: true
  },
  
  [ENV.TESTING]: {
    DEBUG_MODE: true,
    VERBOSE_LOGGING: false,
    MOCK_DATA: true,
    API_TIMEOUT: 10000,
    CACHE_TTL_MULTIPLIER: 0.01,         // 测试时缓存时间很短
    ENABLE_DEV_TOOLS: false
  },
  
  [ENV.PRODUCTION]: {
    DEBUG_MODE: false,
    VERBOSE_LOGGING: false,
    MOCK_DATA: false,
    API_TIMEOUT: 30000,
    CACHE_TTL_MULTIPLIER: 1,
    ENABLE_DEV_TOOLS: false
  }
};

// 获取当前环境配置
export const getCurrentConfig = () => {
  return ENVIRONMENT_CONFIG[CURRENT_ENV] || ENVIRONMENT_CONFIG[ENV.PRODUCTION];
};

// 获取完整配置
export const getFullConfig = () => {
  const envConfig = getCurrentConfig();
  
  return {
    environment: CURRENT_ENV,
    api: API_CONFIG,
    cache: CACHE_CONFIG,
    search: SEARCH_CONFIG,
    validation: VALIDATION_CONFIG,
    ui: UI_CONFIG,
    performance: PERFORMANCE_CONFIG,
    security: SECURITY_CONFIG,
    error: ERROR_CONFIG,
    ...envConfig
  };
};

// 配置验证函数
export const validateConfig = () => {
  const errors = [];
  
  // 验证API配置
  if (!API_CONFIG.DATA_SOURCES || Object.keys(API_CONFIG.DATA_SOURCES).length === 0) {
    errors.push('API_CONFIG.DATA_SOURCES is required');
  }
  
  // 验证缓存配置
  if (!CACHE_CONFIG.STRATEGIES) {
    errors.push('CACHE_CONFIG.STRATEGIES is required');
  }
  
  // 验证搜索配置
  if (!SEARCH_CONFIG.ENGINE) {
    errors.push('SEARCH_CONFIG.ENGINE is required');
  }
  
  if (errors.length > 0) {
    console.error('Configuration validation failed:', errors);
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }
  
  console.log('✅ Configuration validation passed');
  return true;
};

// 导出默认配置
export default {
  API_CONFIG,
  CACHE_CONFIG,
  SEARCH_CONFIG,
  VALIDATION_CONFIG,
  UI_CONFIG,
  PERFORMANCE_CONFIG,
  SECURITY_CONFIG,
  ERROR_CONFIG,
  getCurrentConfig,
  getFullConfig,
  validateConfig
};
