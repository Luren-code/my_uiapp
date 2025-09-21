<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">﹤</text>
      </view>
      <text class="header-title">职业详情</text>
    </view>

    <!-- 主要内容区域 -->
    <view class="content">
      <!-- 职业基本信息 -->
      <view class="occupation-card">
        <view class="occupation-header">
          <view class="occupation-code">{{ occupation.code }}</view>
          <view class="occupation-category">{{ occupation.category }}</view>
        </view>
        <text class="occupation-english">{{ occupation.englishName }}</text>
        <text class="occupation-chinese">{{ occupation.chineseName }}</text>
        <view class="popularity-badge" v-if="occupation.isPopular">
          <text class="badge-text">热门</text>
        </view>
      </view>

      <!-- 基本信息表格 -->
      <view class="info-table">
        <text class="table-title">基本信息</text>
        <view class="table-row">
          <text class="table-label">ANZSCO代码:</text>
          <text class="table-value">{{ occupation.anzscoCode || occupation.code }}</text>
        </view>
        <view class="table-row">
          <text class="table-label">支持签证:</text>
          <text class="table-value">{{ getSupportedVisas(occupation) }}</text>
        </view>
        <view class="table-row">
          <text class="table-label">职业评估机构:</text>
          <text class="table-value">{{ getAssessmentAuthority(occupation) }}</text>
        </view>
        <view class="table-row">
          <text class="table-label">所属列表:</text>
          <text class="table-value">{{ getOccupationList(occupation) }}</text>
        </view>
        <view class="table-row">
          <text class="table-label">技能等级:</text>
          <text class="table-value">{{ getSkillLevel(occupation) }}</text>
        </view>
        <view class="table-row" v-if="occupation.averageSalary">
          <text class="table-label">平均薪资:</text>
          <text class="table-value">{{ occupation.averageSalary }}</text>
        </view>
      </view>

      <!-- 相关信息 -->
      <view class="info-sections">
        <!-- 职业描述 -->
        <view class="info-section" v-if="occupation.description">
          <text class="section-title">职业描述</text>
          <text class="section-content">{{ occupation.description }}</text>
        </view>

        <!-- 工作职责 -->
        <view class="info-section" v-if="occupation.tasks && occupation.tasks.length > 0">
          <text class="section-title">工作职责</text>
          <view class="task-list">
            <text class="task-item" v-for="(task, index) in occupation.tasks" :key="index">
              • {{ task }}
            </text>
          </view>
        </view>

        <!-- 申请要求 -->
        <view class="info-section" v-if="occupation.requirements && occupation.requirements.length > 0">
          <text class="section-title">申请要求</text>
          <view class="requirement-list">
            <text class="requirement-item" v-for="(req, index) in occupation.requirements" :key="index">
              • {{ req }}
            </text>
          </view>
        </view>

        <!-- 相关链接 -->
        <view class="info-section">
          <text class="section-title">相关链接</text>
          <view class="link-list">
            <view class="link-item" @click="openExternalLink('skillselect')">
              <text class="link-text">SkillSelect官方网站</text>
              <text class="link-arrow">›</text>
            </view>
            <view class="link-item" @click="openExternalLink('assessment')">
              <text class="link-text">技能评估信息</text>
              <text class="link-arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="action-btn primary" @click="addToFavorites">
          添加收藏
        </button>
        <button class="action-btn secondary" @click="shareOccupation">
          分享
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
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
      }
    };
  },

  onLoad(options) {
    // 从页面参数中获取职业信息
    if (options.occupation) {
      try {
        this.occupation = JSON.parse(decodeURIComponent(options.occupation));
      } catch (error) {
        console.error('解析职业信息失败:', error);
        this.goBack();
      }
    } else {
      // 如果没有传递职业信息，返回上一页
      this.goBack();
    }
  },

  methods: {
    goBack() {
      uni.navigateBack();
    },

    getOccupationList(occupation) {
      const lists = [];
      if (occupation.mltssl) lists.push('MLTSSL');
      if (occupation.stsol) lists.push('STSOL');
      if (occupation.rol) lists.push('ROL');
      return lists.length > 0 ? lists.join(', ') : '待确认';
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
      // 添加到收藏夹逻辑
      uni.showToast({
        title: '已添加到收藏',
        icon: 'success'
      });
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
      switch (type) {
        case 'skillselect':
          url = 'https://www.homeaffairs.gov.au/trav/work/skil';
          break;
        case 'assessment':
          url = 'https://www.homeaffairs.gov.au/trav/work/skil/skil-assi';
          break;
      }

      if (url) {
        // #ifdef H5
        window.open(url, '_blank');
        // #endif

        // #ifndef H5
        uni.showModal({
          title: '外部链接',
          content: `在浏览器中打开 ${url}？`,
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
                    title: '链接已复制到剪贴板',
                    icon: 'success'
                  });
                }
              });
              // #endif
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
  background: #f8f9fa;
}

.header {
  background: #4A90E2;
  padding: 95rpx 40rpx 30rpx 40rpx;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1001;
}

.header-left {
  margin-right: 40rpx;
}

.back-icon {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

.header-title {
  color: white;
  font-size: 36rpx;
  font-weight: 500;
}

.content {
  padding: 40rpx;
}

.occupation-card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  position: relative;
}

.occupation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.occupation-code {
  background: #4A90E2;
  color: white;
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.occupation-category {
  background: #e9f4ff;
  color: #4A90E2;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.occupation-english {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
  display: block;
}

.occupation-chinese {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.popularity-badge {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  background: #ff6b6b;
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
}

.badge-text {
  color: white;
  font-size: 20rpx;
  font-weight: bold;
}

.info-sections {
  margin-bottom: 40rpx;
}

.info-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.section-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.requirement-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.requirement-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.link-item:last-child {
  border-bottom: none;
}

.link-text {
  font-size: 26rpx;
  color: #4A90E2;
}

.link-arrow {
  font-size: 28rpx;
  color: #ccc;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 24rpx 0;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
}

.action-btn.primary {
  background: #4A90E2;
  color: white;
}

.action-btn.secondary {
  background: white;
  color: #4A90E2;
  border: 2rpx solid #4A90E2;
}

/* 信息表格样式 */
.info-table {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.table-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.table-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-label {
  font-size: 26rpx;
  color: #666;
  flex: 0 0 160rpx;
}

.table-value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
  text-align: right;
  font-weight: 500;
}

/* 任务列表样式 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.task-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  padding-left: 20rpx;
}
</style>

