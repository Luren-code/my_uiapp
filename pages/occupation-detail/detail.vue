<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">﹤</text>
      </view>
      <text class="header-title">职业详情</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view class="main-content">
        
        <!-- 职业名称区域 -->
        <view class="occupation-name-section">
          <text class="section-title">职业名称</text>
          <view class="name-card">
            <text class="english-name">{{ occupation.englishName }}</text>
            <text class="chinese-name">{{ occupation.chineseName }}</text>
          </view>
        </view>

        <!-- 基本信息区域 -->
        <view class="basic-info-section">
          <text class="section-title">基本信息</text>
          <view class="info-card">
            <view class="info-row">
              <text class="info-label">ANZSCO代码:</text>
              <text class="info-value">{{ occupation.anzscoCode || occupation.code }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">支持签证:</text>
              <text class="info-value">{{ getSupportedVisas(occupation) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">职业评估机构:</text>
              <text class="info-value">{{ getAssessmentAuthority(occupation) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">所属列表:</text>
              <text class="info-value">{{ getOccupationList(occupation) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">技能等级:</text>
              <text class="info-value">{{ getSkillLevel(occupation) }}</text>
            </view>
          </view>
        </view>

        <!-- 职业描述区域 -->
        <view class="description-section" v-if="occupation.description">
          <text class="section-title">职业描述</text>
          <view class="description-card">
            <text class="description-text">{{ occupation.description }}</text>
          </view>
        </view>

        <!-- 工作职责区域 -->
        <view class="tasks-section" v-if="occupation.tasks && occupation.tasks.length > 0">
          <text class="section-title">工作职责</text>
          <view class="tasks-card">
            <view class="task-item" v-for="(task, index) in occupation.tasks" :key="index">
              <text class="task-bullet">•</text>
              <text class="task-text">{{ task }}</text>
            </view>
          </view>
        </view>

        <!-- 职业所属组别区域 -->
        <view class="unit-group-section" v-if="occupation.unitGroup">
          <text class="section-title">职业所属组别</text>
          <view class="unit-group-card">
            <text class="unit-group-text">{{ occupation.unitGroup }}</text>
          </view>
        </view>

        <!-- 此组别下所有职业区域 -->
        <view class="related-occupations-section" v-if="relatedOccupations.length > 0">
          <text class="section-title">此组别下所有职业</text>
          <view class="related-card">
            <view class="related-item" v-for="related in relatedOccupations" :key="related.code" @click="navigateToOccupation(related)">
              <text class="related-code">{{ related.code }}:</text>
              <text class="related-name">{{ related.englishName }}</text>
            </view>
          </view>
        </view>

        <!-- 竞争形势区域 -->
        <view class="competition-section">
          <text class="section-title">竞争形势</text>
          <view class="competition-card">
            <text class="competition-text">{{ occupation.code }}全澳EOI获邀分数：约{{ getInvitationScore() }}分</text>
            <text class="competition-note">*基于最新邀请数据，仅供参考</text>
            <text class="competition-note">*实际分数可能因州担保政策而有所不同</text>
          </view>
        </view>

        <!-- EOI备名详情区域 -->
        <view class="eoi-details-section">
          <text class="section-title">EOI备名详情</text>
          <view class="eoi-card">
            <text class="eoi-current">请在【EOI备名】板块查看</text>
            <view class="eoi-info">
              <text class="eoi-occupation">各州邀请记录：{{ occupation.code }}（{{ occupation.chineseName }}）</text>
            </view>
            <button class="view-details-btn" @click="viewEOIDetails">
              <text class="btn-text">订阅用户可查看</text>
            </button>
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
      loading: false,
      error: null,
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
        averageSalary: '',
        unitGroup: ''
      },
      relatedOccupations: []
    };
  },

  onLoad(options) {
    console.log('详情页面接收到的参数:', options);
    this.loadOccupationData(options);
  },

  methods: {
    /**
     * 加载职业数据
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
            description: '正在加载职业详细信息...',
            tasks: [],
            requirements: [],
            unitGroup: ''
          };
          
          // 尝试从本地数据加载完整信息
          await this.loadCompleteOccupationData(options.code);
        } else {
          throw new Error('缺少职业信息参数');
        }
        
        // 加载相关职业
        await this.loadRelatedOccupations();
        
      } catch (error) {
        console.error('❌ 加载职业信息失败:', error);
        this.error = '加载职业详情失败，请重试';
        
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

    /**
     * 从本地数据中加载完整的职业信息
     */
    async loadCompleteOccupationData(code) {
      try {
        // 导入本地职业数据
        const { occupationsData } = await import('../../data/occupations.js');
        
        const completeOccupation = occupationsData.find(item => 
          item.code === code || item.anzscoCode === code
        );
        
        if (completeOccupation) {
          this.occupation = {
            ...completeOccupation,
            unitGroup: this.getUnitGroup(completeOccupation)
          };
          console.log('✅ 成功加载完整职业信息:', this.occupation);
        } else {
          console.log('⚠️ 未找到职业代码对应的完整信息:', code);
        }
        
      } catch (error) {
        console.error('❌ 加载完整职业信息失败:', error);
      }
    },

    /**
     * 加载相关职业信息
     */
    async loadRelatedOccupations() {
      try {
        if (!this.occupation.relatedOccupations || this.occupation.relatedOccupations.length === 0) {
          // 如果没有相关职业，根据类别生成一些相关职业
          await this.generateRelatedOccupations();
          return;
        }
        
        const { occupationsData } = await import('../../data/occupations.js');
        
        this.relatedOccupations = occupationsData.filter(item => 
          this.occupation.relatedOccupations.includes(item.code)
        ).slice(0, 3); // 最多显示3个相关职业
        
        console.log('✅ 成功加载相关职业:', this.relatedOccupations);
        
      } catch (error) {
        console.error('❌ 加载相关职业失败:', error);
      }
    },

    /**
     * 根据类别生成相关职业
     */
    async generateRelatedOccupations() {
      try {
        const { occupationsData } = await import('../../data/occupations.js');
        
        // 找到同类别的其他职业
        this.relatedOccupations = occupationsData.filter(item => 
          item.category === this.occupation.category && item.code !== this.occupation.code
        ).slice(0, 3);
        
      } catch (error) {
        console.error('❌ 生成相关职业失败:', error);
      }
    },

    /**
     * 获取职业组别信息
     */
    getUnitGroup(occupation) {
      const unitGroupMap = {
        'ICT': 'Unit Group 2631: Computer Network Professionals',
        'Engineering': 'Unit Group 2332: Civil Engineering Professionals',
        'Healthcare': 'Unit Group 2544: Registered Nurses',
        'Management': 'Unit Group 1332: Engineering Managers',
        'Finance': 'Unit Group 2211: Accountants',
        'Education': 'Unit Group 2414: Secondary School Teachers',
        'Social Work': 'Unit Group 2725: Social Workers',
        'Agriculture': 'Unit Group 2341: Agricultural and Forestry Scientists'
      };
      
      return unitGroupMap[occupation.category] || 'Unit Group Information Not Available';
    },

    /**
     * 获取邀请分数（模拟数据）
     */
    getInvitationScore() {
      const scores = [65, 70, 75, 80, 85, 90, 95];
      return scores[Math.floor(Math.random() * scores.length)];
    },

    /**
     * 返回上一页
     */
    goBack() {
      uni.navigateBack();
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
     * 查看EOI详情
     */
    viewEOIDetails() {
      uni.showToast({
        title: '请先订阅服务',
        icon: 'none'
      });
    },

    /**
     * 获取职业列表
     */
    getOccupationList(occupation) {
      const lists = [];
      if (occupation.mltssl) lists.push('MLTSSL');
      if (occupation.stsol) lists.push('STSOL');
      if (occupation.rol) lists.push('ROL');
      return lists.length > 0 ? lists.join(', ') : '待确认';
    },

    /**
     * 获取评估机构
     */
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

    /**
     * 获取技能等级
     */
    getSkillLevel(occupation) {
      if (occupation.skillLevel) {
        return occupation.skillLevel.toString();
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
      return defaultLevel.toString();
    },

    /**
     * 获取支持签证
     */
    getSupportedVisas(occupation) {
      if (occupation.visaSubclasses && occupation.visaSubclasses.length > 0) {
        return occupation.visaSubclasses.join('/');
      }
      
      // 提供默认的常见签证类型
      return '189/190/491';
    }
  }
};
</script>

<style scoped>

.header-left {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  color: white;
  font-size: 32rpx;
  font-weight: bold;
}

/* 通用区域样式 */
.occupation-name-section,
.basic-info-section,
.description-section,
.tasks-section,
.unit-group-section,
.related-occupations-section,
.competition-section,
.eoi-details-section {
  background: white;
  margin-bottom: 20rpx;
  padding: 30rpx 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  display: block;
}

/* 职业名称区域 */
.name-card {
  background: #f8f9fa;
  padding: 30rpx;
  border-radius: 12rpx;
  border-left: 8rpx solid #4A90E2;
}

.english-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;
}

.chinese-name {
  font-size: 26rpx;
  color: #666;
  display: block;
}

/* 基本信息区域 */
.info-card {
  background: #f8f9fa;
  padding: 30rpx;
  border-radius: 12rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #e9ecef;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

/* 职业描述区域 */
.description-card {
  background: #f8f9fa;
  padding: 30rpx;
  border-radius: 12rpx;
}

.description-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

/* 工作职责区域 */
.tasks-card {
  background: #f8f9fa;
  padding: 30rpx;
  border-radius: 12rpx;
}

.task-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.task-item:last-child {
  margin-bottom: 0;
}

.task-bullet {
  font-size: 28rpx;
  color: #4A90E2;
  font-weight: bold;
  margin-right: 16rpx;
  margin-top: 4rpx;
}

.task-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  flex: 1;
}

/* 职业组别区域 */
.unit-group-card {
  background: #f8f9fa;
  padding: 30rpx;
  border-radius: 12rpx;
}

.unit-group-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

/* 相关职业区域 */
.related-card {
  background: #f8f9fa;
  padding: 30rpx;
  border-radius: 12rpx;
}

.related-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #e9ecef;
}

.related-item:last-child {
  border-bottom: none;
}

.related-code {
  font-size: 26rpx;
  color: #4A90E2;
  font-weight: 600;
  margin-right: 12rpx;
}

.related-name {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

/* 竞争形势区域 */
.competition-card {
  background: #fff3cd;
  padding: 30rpx;
  border-radius: 12rpx;
  border-left: 8rpx solid #ffc107;
}

.competition-text {
  font-size: 28rpx;
  color: #856404;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}

.competition-note {
  font-size: 24rpx;
  color: #856404;
  display: block;
  margin-bottom: 8rpx;
}

.competition-note:last-child {
  margin-bottom: 0;
}

/* EOI详情区域 */
.eoi-card {
  background: #e7f3ff;
  padding: 30rpx;
  border-radius: 12rpx;
  border-left: 8rpx solid #4A90E2;
}

.eoi-current {
  font-size: 28rpx;
  color: #0056b3;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}

.eoi-info {
  margin-bottom: 24rpx;
}

.eoi-occupation {
  font-size: 26rpx;
  color: #0056b3;
  display: block;
}

.view-details-btn {
  background: #4A90E2;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 32rpx;
  font-size: 26rpx;
  font-weight: 500;
}

.btn-text {
  color: white;
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
</style>