// 增强型API调用服务
// 提供高可用性、高性能的API调用机制，确保商业级应用的稳定性

import commercialDataService from './commercial-data-sources.js';

// API调用配置
const API_CONFIG = {
  // 重试配置
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 10000,
    BACKOFF_MULTIPLIER: 2
  },
  
  // 超时配置
  TIMEOUT: {
    DEFAULT: 15000,
    LONG_RUNNING: 30000,
    CRITICAL: 45000
  },
  
  // 并发控制
  CONCURRENCY: {
    MAX_PARALLEL_REQUESTS: 5,
    RATE_LIMIT_PER_SECOND: 10,
    BURST_LIMIT: 20
  },
  
  // 缓存配置
  CACHE: {
    DEFAULT_TTL: 24 * 60 * 60 * 1000,      // 24小时
    CRITICAL_TTL: 60 * 60 * 1000,          // 1小时
    LONG_TTL: 7 * 24 * 60 * 60 * 1000      // 7天
  }
};

// API健康状态
const API_HEALTH_STATUS = {
  HEALTHY: 'HEALTHY',
  DEGRADED: 'DEGRADED', 
  UNHEALTHY: 'UNHEALTHY',
  UNKNOWN: 'UNKNOWN'
};

class EnhancedAPIService {
  constructor() {
    this.requestQueue = [];
    this.activeRequests = new Map();
    this.rateLimitCounter = new Map();
    this.healthStatus = new Map();
    this.circuitBreakers = new Map();
    this.performanceMetrics = new Map();
    
    // 初始化速率限制重置定时器
    this.initRateLimitReset();
    
    // 初始化健康检查
    this.initHealthCheck();
  }

  /**
   * 商业级数据获取入口
   */
  async fetchCommercialData(options = {}) {
    const startTime = Date.now();
    
    try {
      console.log('🚀 开始商业级数据获取...');
      
      // 检查缓存
      const cachedData = this.getCachedData('commercial_data');
      if (cachedData && !options.forceRefresh) {
        console.log('✅ 使用缓存数据');
        this.recordMetrics('commercial_data', startTime, true);
        return cachedData;
      }

      // 获取高质量数据
      const result = await this.executeWithResilience(
        () => commercialDataService.fetchHighQualityData(),
        {
          operationName: 'fetchCommercialData',
          timeout: API_CONFIG.TIMEOUT.CRITICAL,
          retryConfig: API_CONFIG.RETRY
        }
      );

      // 缓存结果
      if (result && result.data && result.data.length > 0) {
        this.setCachedData('commercial_data', result, API_CONFIG.CACHE.DEFAULT_TTL);
        console.log(`✅ 成功获取并缓存 ${result.data.length} 条商业级数据`);
      }

      this.recordMetrics('commercial_data', startTime, false);
      return result;

    } catch (error) {
      console.error('❌ 商业级数据获取失败:', error);
      this.recordMetrics('commercial_data', startTime, false, error);
      
      // 尝试返回降级数据
      return await this.getFallbackData();
    }
  }

  /**
   * 弹性执行机制
   */
  async executeWithResilience(operation, options = {}) {
    const {
      operationName = 'unknown',
      timeout = API_CONFIG.TIMEOUT.DEFAULT,
      retryConfig = API_CONFIG.RETRY
    } = options;

    // 检查熔断器
    if (this.isCircuitBreakerOpen(operationName)) {
      throw new Error(`Circuit breaker is open for operation: ${operationName}`);
    }

    let lastError;
    
    for (let attempt = 1; attempt <= retryConfig.MAX_ATTEMPTS; attempt++) {
      try {
        // 执行操作
        const result = await Promise.race([
          operation(),
          this.createTimeoutPromise(timeout)
        ]);

        // 成功时重置熔断器
        this.recordSuccess(operationName);
        return result;

      } catch (error) {
        lastError = error;
        console.warn(`⚠️ 操作 ${operationName} 第 ${attempt} 次尝试失败:`, error.message);

        // 记录失败
        this.recordFailure(operationName);

        // 如果还有重试机会，等待后重试
        if (attempt < retryConfig.MAX_ATTEMPTS) {
          const delay = Math.min(
            retryConfig.INITIAL_DELAY * Math.pow(retryConfig.BACKOFF_MULTIPLIER, attempt - 1),
            retryConfig.MAX_DELAY
          );
          
          console.log(`⏳ ${delay}ms 后进行第 ${attempt + 1} 次重试...`);
          await this.delay(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * 批量API调用
   */
  async batchRequest(requests, options = {}) {
    const {
      maxConcurrency = API_CONFIG.CONCURRENCY.MAX_PARALLEL_REQUESTS,
      timeout = API_CONFIG.TIMEOUT.DEFAULT
    } = options;

    console.log(`🔄 开始批量请求，共 ${requests.length} 个请求，最大并发: ${maxConcurrency}`);

    const results = [];
    const errors = [];

    // 分批处理请求
    for (let i = 0; i < requests.length; i += maxConcurrency) {
      const batch = requests.slice(i, i + maxConcurrency);
      
      const batchPromises = batch.map(async (request, index) => {
        try {
          // 检查速率限制
          await this.checkRateLimit(request.url || 'unknown');
          
          const result = await this.executeWithResilience(
            () => this.makeRequest(request),
            { 
              operationName: `batch_request_${i + index}`,
              timeout 
            }
          );
          
          results[i + index] = result;
        } catch (error) {
          errors[i + index] = error;
          console.error(`❌ 批量请求 ${i + index} 失败:`, error);
        }
      });

      await Promise.all(batchPromises);
      
      // 批次间延迟，避免过载
      if (i + maxConcurrency < requests.length) {
        await this.delay(100);
      }
    }

    console.log(`✅ 批量请求完成，成功: ${results.filter(Boolean).length}，失败: ${errors.filter(Boolean).length}`);

    return {
      results: results.filter(Boolean),
      errors: errors.filter(Boolean),
      total: requests.length,
      success: results.filter(Boolean).length,
      failed: errors.filter(Boolean).length
    };
  }

  /**
   * 智能数据刷新
   */
  async smartRefresh(dataType = 'all', options = {}) {
    const {
      priority = 'normal',
      background = false
    } = options;

    console.log(`🔄 开始智能数据刷新: ${dataType}, 优先级: ${priority}`);

    const refreshTasks = [];

    if (dataType === 'all' || dataType === 'commercial') {
      refreshTasks.push({
        name: 'commercial_data',
        operation: () => this.fetchCommercialData({ forceRefresh: true }),
        priority: 1
      });
    }

    if (dataType === 'all' || dataType === 'search_index') {
      refreshTasks.push({
        name: 'search_index',
        operation: () => this.rebuildSearchIndex(),
        priority: 2
      });
    }

    // 按优先级排序
    refreshTasks.sort((a, b) => a.priority - b.priority);

    const results = {};
    
    for (const task of refreshTasks) {
      try {
        console.log(`📊 刷新 ${task.name}...`);
        const result = await task.operation();
        results[task.name] = {
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        };
        
        // 后台模式下添加延迟
        if (background) {
          await this.delay(1000);
        }
        
      } catch (error) {
        console.error(`❌ 刷新 ${task.name} 失败:`, error);
        results[task.name] = {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }

    console.log('✅ 智能数据刷新完成');
    return results;
  }

  /**
   * 实时数据监控
   */
  async startRealTimeMonitoring() {
    console.log('📊 启动实时数据监控...');

    // 定期检查数据新鲜度
    setInterval(async () => {
      await this.checkDataFreshness();
    }, 60 * 60 * 1000); // 每小时检查一次

    // 定期健康检查
    setInterval(async () => {
      await this.performHealthCheck();
    }, 5 * 60 * 1000); // 每5分钟检查一次

    // 定期清理过期缓存
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 30 * 60 * 1000); // 每30分钟清理一次
  }

  /**
   * 检查数据新鲜度
   */
  async checkDataFreshness() {
    const cachedData = this.getCachedData('commercial_data');
    
    if (!cachedData) {
      console.log('⚠️ 无缓存数据，触发数据获取');
      await this.fetchCommercialData();
      return;
    }

    const lastUpdated = new Date(cachedData.metadata?.lastUpdated || 0);
    const now = new Date();
    const age = now - lastUpdated;

    if (age > API_CONFIG.CACHE.DEFAULT_TTL) {
      console.log('⚠️ 数据过期，触发后台刷新');
      this.smartRefresh('commercial', { background: true });
    } else if (age > API_CONFIG.CACHE.DEFAULT_TTL * 0.8) {
      console.log('⚠️ 数据即将过期，准备预刷新');
      // 可以在这里触发预刷新逻辑
    }
  }

  /**
   * 执行健康检查
   */
  async performHealthCheck() {
    const endpoints = [
      'https://api.dynamic.reports.employment.gov.au',
      'https://data.gov.au/api/3/action',
      'https://www.abs.gov.au'
    ];

    const healthResults = {};

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        
        const response = await Promise.race([
          uni.request({
            url: endpoint,
            method: 'HEAD',
            timeout: 5000
          }),
          this.createTimeoutPromise(5000)
        ]);

        const responseTime = Date.now() - startTime;
        
        healthResults[endpoint] = {
          status: API_HEALTH_STATUS.HEALTHY,
          responseTime,
          timestamp: new Date().toISOString()
        };

        this.healthStatus.set(endpoint, healthResults[endpoint]);

      } catch (error) {
        healthResults[endpoint] = {
          status: API_HEALTH_STATUS.UNHEALTHY,
          error: error.message,
          timestamp: new Date().toISOString()
        };

        this.healthStatus.set(endpoint, healthResults[endpoint]);
      }
    }

    // 更新整体健康状态
    this.updateOverallHealth(healthResults);
    
    return healthResults;
  }

  /**
   * 获取降级数据
   */
  async getFallbackData() {
    console.log('🔄 获取降级数据...');

    // 尝试获取本地缓存（即使过期）
    const expiredCache = this.getCachedData('commercial_data', true);
    if (expiredCache) {
      console.log('📦 使用过期缓存作为降级数据');
      return {
        ...expiredCache,
        metadata: {
          ...expiredCache.metadata,
          fallbackMode: true,
          fallbackReason: 'API_UNAVAILABLE'
        }
      };
    }

    // 使用静态备份数据
    console.log('📋 使用静态备份数据');
    const { occupationsData } = await import('../data/occupations.js');
    
    return {
      data: occupationsData,
      sources: [{ name: 'LOCAL_BACKUP', recordCount: occupationsData.length }],
      quality: { score: 60, freshness: 30, completeness: 80, accuracy: 70 },
      metadata: {
        totalRecords: occupationsData.length,
        lastUpdated: new Date().toISOString(),
        dataSources: ['LOCAL_BACKUP'],
        fallbackMode: true,
        fallbackReason: 'ALL_SOURCES_FAILED'
      }
    };
  }

  /**
   * 重建搜索索引
   */
  async rebuildSearchIndex() {
    console.log('🔍 重建搜索索引...');
    
    const commercialData = await this.fetchCommercialData();
    if (!commercialData || !commercialData.data) {
      throw new Error('无法获取数据来重建索引');
    }

    // 构建搜索索引
    const searchIndex = {
      byCode: new Map(),
      byName: new Map(),
      byCategory: new Map(),
      byKeyword: new Map(),
      fullText: []
    };

    for (const item of commercialData.data) {
      // 按代码索引
      if (item.code) {
        searchIndex.byCode.set(item.code.toLowerCase(), item);
      }
      if (item.anzscoCode) {
        searchIndex.byCode.set(item.anzscoCode.toLowerCase(), item);
      }

      // 按名称索引
      if (item.englishName) {
        const nameKey = item.englishName.toLowerCase();
        if (!searchIndex.byName.has(nameKey)) {
          searchIndex.byName.set(nameKey, []);
        }
        searchIndex.byName.get(nameKey).push(item);
      }
      
      if (item.chineseName) {
        const nameKey = item.chineseName.toLowerCase();
        if (!searchIndex.byName.has(nameKey)) {
          searchIndex.byName.set(nameKey, []);
        }
        searchIndex.byName.get(nameKey).push(item);
      }

      // 按类别索引
      if (item.category) {
        const categoryKey = item.category.toLowerCase();
        if (!searchIndex.byCategory.has(categoryKey)) {
          searchIndex.byCategory.set(categoryKey, []);
        }
        searchIndex.byCategory.get(categoryKey).push(item);
      }

      // 全文搜索索引
      const searchableText = [
        item.code,
        item.anzscoCode,
        item.englishName,
        item.chineseName,
        item.category,
        item.description,
        ...(item.tasks || []),
        ...(item.requirements || [])
      ].filter(Boolean).join(' ').toLowerCase();

      searchIndex.fullText.push({
        item,
        searchableText,
        keywords: this.extractKeywords(searchableText)
      });
    }

    // 缓存搜索索引
    this.setCachedData('search_index', searchIndex, API_CONFIG.CACHE.LONG_TTL);
    
    console.log(`✅ 搜索索引重建完成，索引了 ${commercialData.data.length} 条记录`);
    return searchIndex;
  }

  /**
   * 提取关键词
   */
  extractKeywords(text) {
    return text
      .split(/\s+/)
      .filter(word => word.length > 2)
      .map(word => word.toLowerCase())
      .filter((word, index, array) => array.indexOf(word) === index)
      .slice(0, 20); // 限制关键词数量
  }

  /**
   * 速率限制检查
   */
  async checkRateLimit(endpoint) {
    const now = Date.now();
    const windowStart = Math.floor(now / 1000) * 1000; // 1秒窗口
    
    if (!this.rateLimitCounter.has(endpoint)) {
      this.rateLimitCounter.set(endpoint, new Map());
    }
    
    const endpointCounter = this.rateLimitCounter.get(endpoint);
    const currentCount = endpointCounter.get(windowStart) || 0;
    
    if (currentCount >= API_CONFIG.CONCURRENCY.RATE_LIMIT_PER_SECOND) {
      const delay = 1000 - (now % 1000) + 50; // 等待到下一秒
      console.log(`⏳ 速率限制，延迟 ${delay}ms`);
      await this.delay(delay);
    }
    
    endpointCounter.set(windowStart, currentCount + 1);
  }

  /**
   * 熔断器相关方法
   */
  isCircuitBreakerOpen(operationName) {
    const breaker = this.circuitBreakers.get(operationName);
    if (!breaker) return false;
    
    const now = Date.now();
    
    // 如果在半开状态且时间已过
    if (breaker.state === 'HALF_OPEN' && now > breaker.nextAttempt) {
      return false;
    }
    
    // 如果在开启状态且冷却时间已过
    if (breaker.state === 'OPEN' && now > breaker.nextAttempt) {
      breaker.state = 'HALF_OPEN';
      return false;
    }
    
    return breaker.state === 'OPEN';
  }

  recordSuccess(operationName) {
    const breaker = this.circuitBreakers.get(operationName);
    if (breaker) {
      breaker.failureCount = 0;
      breaker.state = 'CLOSED';
    }
  }

  recordFailure(operationName) {
    if (!this.circuitBreakers.has(operationName)) {
      this.circuitBreakers.set(operationName, {
        failureCount: 0,
        state: 'CLOSED',
        nextAttempt: 0
      });
    }
    
    const breaker = this.circuitBreakers.get(operationName);
    breaker.failureCount++;
    
    if (breaker.failureCount >= 5) {
      breaker.state = 'OPEN';
      breaker.nextAttempt = Date.now() + 60000; // 1分钟后重试
      console.warn(`🔴 熔断器开启: ${operationName}`);
    }
  }

  /**
   * 缓存相关方法
   */
  getCachedData(key, includeExpired = false) {
    try {
      const cached = uni.getStorageSync(`enhanced_cache_${key}`);
      if (!cached) return null;
      
      const now = Date.now();
      if (!includeExpired && cached.expiry && now > cached.expiry) {
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error('获取缓存失败:', error);
      return null;
    }
  }

  setCachedData(key, data, ttl = API_CONFIG.CACHE.DEFAULT_TTL) {
    try {
      const cacheItem = {
        data,
        expiry: Date.now() + ttl,
        created: Date.now()
      };
      
      uni.setStorageSync(`enhanced_cache_${key}`, cacheItem);
    } catch (error) {
      console.error('设置缓存失败:', error);
    }
  }

  cleanupExpiredCache() {
    try {
      const storageInfo = uni.getStorageInfoSync();
      const now = Date.now();
      let cleanedCount = 0;
      
      for (const key of storageInfo.keys) {
        if (key.startsWith('enhanced_cache_')) {
          try {
            const cached = uni.getStorageSync(key);
            if (cached && cached.expiry && now > cached.expiry) {
              uni.removeStorageSync(key);
              cleanedCount++;
            }
          } catch (error) {
            // 忽略单个缓存项的错误
          }
        }
      }
      
      if (cleanedCount > 0) {
        console.log(`🧹 清理了 ${cleanedCount} 个过期缓存项`);
      }
    } catch (error) {
      console.error('清理缓存失败:', error);
    }
  }

  /**
   * 工具方法
   */
  async makeRequest(request) {
    const response = await uni.request({
      url: request.url,
      method: request.method || 'GET',
      data: request.data,
      header: {
        'User-Agent': 'Commercial-EOI-App/2.0',
        'Accept': 'application/json',
        ...request.headers
      },
      timeout: request.timeout || API_CONFIG.TIMEOUT.DEFAULT
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data;
    } else {
      throw new Error(`HTTP ${response.statusCode}: ${response.errMsg}`);
    }
  }

  createTimeoutPromise(timeout) {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`操作超时: ${timeout}ms`));
      }, timeout);
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  recordMetrics(operation, startTime, fromCache, error = null) {
    const duration = Date.now() - startTime;
    
    if (!this.performanceMetrics.has(operation)) {
      this.performanceMetrics.set(operation, {
        totalRequests: 0,
        successCount: 0,
        errorCount: 0,
        cacheHits: 0,
        totalDuration: 0,
        avgDuration: 0
      });
    }
    
    const metrics = this.performanceMetrics.get(operation);
    metrics.totalRequests++;
    metrics.totalDuration += duration;
    metrics.avgDuration = metrics.totalDuration / metrics.totalRequests;
    
    if (fromCache) {
      metrics.cacheHits++;
    }
    
    if (error) {
      metrics.errorCount++;
    } else {
      metrics.successCount++;
    }
  }

  initRateLimitReset() {
    setInterval(() => {
      const now = Math.floor(Date.now() / 1000) * 1000;
      const cutoff = now - 5000; // 保留最近5秒的计数
      
      for (const [endpoint, counter] of this.rateLimitCounter) {
        for (const [timestamp] of counter) {
          if (timestamp < cutoff) {
            counter.delete(timestamp);
          }
        }
      }
    }, 5000);
  }

  initHealthCheck() {
    // 启动时执行一次健康检查
    setTimeout(() => {
      this.performHealthCheck();
    }, 1000);
  }

  updateOverallHealth(healthResults) {
    const healthyCount = Object.values(healthResults)
      .filter(result => result.status === API_HEALTH_STATUS.HEALTHY).length;
    
    const totalCount = Object.keys(healthResults).length;
    const healthyRatio = healthyCount / totalCount;
    
    let overallStatus;
    if (healthyRatio >= 0.8) {
      overallStatus = API_HEALTH_STATUS.HEALTHY;
    } else if (healthyRatio >= 0.5) {
      overallStatus = API_HEALTH_STATUS.DEGRADED;
    } else {
      overallStatus = API_HEALTH_STATUS.UNHEALTHY;
    }
    
    this.healthStatus.set('overall', {
      status: overallStatus,
      healthyRatio,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 获取性能指标
   */
  getPerformanceMetrics() {
    const metrics = {};
    for (const [operation, data] of this.performanceMetrics) {
      metrics[operation] = { ...data };
    }
    return metrics;
  }

  /**
   * 获取健康状态
   */
  getHealthStatus() {
    const health = {};
    for (const [endpoint, status] of this.healthStatus) {
      health[endpoint] = { ...status };
    }
    return health;
  }
}

// 创建增强型API服务实例
const enhancedAPIService = new EnhancedAPIService();

export default enhancedAPIService;

// 导出主要方法
export const {
  fetchCommercialData,
  batchRequest,
  smartRefresh,
  startRealTimeMonitoring,
  getPerformanceMetrics,
  getHealthStatus
} = enhancedAPIService;
