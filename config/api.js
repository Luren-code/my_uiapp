// API配置文件
// 职业数据后端接口配置

// API基础配置
export const API_CONFIG = {
  // 开发环境API地址
  DEV_BASE_URL: 'http://localhost:3000/api',
  
  // 生产环境API地址
  PROD_BASE_URL: 'https://your-api-domain.com/api',
  
  // 当前环境（开发/生产）
  ENVIRONMENT: 'development', // 'development' | 'production'
  
  // 请求超时时间（毫秒）
  TIMEOUT: 10000,
  
  // 请求重试次数
  RETRY_COUNT: 3
};

// 获取当前API基础URL
export const getBaseURL = () => {
  return API_CONFIG.ENVIRONMENT === 'production' 
    ? API_CONFIG.PROD_BASE_URL 
    : API_CONFIG.DEV_BASE_URL;
};

// API端点定义
export const API_ENDPOINTS = {
  // 职业相关接口
  OCCUPATIONS: {
    // 获取所有职业列表
    LIST: '/occupations',
    
    // 根据ID获取职业详情
    DETAIL: (id) => `/occupations/${id}`,
    
    // 搜索职业
    SEARCH: '/occupations/search',
    
    // 获取热门职业
    POPULAR: '/occupations/popular',
    
    // 根据分类获取职业
    BY_CATEGORY: (category) => `/occupations/category/${category}`,
    
    // 获取相关职业
    RELATED: (id) => `/occupations/${id}/related`
  },
  
  // 用户相关接口
  USER: {
    // 获取用户收藏
    FAVORITES: '/user/favorites',
    
    // 添加收藏
    ADD_FAVORITE: '/user/favorites',
    
    // 删除收藏
    REMOVE_FAVORITE: (id) => `/user/favorites/${id}`,
    
    // 获取搜索历史
    SEARCH_HISTORY: '/user/search-history'
  },
  
  // 统计数据接口
  STATISTICS: {
    // 获取就业统计数据
    EMPLOYMENT: (occupationId) => `/statistics/employment/${occupationId}`,
    
    // 获取薪资统计数据
    SALARY: (occupationId) => `/statistics/salary/${occupationId}`,
    
    // 获取趋势数据
    TRENDS: (occupationId) => `/statistics/trends/${occupationId}`
  }
};

// 通用请求方法
export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    data = null,
    headers = {},
    timeout = API_CONFIG.TIMEOUT,
    retryCount = 0
  } = options;

  const url = `${getBaseURL()}${endpoint}`;
  
  const requestOptions = {
    url,
    method,
    timeout,
    header: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    requestOptions.data = data;
  }

  try {
    console.log(`🌐 API请求: ${method} ${url}`, data || '');
    
    const response = await uni.request(requestOptions);
    
    console.log(`✅ API响应: ${method} ${url}`, response.data);
    
    // 检查响应状态
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return {
        success: true,
        data: response.data,
        statusCode: response.statusCode
      };
    } else {
      throw new Error(`HTTP ${response.statusCode}: ${response.data?.message || 'Request failed'}`);
    }
    
  } catch (error) {
    console.error(`❌ API请求失败: ${method} ${url}`, error);
    
    // 重试逻辑
    if (retryCount < API_CONFIG.RETRY_COUNT) {
      console.log(`🔄 重试请求 (${retryCount + 1}/${API_CONFIG.RETRY_COUNT}): ${method} ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // 递增延迟
      return apiRequest(endpoint, { ...options, retryCount: retryCount + 1 });
    }
    
    return {
      success: false,
      error: error.message || 'Network request failed',
      statusCode: error.statusCode || 0
    };
  }
};

// 职业数据API方法
export const occupationAPI = {
  // 获取职业列表
  async getList(params = {}) {
    const queryString = Object.keys(params).length > 0 
      ? '?' + Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
      : '';
    
    return apiRequest(`${API_ENDPOINTS.OCCUPATIONS.LIST}${queryString}`);
  },

  // 获取职业详情
  async getDetail(occupationId) {
    return apiRequest(API_ENDPOINTS.OCCUPATIONS.DETAIL(occupationId));
  },

  // 搜索职业
  async search(keyword, filters = {}) {
    return apiRequest(API_ENDPOINTS.OCCUPATIONS.SEARCH, {
      method: 'POST',
      data: { keyword, filters }
    });
  },

  // 获取热门职业
  async getPopular() {
    return apiRequest(API_ENDPOINTS.OCCUPATIONS.POPULAR);
  },

  // 根据分类获取职业
  async getByCategory(category) {
    return apiRequest(API_ENDPOINTS.OCCUPATIONS.BY_CATEGORY(category));
  },

  // 获取相关职业
  async getRelated(occupationId) {
    return apiRequest(API_ENDPOINTS.OCCUPATIONS.RELATED(occupationId));
  }
};

// 用户数据API方法
export const userAPI = {
  // 获取用户收藏
  async getFavorites() {
    return apiRequest(API_ENDPOINTS.USER.FAVORITES);
  },

  // 添加收藏
  async addFavorite(occupationData) {
    return apiRequest(API_ENDPOINTS.USER.ADD_FAVORITE, {
      method: 'POST',
      data: occupationData
    });
  },

  // 删除收藏
  async removeFavorite(occupationId) {
    return apiRequest(API_ENDPOINTS.USER.REMOVE_FAVORITE(occupationId), {
      method: 'DELETE'
    });
  },

  // 获取搜索历史
  async getSearchHistory() {
    return apiRequest(API_ENDPOINTS.USER.SEARCH_HISTORY);
  }
};

// 统计数据API方法
export const statisticsAPI = {
  // 获取就业统计数据
  async getEmploymentStats(occupationId) {
    return apiRequest(API_ENDPOINTS.STATISTICS.EMPLOYMENT(occupationId));
  },

  // 获取薪资统计数据
  async getSalaryStats(occupationId) {
    return apiRequest(API_ENDPOINTS.STATISTICS.SALARY(occupationId));
  },

  // 获取趋势数据
  async getTrends(occupationId) {
    return apiRequest(API_ENDPOINTS.STATISTICS.TRENDS(occupationId));
  }
};

// 导出所有API方法
export default {
  occupation: occupationAPI,
  user: userAPI,
  statistics: statisticsAPI,
  request: apiRequest,
  config: API_CONFIG,
  endpoints: API_ENDPOINTS
};
