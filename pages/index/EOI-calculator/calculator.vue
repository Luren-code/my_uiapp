<template>
  <view class="container" :class="{ entered }">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">EOI打分表</text>
    </view>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 统一的表单容器 -->
      <view class="form-container">
        <!-- 技术移民职业 -->
        <view class="form-section">
          <text class="section-title">技术移民职业</text>
          <text class="section-desc">请选择最符合您当前工作性质的技术移民职业。</text>
          <view class="input-field">
            <input 
              class="search-input" 
              placeholder="请输入职业代码或关键词"
              v-model="searchKeyword"
            />
            <text class="clear-btn" v-if="searchKeyword" @click="clearSearch">×</text>
          </view>
        </view>

        <!-- 年龄 -->
        <view class="form-section">
          <text class="section-title">年龄</text>
          <text class="section-desc">请选择您的年龄范围。</text>
          <view class="input-field">
            <picker 
              mode="selector" 
              :value="ageIndex" 
              :range="ageOptions"
              @change="onAgeChange"
            >
              <view class="picker-field">
                <text class="picker-text">{{ ageOptions[ageIndex] || '请选择' }}</text>
                <text class="picker-arrow">›</text>
              </view>
            </picker>
            <text class="score-display">分值：{{ scores.age }} 分</text>
          </view>
        </view>

        <!-- 语言成绩 -->
        <view class="form-section">
          <text class="section-title">语言成绩</text>
          <text class="section-desc">您的英语水平如何？</text>
          <view class="input-field">
            <picker 
              mode="selector" 
              :value="englishIndex" 
              :range="englishOptions"
              @change="onEnglishChange"
            >
              <view class="picker-field">
                <text class="picker-text">{{ englishOptions[englishIndex] || '请选择' }}</text>
                <text class="picker-arrow">›</text>
              </view>
            </picker>
            <text class="score-display">分值：{{ scores.english }} 分</text>
          </view>
        </view>

        <!-- 海外工作经验 -->
        <view class="form-section">
          <text class="section-title">海外工作经验</text>
          <text class="section-desc">过去10年，您在指定的技术移民职业上有几年的工作经验？(包括国内和非澳洲的其他国家)</text>
          <view class="input-field">
            <picker 
              mode="selector" 
              :value="overseasWorkIndex" 
              :range="workOptions"
              @change="onOverseasWorkChange"
            >
              <view class="picker-field">
                <text class="picker-text">{{ workOptions[overseasWorkIndex] || '请选择' }}</text>
                <text class="picker-arrow">›</text>
              </view>
            </picker>
            <text class="score-display">分值：{{ scores.overseasWork }} 分</text>
          </view>
        </view>

        <!-- 澳洲工作经验 -->
        <view class="form-section">
          <text class="section-title">澳洲工作经验</text>
          <text class="section-desc">过去10年，您在指定的技术移民职业上有几年的工作经验？(仅限澳洲，与海外工作经验加分可叠加)</text>
          <view class="input-field">
            <picker 
              mode="selector" 
              :value="australiaWorkIndex" 
              :range="workOptions"
              @change="onAustraliaWorkChange"
            >
              <view class="picker-field">
                <text class="picker-text">{{ workOptions[australiaWorkIndex] || '请选择' }}</text>
                <text class="picker-arrow">›</text>
              </view>
            </picker>
            <text class="score-display">分值：{{ scores.australiaWork }} 分</text>
          </view>
        </view>

        <!-- 最高学历 -->
        <view class="form-section">
          <text class="section-title">最高学历</text>
          <text class="section-desc">您的最高学历是什么？</text>
          <view class="input-field">
            <picker 
              mode="selector" 
              :value="educationIndex" 
              :range="educationOptions"
              @change="onEducationChange"
            >
              <view class="picker-field">
                <text class="picker-text">{{ educationOptions[educationIndex] || '请选择' }}</text>
                <text class="picker-arrow">›</text>
              </view>
            </picker>
            <text class="score-display">分值：{{ scores.education }} 分</text>
          </view>
        </view>

        <!-- 澳洲学习经历 -->
        <view class="form-section">
          <text class="section-title">澳洲学习经历</text>
          <text class="section-desc">您是否在澳洲完成至少2年以上的全日制学习？</text>
          <view class="input-field">
            <picker 
              mode="selector" 
              :value="australiaStudyIndex" 
              :range="yesNoOptions"
              @change="onAustraliaStudyChange"
            >
              <view class="picker-field">
                <text class="picker-text">{{ yesNoOptions[australiaStudyIndex] || '请选择' }}</text>
                <text class="picker-arrow">›</text>
              </view>
            </picker>
            <text class="score-display">分值：{{ scores.australiaStudy }} 分</text>
          </view>
        </view>

        <!-- 澳洲STEM学历 -->
        <view class="form-section">
          <text class="section-title">澳洲STEM学历</text>
          <text class="section-desc">您是否完成至少2年STEM相关专业的研究型硕士或博士课程（仅限澳洲学历）？</text>
          <view class="input-field">
            <picker 
              mode="selector" 
              :value="stemIndex" 
              :range="yesNoOptions"
              @change="onStemChange"
            >
              <view class="picker-field">
                <text class="picker-text">{{ yesNoOptions[stemIndex] || '请选择' }}</text>
                <text class="picker-arrow">›</text>
              </view>
            </picker>
            <text class="score-display">分值：{{ scores.stem }} 分</text>
          </view>
        </view>

        <!-- 计算按钮 -->
        <view class="calculate-section">
          <button class="calculate-btn" @click="calculateEOI">计算EOI总分</button>
          <text class="total-score" v-if="totalScore > 0">总分：{{ totalScore }} 分</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      entered: false,
      searchKeyword: '',
      ageIndex: -1,
      englishIndex: -1,
      overseasWorkIndex: -1,
      australiaWorkIndex: -1,
      educationIndex: -1,
      australiaStudyIndex: -1,
      stemIndex: -1,
      
      ageOptions: ['18-24岁', '25-32岁', '33-39岁', '40-44岁', '45岁以上'],
      englishOptions: ['无成绩', '雅思4.5', '雅思5.0', '雅思6.0', '雅思7.0', '雅思8.0'],
      workOptions: ['无经验', '1年以下', '1-2年', '3-4年', '5-7年', '8年以上'],
      educationOptions: ['高中', '证书/文凭', '学士学位', '硕士学位', '博士学位'],
      yesNoOptions: ['否', '是'],
      
      scores: {
        age: 0,
        english: 0,
        overseasWork: 0,
        australiaWork: 0,
        education: 0,
        australiaStudy: 0,
        stem: 0
      },
      
      totalScore: 0
    }
  },
  

  
  onReady() {
    // 触发从右侧滑入的进入动画（H5/小程序通用CSS动画实现）
    this.$nextTick(() => {
      setTimeout(() => { this.entered = true }, 20)
    })
  },
  
  methods: {
    goBack() {
      uni.navigateBack();
    },
    
    
    clearSearch() {
      this.searchKeyword = '';
    },
    
    onAgeChange(e) {
      this.ageIndex = e.detail.value;
      const ageScores = [25, 30, 25, 15, 0];
      this.scores.age = ageScores[this.ageIndex] || 0;
    },
    
    onEnglishChange(e) {
      this.englishIndex = e.detail.value;
      const englishScores = [0, 10, 20, 0, 10, 20];
      this.scores.english = englishScores[this.englishIndex] || 0;
    },
    
    onOverseasWorkChange(e) {
      this.overseasWorkIndex = e.detail.value;
      const workScores = [0, 0, 5, 10, 15, 15];
      this.scores.overseasWork = workScores[this.overseasWorkIndex] || 0;
    },
    
    onAustraliaWorkChange(e) {
      this.australiaWorkIndex = e.detail.value;
      const workScores = [0, 0, 5, 10, 15, 20];
      this.scores.australiaWork = workScores[this.australiaWorkIndex] || 0;
    },
    
    onEducationChange(e) {
      this.educationIndex = e.detail.value;
      const eduScores = [0, 10, 15, 15, 20];
      this.scores.education = eduScores[this.educationIndex] || 0;
    },
    
    onAustraliaStudyChange(e) {
      this.australiaStudyIndex = e.detail.value;
      this.scores.australiaStudy = this.australiaStudyIndex === 1 ? 5 : 0;
    },
    
    onStemChange(e) {
      this.stemIndex = e.detail.value;
      this.scores.stem = this.stemIndex === 1 ? 10 : 0;
    },
    
    calculateEOI() {
      this.totalScore = Object.values(this.scores).reduce((sum, score) => sum + score, 0);
      uni.showToast({
        title: `您的EOI总分为：${this.totalScore}分`,
        icon: 'none',
        duration: 3000
      });
    },
    

  }
}
</script>

<style scoped>
.container {
  background: #f5f5f5;
  min-height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateX(100%);
  z-index: 1000;
  overflow-y: auto;
  box-shadow: -10rpx 0 30rpx rgba(0, 0, 0, 0.3);
  will-change: transform;
}

.container.entered {
  transform: translateX(0);
  transition: transform 0.35s ease-out;
}

.header {
  background: #4A90E2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 95rpx 0 30rpx 0;
  color: white;
  position: relative;
}

.header-left {
  position: absolute;
  left: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
}

.back-icon {
  font-size: 40rpx;
  font-weight: bold;
  color: white;
}

.header-title {
  font-size: 30rpx;
  font-family: Arial, Helvetica, sans-serif;
}

.header-right {
  display: flex;
  gap: 20rpx;
  width: 120rpx;
  justify-content: flex-end;
}


.main-content {
  padding: 30rpx;
}

.form-container {
  background: white;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-section {
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2c3e50;
  display: block;
  margin-bottom: 15rpx;
}

.section-desc {
  font-size: 26rpx;
  color: #7f8c8d;
  line-height: 1.5;
  display: block;
  margin-bottom: 25rpx;
}

.input-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx 25rpx;
  position: relative;
  border: 1rpx solid #e9ecef;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #2c3e50;
  background: transparent;
  border: none;
  outline: none;
}

.clear-btn {
  color: #95a5a6;
  font-size: 32rpx;
  font-weight: bold;
  margin-left: 20rpx;
}

.picker-field {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.picker-text {
  font-size: 28rpx;
  color: #2c3e50;
}

.picker-arrow {
  color: #bdc3c7;
  font-size: 24rpx;
  font-weight: bold;
}

.score-display {
  font-size: 26rpx;
  color: #3498db;
  font-weight: 500;
  margin-left: 20rpx;
}

.calculate-section {
  padding: 40rpx 30rpx;
  text-align: center;
  background: #f8f9fa;
}

.calculate-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 25rpx;
  padding: 25rpx 60rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(52, 152, 219, 0.3);
  transition: all 0.3s ease;
}

.calculate-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(52, 152, 219, 0.3);
}

.total-score {
  font-size: 36rpx;
  color: #2c3e50;
  font-weight: bold;
}
</style>