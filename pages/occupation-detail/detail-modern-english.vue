<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-left" @click="goBack">
        <uv-icon name="arrow-left" color="#fff" size="20"></uv-icon>
      </view>
      <text class="header-title">Occupation Details</text>
      <view class="header-right">
        <uv-icon name="heart" color="#fff" size="20" @click="toggleFavorite"></uv-icon>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <uv-loading-icon mode="circle" color="#4A90E2" size="40"></uv-loading-icon>
      <text class="loading-text">Loading occupation details...</text>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="error-container">
      <uv-icon name="warning" color="#ff6b6b" size="60"></uv-icon>
      <text class="error-text">{{ error }}</text>
      <button class="retry-btn" @click="loadOccupationData">Retry</button>
    </view>

    <!-- 主要内容区域 -->
    <view v-else class="content">
      <!-- 职业基本信息卡片 -->
      <view class="occupation-hero-card">
        <view class="hero-background"></view>
        <view class="hero-content">
          <view class="occupation-badges">
            <view class="code-badge">{{ occupation.code }}</view>
            <view class="category-badge">{{ occupation.category }}</view>
            <view class="popularity-badge" v-if="occupation.isPopular">
              <uv-icon name="fire" color="#fff" size="12"></uv-icon>
              <text class="badge-text">Popular</text>
            </view>
        </view>
        <text class="occupation-english">{{ occupation.englishName }}</text>
        <text class="occupation-chinese">{{ occupation.chineseName }}</text>
          
          <!-- 快速信息指标 -->
          <view class="quick-stats">
            <view class="stat-item">
              <text class="stat-label">Skill Level</text>
              <text class="stat-value">{{ getSkillLevel(occupation) }}</text>
            </view>
            <view class="stat-item">
              <text class="stat-label">Assessment</text>
              <text class="stat-value">{{ getAssessmentAuthority(occupation) }}</text>
            </view>
            <view class="stat-item" v-if="occupation.averageSalary">
              <text class="stat-label">Avg Salary</text>
              <text class="stat-value">{{ occupation.averageSalary }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 详细信息卡片组 -->
      <view class="info-cards-grid">
        <!-- 基本信息卡片 -->
        <uv-card class="info-card" :show-head="true" head-text="Basic Information" head-style="font-weight: bold; color: #333;">
          <view class="card-content">
            <view class="info-row">
              <view class="info-item">
                <uv-icon name="code" color="#4A90E2" size="16"></uv-icon>
                <text class="info-label">ANZSCO Code</text>
                <text class="info-value">{{ occupation.anzscoCode || occupation.code }}</text>
        </view>
        </view>
            <view class="info-row">
              <view class="info-item">
                <uv-icon name="document" color="#4A90E2" size="16"></uv-icon>
                <text class="info-label">Supported Visas</text>
                <view class="visa-tags">
                  <uv-tag v-for="visa in getVisaArray(occupation)" :key="visa" 
                          :text="visa" size="mini" type="primary" plain></uv-tag>
        </view>
        </view>
        </view>
            <view class="info-row">
              <view class="info-item">
                <uv-icon name="checkmark-circle" color="#4A90E2" size="16"></uv-icon>
                <text class="info-label">Assessment Authority</text>
                <text class="info-value">{{ getAssessmentAuthority(occupation) }}</text>
        </view>
      </view>
            <view class="info-row">
              <view class="info-item">
                <uv-icon name="list" color="#4A90E2" size="16"></uv-icon>
                <text class="info-label">Occupation Lists</text>
                <view class="list-tags">
                  <uv-tag v-for="list in getOccupationListArray(occupation)" :key="list" 
                          :text="list" size="mini" :type="getListTagType(list)"></uv-tag>
                </view>
              </view>
            </view>
          </view>
        </uv-card>

        <!-- 薪资和就业前景卡片 -->
        <uv-card class="info-card" :show-head="true" head-text="Employment & Salary" head-style="font-weight: bold; color: #333;">
          <view class="card-content">
            <view class="salary-section" v-if="occupation.averageSalary">
              <view class="salary-header">
                <uv-icon name="cash" color="#28a745" size="20"></uv-icon>
                <text class="salary-title">Average Salary Range</text>
              </view>
              <text class="salary-amount">{{ occupation.averageSalary }}</text>
        </view>

            <view class="employment-stats">
              <view class="stat-grid">
                <view class="stat-box">
                  <uv-icon name="trending-up" color="#17a2b8" size="18"></uv-icon>
                  <text class="stat-number">{{ getEmploymentGrowth() }}</text>
                  <text class="stat-desc">Growth Rate</text>
          </view>
                <view class="stat-box">
                  <uv-icon name="people" color="#6f42c1" size="18"></uv-icon>
                  <text class="stat-number">{{ getJobOpenings() }}</text>
                  <text class="stat-desc">Job Openings</text>
                </view>
              </view>
            </view>
          </view>
        </uv-card>
        </view>

      <!-- 详细信息选项卡 -->
      <view class="detail-tabs-container">
        <uv-tabs :list="tabsList" :current="currentTab" @change="handleTabChange" 
                 line-color="#4A90E2" active-color="#4A90E2" inactive-color="#666">
        </uv-tabs>
        
        <!-- 选项卡内容 -->
        <view class="tab-content">
          <!-- 职业描述选项卡 -->
          <view v-if="currentTab === 0" class="tab-panel">
            <uv-card class="description-card">
              <view class="description-content">
                <view class="description-header">
                  <uv-icon name="document-text" color="#4A90E2" size="20"></uv-icon>
                  <text class="description-title">Job Description</text>
          </view>
                <text class="description-text">{{ occupation.description || 'No description available for this occupation.' }}</text>
              </view>
            </uv-card>
        </view>

          <!-- 工作职责选项卡 -->
          <view v-if="currentTab === 1" class="tab-panel">
            <uv-card class="tasks-card">
              <view class="tasks-content">
                <view class="tasks-header">
                  <uv-icon name="checkmark-done-circle" color="#28a745" size="20"></uv-icon>
                  <text class="tasks-title">Key Responsibilities</text>
            </view>
                <view v-if="occupation.tasks && occupation.tasks.length > 0" class="tasks-list">
                  <view v-for="(task, index) in occupation.tasks" :key="index" class="task-item-modern">
                    <view class="task-number">{{ index + 1 }}</view>
                    <text class="task-text">{{ task }}</text>
            </view>
          </view>
                <view v-else class="no-data">
                  <uv-empty mode="data" text="No task information available"></uv-empty>
        </view>
              </view>
            </uv-card>
      </view>

          <!-- 申请要求选项卡 -->
          <view v-if="currentTab === 2" class="tab-panel">
            <uv-card class="requirements-card">
              <view class="requirements-content">
                <view class="requirements-header">
                  <uv-icon name="school" color="#dc3545" size="20"></uv-icon>
                  <text class="requirements-title">Application Requirements</text>
                </view>
                <view v-if="occupation.requirements && occupation.requirements.length > 0" class="requirements-list">
                  <view v-for="(req, index) in occupation.requirements" :key="index" class="requirement-item-modern">
                    <uv-icon name="checkmark-circle" color="#28a745" size="16"></uv-icon>
                    <text class="requirement-text">{{ req }}</text>
                  </view>
                </view>
                <view v-else class="no-data">
                  <uv-empty mode="data" text="No requirement information available"></uv-empty>
                </view>
              </view>
            </uv-card>
          </view>

          <!-- 相关资源选项卡 -->
          <view v-if="currentTab === 3" class="tab-panel">
            <uv-card class="resources-card">
              <view class="resources-content">
                <view class="resources-header">
                  <uv-icon name="link" color="#6f42c1" size="20"></uv-icon>
                  <text class="resources-title">Useful Resources</text>
                </view>
                <view class="resources-list">
                  <uv-cell-group>
                    <uv-cell title="SkillSelect Official Website" 
                             :is-link="true" 
                             @click="openExternalLink('skillselect')">
                      <template #icon>
                        <uv-icon name="globe" color="#4A90E2" size="18"></uv-icon>
                      </template>
                    </uv-cell>
                    <uv-cell title="Skills Assessment Information" 
                             :is-link="true" 
                             @click="openExternalLink('assessment')">
                      <template #icon>
                        <uv-icon name="document-attach" color="#4A90E2" size="18"></uv-icon>
                      </template>
                    </uv-cell>
                    <uv-cell title="Migration Program Information" 
                             :is-link="true" 
                             @click="openExternalLink('migration')">
                      <template #icon>
                        <uv-icon name="airplane" color="#4A90E2" size="18"></uv-icon>
                      </template>
                    </uv-cell>
                  </uv-cell-group>
                </view>
              </view>
            </uv-card>
          </view>
        </view>
      </view>

      <!-- 操作按钮区域 -->
      <view class="action-section">
      <view class="action-buttons">
          <uv-button type="primary" 
                     :custom-style="primaryButtonStyle"
                     @click="addToFavorites">
            <uv-icon name="heart" color="#fff" size="16" style="margin-right: 8rpx;"></uv-icon>
            Add to Favorites
          </uv-button>
          
          <uv-button type="default" 
                     :custom-style="secondaryButtonStyle"
                     @click="shareOccupation">
            <uv-icon name="share" color="#4A90E2" size="16" style="margin-right: 8rpx;"></uv-icon>
            Share
          </uv-button>
      </view>
        
        <!-- 相关职业推荐 -->
        <view v-if="relatedOccupations.length > 0" class="related-section">
          <view class="related-header">
            <uv-icon name="layers" color="#6c757d" size="18"></uv-icon>
            <text class="related-title">Related Occupations</text>
          </view>
          <view class="related-list">
            <view v-for="related in relatedOccupations" :key="related.code" 
                  class="related-item" @click="navigateToOccupation(related)">
              <view class="related-content">
                <text class="related-code">{{ related.code }}</text>
                <text class="related-name">{{ related.englishName }}</text>
                <text class="related-chinese">{{ related.chineseName }}</text>
              </view>
              <uv-icon name="arrow-right" color="#ccc" size="16"></uv-icon>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: false, // 加载状态
      error: null, // 错误信息
      isFavorite: false, // 收藏状态
      currentTab: 0, // 当前选项卡
      occupation: {
        code: '',
        englishName: '',
        chineseName: '',
        category: '',
        isPopular: false,
        anzscoCode: '',
        skillLevel: '',
        visaSubclasses: [],
        assessmentAuthority: '',
        mltssl: false,
        stsol: false,
        rol: false,
        description: '',
        tasks: [],
        requirements: [],
        relatedOccupations: [],
        averageSalary: ''
      },
      relatedOccupations: [], // 相关职业列表
      statisticsData: {}, // 统计数据
      tabsList: [
        { name: 'Description' },
        { name: 'Responsibilities' },
        { name: 'Requirements' },
        { name: 'Resources' }
      ]
    };
  },

  computed: {
    // 按钮样式
    primaryButtonStyle() {
      return {
        background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
        borderRadius: '12rpx',
        height: '88rpx',
        fontSize: '28rpx',
        fontWeight: '500'
      };
    },
    
    secondaryButtonStyle() {
      return {
        background: '#fff',
        border: '2rpx solid #4A90E2',
        borderRadius: '12rpx',
        height: '88rpx',
        fontSize: '28rpx',
        fontWeight: '500',
        color: '#4A90E2'
      };
    }
  },

  onLoad(options) {
    console.log('详情页面接收到的参数:', options);
    this.loadOccupationData(options);
  },

  methods: {
    /**
     * 加载职业数据的主方法 - 支持API调用和本地数据
     */
    async loadOccupationData(options) {
      this.loading = true;
      this.error = null;
      
      try {
    // 从页面参数中获取职业信息
    if (options.occupation) {
          // 完整JSON参数
        this.occupation = JSON.parse(decodeURIComponent(options.occupation));
        console.log('✅ 使用完整参数加载职业信息:', this.occupation);
    } else if (options.code && options.name) {
          // 简化参数 - 先设置基本信息
        this.occupation = {
          code: options.code,
          anzscoCode: options.code,
          englishName: decodeURIComponent(options.name),
          chineseName: options.chineseName ? decodeURIComponent(options.chineseName) : '',
          category: 'Unknown',
          isPopular: false,
          skillLevel: 1,
          visaSubclasses: ['189', '190', '491'],
          assessmentAuthority: 'VETASSESS',
          mltssl: false,
          stsol: false,
          rol: false,
            description: 'Loading occupation details...',
          tasks: [],
          requirements: []
        };
        
          // 尝试从API或本地数据加载完整信息
          await this.loadCompleteOccupationData(options.code);
        } else {
          throw new Error('Missing occupation parameters');
        }
        
        // 加载相关职业
        await this.loadRelatedOccupations();
        
        // 加载统计数据
        await this.loadStatisticsData();
        
        // 检查收藏状态
        this.checkFavoriteStatus();
        
      } catch (error) {
        console.error('❌ 加载职业信息失败:', error);
        this.error = 'Failed to load occupation details. Please try again.';
        
        if (!this.occupation.code) {
          // 如果没有基本信息，返回上一页
          setTimeout(() => {
        this.goBack();
          }, 2000);
        }
      } finally {
        this.loading = false;
      }
    },

    goBack() {
      uni.navigateBack();
    },

    /**
     * 从API或本地数据中加载完整的职业信息
     */
    async loadCompleteOccupationData(code) {
      try {
        // 首先尝试从API获取数据
        const apiResponse = await this.fetchOccupationFromAPI(code);
        
        if (apiResponse.success) {
          this.occupation = apiResponse.data;
          console.log('✅ 成功从API加载职业信息:', this.occupation);
          return;
        }
        
        console.log('⚠️ API调用失败，使用本地数据作为备选');
        
        // 如果API调用失败，使用本地数据作为备选
        const { occupationsData } = await import('../../data/occupations.js');
        
        const completeOccupation = occupationsData.find(item => 
          item.code === code || item.anzscoCode === code
        );
        
        if (completeOccupation) {
          this.occupation = completeOccupation;
          console.log('✅ 成功从本地数据加载职业信息:', this.occupation);
        } else {
          console.log('⚠️ 未找到职业代码对应的完整信息:', code);
        }
        
      } catch (error) {
        console.error('❌ 加载完整职业信息失败:', error);
        throw error;
      }
    },

    /**
     * 从API获取职业数据
     */
    async fetchOccupationFromAPI(code) {
      try {
        // 导入API配置
        const { occupationAPI } = await import('../../config/api.js');
        
        // 调用API获取职业详情
        const response = await occupationAPI.getDetail(code);
        
        if (response.success) {
          return {
            success: true,
            data: response.data
          };
        } else {
          console.error('API返回错误:', response.error);
          return { success: false, error: response.error };
        }
        
      } catch (error) {
        console.error('API调用异常:', error);
        return { success: false, error: error.message };
      }
    },

    /**
     * 从API获取相关职业数据
     */
    async fetchRelatedOccupationsFromAPI(occupationId) {
      try {
        const { occupationAPI } = await import('../../config/api.js');
        const response = await occupationAPI.getRelated(occupationId);
        
        if (response.success && response.data) {
          return response.data;
        }
        
        return [];
      } catch (error) {
        console.error('获取相关职业失败:', error);
        return [];
      }
    },

    /**
     * 从API获取统计数据
     */
    async fetchStatisticsFromAPI(occupationId) {
      try {
        const { statisticsAPI } = await import('../../config/api.js');
        
        // 并行获取就业和薪资统计数据
        const [employmentResponse, salaryResponse] = await Promise.all([
          statisticsAPI.getEmploymentStats(occupationId),
          statisticsAPI.getSalaryStats(occupationId)
        ]);
        
        const statistics = {};
        
        if (employmentResponse.success) {
          statistics.employment = employmentResponse.data;
        }
        
        if (salaryResponse.success) {
          statistics.salary = salaryResponse.data;
        }
        
        return statistics;
      } catch (error) {
        console.error('获取统计数据失败:', error);
        return {};
      }
    },

    /**
     * 加载相关职业信息
     */
    async loadRelatedOccupations() {
      try {
        // 首先尝试从API获取相关职业
        const apiRelatedOccupations = await this.fetchRelatedOccupationsFromAPI(this.occupation.code);
        
        if (apiRelatedOccupations.length > 0) {
          this.relatedOccupations = apiRelatedOccupations.slice(0, 3);
          console.log('✅ 成功从API加载相关职业:', this.relatedOccupations);
          return;
        }
        
        // 如果API没有返回数据，使用本地数据
        if (!this.occupation.relatedOccupations || this.occupation.relatedOccupations.length === 0) {
          return;
        }
        
        const { occupationsData } = await import('../../data/occupations.js');
        
        this.relatedOccupations = occupationsData.filter(item => 
          this.occupation.relatedOccupations.includes(item.code)
        ).slice(0, 3); // 最多显示3个相关职业
        
        console.log('✅ 成功从本地数据加载相关职业:', this.relatedOccupations);
        
      } catch (error) {
        console.error('❌ 加载相关职业失败:', error);
      }
    },

    /**
     * 检查收藏状态
     */
    checkFavoriteStatus() {
      try {
        const favorites = uni.getStorageSync('favorites') || [];
        this.isFavorite = favorites.some(item => item.code === this.occupation.code);
      } catch (error) {
        console.error('检查收藏状态失败:', error);
      }
    },

    /**
     * 选项卡切换
     */
    handleTabChange(index) {
      this.currentTab = index;
    },

    /**
     * 切换收藏状态
     */
    async toggleFavorite() {
      try {
        const occupationData = {
          code: this.occupation.code,
          englishName: this.occupation.englishName,
          chineseName: this.occupation.chineseName,
          category: this.occupation.category,
          addTime: new Date().toISOString()
        };
        
        if (this.isFavorite) {
          // 取消收藏
          await this.removeFavoriteFromAPI(this.occupation.code);
          
          // 本地存储更新
          let favorites = uni.getStorageSync('favorites') || [];
          favorites = favorites.filter(item => item.code !== this.occupation.code);
          uni.setStorageSync('favorites', favorites);
          
          uni.showToast({
            title: 'Removed from favorites',
            icon: 'success'
          });
        } else {
          // 添加收藏
          await this.addFavoriteToAPI(occupationData);
          
          // 本地存储更新
          let favorites = uni.getStorageSync('favorites') || [];
          favorites.push(occupationData);
          uni.setStorageSync('favorites', favorites);
          
          uni.showToast({
            title: 'Added to favorites',
            icon: 'success'
          });
        }
        
        this.isFavorite = !this.isFavorite;
        
      } catch (error) {
        console.error('收藏操作失败:', error);
        uni.showToast({
          title: 'Operation failed',
          icon: 'none'
        });
      }
    },

    /**
     * 添加收藏到API
     */
    async addFavoriteToAPI(occupationData) {
      try {
        const { userAPI } = await import('../../config/api.js');
        const response = await userAPI.addFavorite(occupationData);
        
        if (response.success) {
          console.log('✅ 成功同步收藏到服务器');
        } else {
          console.log('⚠️ 收藏同步到服务器失败，仅保存到本地');
        }
      } catch (error) {
        console.log('⚠️ 收藏API调用失败，仅保存到本地:', error.message);
      }
    },

    /**
     * 从API删除收藏
     */
    async removeFavoriteFromAPI(occupationId) {
      try {
        const { userAPI } = await import('../../config/api.js');
        const response = await userAPI.removeFavorite(occupationId);
        
        if (response.success) {
          console.log('✅ 成功从服务器删除收藏');
        } else {
          console.log('⚠️ 从服务器删除收藏失败，仅从本地删除');
        }
      } catch (error) {
        console.log('⚠️ 删除收藏API调用失败，仅从本地删除:', error.message);
      }
    },

    /**
     * 导航到相关职业
     */
    navigateToOccupation(occupation) {
      uni.navigateTo({
        url: `/pages/occupation-detail/detail?code=${occupation.code}&name=${encodeURIComponent(occupation.englishName)}&chineseName=${encodeURIComponent(occupation.chineseName)}`
      });
    },

    /**
     * 获取签证数组
     */
    getVisaArray(occupation) {
      if (occupation.visaSubclasses && occupation.visaSubclasses.length > 0) {
        return occupation.visaSubclasses;
      }
      return ['189', '190', '491'];
    },

    /**
     * 获取职业列表数组
     */
    getOccupationListArray(occupation) {
      const lists = [];
      if (occupation.mltssl) lists.push('MLTSSL');
      if (occupation.stsol) lists.push('STSOL');
      if (occupation.rol) lists.push('ROL');
      return lists.length > 0 ? lists : ['To be confirmed'];
    },

    /**
     * 获取列表标签类型
     */
    getListTagType(list) {
      const typeMap = {
        'MLTSSL': 'success',
        'STSOL': 'warning',
        'ROL': 'info'
      };
      return typeMap[list] || 'default';
    },

    /**
     * 获取就业增长率
     */
    getEmploymentGrowth() {
      // 如果有API数据，使用API数据
      if (this.statisticsData && this.statisticsData.employment && this.statisticsData.employment.growthRate) {
        return this.statisticsData.employment.growthRate;
      }
      
      // 否则使用模拟数据
      const growthRates = ['5.2%', '3.8%', '7.1%', '4.5%', '6.3%'];
      return growthRates[Math.floor(Math.random() * growthRates.length)];
    },

    /**
     * 获取职位空缺数
     */
    getJobOpenings() {
      // 如果有API数据，使用API数据
      if (this.statisticsData && this.statisticsData.employment && this.statisticsData.employment.jobOpenings) {
        return this.statisticsData.employment.jobOpenings;
      }
      
      // 否则使用模拟数据
      const openings = ['1.2K', '850', '2.1K', '650', '1.8K'];
      return openings[Math.floor(Math.random() * openings.length)];
    },

    /**
     * 加载统计数据
     */
    async loadStatisticsData() {
      try {
        const statistics = await this.fetchStatisticsFromAPI(this.occupation.code);
        this.statisticsData = statistics;
        console.log('✅ 成功加载统计数据:', statistics);
      } catch (error) {
        console.error('❌ 加载统计数据失败:', error);
        this.statisticsData = {};
      }
    },

    // 保留原有方法以兼容现有功能
    getOccupationList(occupation) {
      const lists = [];
      if (occupation.mltssl) lists.push('MLTSSL');
      if (occupation.stsol) lists.push('STSOL');
      if (occupation.rol) lists.push('ROL');
      return lists.length > 0 ? lists.join(', ') : 'To be confirmed';
    },

    getAssessmentAuthority(occupation) {
      if (occupation.assessmentAuthority) {
        return occupation.assessmentAuthority;
      }
      
      // 根据职业类别提供默认评估机构
      const categoryMap = {
        'ICT': 'ACS',
        'Engineering': 'Engineers Australia',
        'Healthcare': 'ANMAC',
        'Management': 'VETASSESS',
        'Finance': 'CPA Australia',
        'Education': 'AITSL',
        'Social Work': 'AASW',
        'Agriculture': 'VETASSESS'
      };
      
      return categoryMap[occupation.category] || 'VETASSESS';
    },

    getSkillLevel(occupation) {
      if (occupation.skillLevel) {
        return `Level ${occupation.skillLevel}`;
      }
      
      // 根据职业类别提供默认技能等级
      const categoryLevelMap = {
        'ICT': 1,
        'Engineering': 1,
        'Healthcare': 1,
        'Management': 1,
        'Finance': 1,
        'Education': 1,
        'Social Work': 1,
        'Agriculture': 1
      };
      
      const defaultLevel = categoryLevelMap[occupation.category] || 1;
      return `Level ${defaultLevel}`;
    },

    getSupportedVisas(occupation) {
      if (occupation.visaSubclasses && occupation.visaSubclasses.length > 0) {
        return occupation.visaSubclasses.join(' / ');
      }
      
      // 提供默认的常见签证类型
      return '189 / 190 / 491';
    },

    addToFavorites() {
      // 使用新的收藏功能
      this.toggleFavorite();
    },

    shareOccupation() {
      // 分享功能 - 兼容不同平台
      const shareContent = `${this.occupation.code} - ${this.occupation.englishName}\n${this.occupation.chineseName}`;
      
      // #ifdef H5
      // H5环境使用剪贴板分享
      uni.setClipboardData({
        data: shareContent,
        success: () => {
          uni.showToast({
            title: '内容已复制到剪贴板',
            icon: 'success'
          });
        }
      });
      // #endif
      
      // #ifdef MP-WEIXIN
      // 微信小程序使用剪贴板
      uni.setClipboardData({
        data: shareContent,
        success: () => {
          uni.showToast({
            title: '内容已复制，可分享给好友',
            icon: 'success'
          });
        }
      });
      // #endif
      
      // #ifdef APP-PLUS
      // App环境使用原生分享
      uni.share({
        provider: 'weixin',
        type: 0,
        title: `${this.occupation.code} - ${this.occupation.englishName}`,
        summary: this.occupation.chineseName,
        success: function () {
          uni.showToast({
            title: '分享成功',
            icon: 'success'
          });
        },
        fail: function () {
          uni.showToast({
            title: '分享失败',
            icon: 'none'
          });
        }
      });
      // #endif
    },

    openExternalLink(type) {
      let url = '';
      let title = '';
      
      switch (type) {
        case 'skillselect':
          url = 'https://www.homeaffairs.gov.au/trav/work/skil';
          title = 'SkillSelect Official Website';
          break;
        case 'assessment':
          url = 'https://www.homeaffairs.gov.au/trav/work/skil/skil-assi';
          title = 'Skills Assessment Information';
          break;
        case 'migration':
          url = 'https://www.homeaffairs.gov.au/trav/work/work';
          title = 'Migration Program Information';
          break;
      }

      if (url) {
        // #ifdef H5
        window.open(url, '_blank');
        // #endif

        // #ifndef H5
        uni.showModal({
          title: 'External Link',
          content: `Open ${title} in browser?`,
          confirmText: 'Open',
          cancelText: 'Copy Link',
          success: function (res) {
            if (res.confirm) {
              // #ifdef APP-PLUS
              plus.runtime.openURL(url);
              // #endif
              
              // #ifdef MP-WEIXIN
              uni.setClipboardData({
                data: url,
                success: function () {
                  uni.showToast({
                    title: 'Link copied to clipboard',
                    icon: 'success'
                  });
                }
              });
              // #endif
            } else if (res.cancel) {
              // 复制链接到剪贴板
              uni.setClipboardData({
                data: url,
                success: function () {
                  uni.showToast({
                    title: 'Link copied to clipboard',
                    icon: 'success'
                  });
                }
              });
            }
          }
        });
        // #endif
      }
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 头部样式 */
.header {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  padding: 100rpx 40rpx 24rpx 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1001;
  box-shadow: 0 4rpx 20rpx rgba(74, 144, 226, 0.3);
}

.header-left, .header-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
}

.header-title {
  color: white;
  font-size: 36rpx;
  font-weight: 600;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

/* 加载和错误状态 */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  text-align: center;
}

.loading-text {
  margin-top: 20rpx;
  color: #666;
  font-size: 28rpx;
}

.error-text {
  margin: 20rpx 0;
  color: #ff6b6b;
  font-size: 28rpx;
  text-align: center;
}

.retry-btn {
  margin-top: 20rpx;
  padding: 16rpx 40rpx;
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.content {
  padding: 40rpx;
}

/* 英雄卡片样式 */
.occupation-hero-card {
  position: relative;
  background: white;
  border-radius: 24rpx;
  margin-bottom: 40rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
}

.hero-content {
  position: relative;
  padding: 40rpx;
}

.occupation-badges {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
  flex-wrap: wrap;
}

.code-badge {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);
}

.category-badge {
  background: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  border: 1rpx solid rgba(74, 144, 226, 0.2);
}

.popularity-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.badge-text {
  font-size: 22rpx;
  font-weight: 600;
}

.occupation-english {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
  line-height: 1.3;
}

.occupation-chinese {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 32rpx;
}

/* 快速统计信息 */
.quick-stats {
  display: flex;
  gap: 24rpx;
  flex-wrap: wrap;
}

.stat-item {
  flex: 1;
  min-width: 160rpx;
  text-align: center;
  padding: 20rpx 16rpx;
  background: rgba(74, 144, 226, 0.05);
  border-radius: 16rpx;
  border: 1rpx solid rgba(74, 144, 226, 0.1);
}

.stat-label {
  display: block;
  font-size: 22rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.stat-value {
  display: block;
  font-size: 24rpx;
  color: #333;
  font-weight: 600;
}

/* 信息卡片网格 */
.info-cards-grid {
  margin-bottom: 40rpx;
}

.info-card {
  margin-bottom: 24rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.card-content {
  padding: 32rpx;
}

.info-row {
  margin-bottom: 24rpx;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.info-label {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
  min-width: 140rpx;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 600;
  flex: 1;
}

.visa-tags, .list-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
  flex: 1;
}

/* 薪资和就业前景卡片 */
.salary-section {
  margin-bottom: 32rpx;
}

.salary-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.salary-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.salary-amount {
  font-size: 32rpx;
  font-weight: 700;
  color: #28a745;
  display: block;
}

.employment-stats {
  padding-top: 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.stat-grid {
  display: flex;
  gap: 24rpx;
}

.stat-box {
  flex: 1;
  text-align: center;
  padding: 24rpx 16rpx;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 16rpx;
}

.stat-number {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #333;
  margin: 8rpx 0 4rpx 0;
}

.stat-desc {
  font-size: 22rpx;
  color: #666;
}

/* 选项卡样式 */
.detail-tabs-container {
  margin-bottom: 40rpx;
}

.tab-content {
  margin-top: 24rpx;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

/* 选项卡内容样式 */
.description-content, .tasks-content, .requirements-content, .resources-content {
  padding: 32rpx;
}

.description-header, .tasks-header, .requirements-header, .resources-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}

.description-title, .tasks-title, .requirements-title, .resources-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.description-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.7;
}

.tasks-list, .requirements-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.task-item-modern {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 16rpx 0;
}

.task-number {
  width: 48rpx;
  height: 48rpx;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.task-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  flex: 1;
}

.requirement-item-modern {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 12rpx 0;
}

.requirement-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  flex: 1;
}

.no-data {
  text-align: center;
  padding: 60rpx 20rpx;
}

/* 操作区域样式 */
.action-section {
  margin-bottom: 40rpx;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

/* 相关职业推荐 */
.related-section {
  background: white;
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.related-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.related-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.related-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: rgba(74, 144, 226, 0.02);
  border-radius: 16rpx;
  border: 1rpx solid rgba(74, 144, 226, 0.1);
  transition: all 0.3s ease;
}

.related-item:active {
  background: rgba(74, 144, 226, 0.05);
  transform: scale(0.98);
}

.related-content {
  flex: 1;
}

.related-code {
  font-size: 24rpx;
  color: #4A90E2;
  font-weight: 600;
  display: block;
  margin-bottom: 4rpx;
}

.related-name {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 4rpx;
}

.related-chinese {
  font-size: 24rpx;
  color: #666;
  display: block;
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
  .quick-stats {
  flex-direction: column;
  }
  
  .stat-item {
    min-width: auto;
  }
  
  .stat-grid {
    flex-direction: column;
    gap: 16rpx;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

/* 过渡动画 */
.related-item, .info-card, .occupation-hero-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.related-item:hover, .info-card:hover, .occupation-hero-card:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.15);
}

/* 深色模式支持（可选） */
@media (prefers-color-scheme: dark) {
  .container {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }
  
  .occupation-hero-card, .info-card, .related-section {
    background: #2d2d2d;
    color: #fff;
  }
  
  .occupation-english, .description-title, .tasks-title, .requirements-title, .resources-title {
    color: #fff;
  }
  
  .occupation-chinese, .description-text, .task-text, .requirement-text {
    color: #ccc;
  }
}
</style>

