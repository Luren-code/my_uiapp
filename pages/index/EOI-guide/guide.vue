<template>
  <view class="container" :class="{ entered }">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="header-left" @click="goBack">
        <text class="back-icon">﹤</text>
      </view>
      <text class="header-title">新手入门</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 内容包装器：不再额外添加 padding，避免双重留白 -->
      <view class="content-wrapper">
        <!-- 澳洲技术移民简介 -->
        <view class="section">
          <text class="section-title">关于澳洲技术移民</text>
          <text class="section-content">
            首先需要明确的是，澳洲技术移民并非只面向高精尖的精英人群。从某种意义上说，它更多是为了解解本地部分行业的劳动力短缺问题。
          </text>
          <view class="jobs-panel">
            <text class="panel-title">近几年邀请最多的职业为：</text>
            <view class="job-row" v-for="job in jobExamples" :key="job.code">
              <view class="code-pill">{{ job.code }}</view>
              <text class="job-name">{{ job.name }}</text>
            </view>
          </view>
          <text class="section-content-1">
            这些岗位在澳洲的就业稳定、待遇可观，但因工作压力较大、责任感强，澳洲本地人从业意愿相对较低，只能依赖海外技术移民填补缺口。从这个角度看，技术移民更像是一次"跨国资源互换"：你用专业技能换取澳洲永居身份和相应的社会福利。除了以上邀请较多的职业，技术移民所涵盖的行业非常广泛，远不止医疗与社会服务。无论你是程序员、会计、市场营销人员、产品经理，还是图书馆管理员、中学教师等，都有可能通过技术移民途径获得邀请。
          </text>
          <view class="stats-container">
            <view class="stat-card">
              <text class="stat-number">18万</text>
              <text class="stat-label">年度配额总量</text>
            </view>
            <view class="stat-card">
              <text class="stat-number">5万</text>
              <text class="stat-label">技术类配额</text>
            </view>
            <view class="stat-card">
              <text class="stat-number">全球</text>
              <text class="stat-label">开放范围</text>
            </view>
          </view>
          <text class="section-content-1">
            目前，澳洲每年有约18万个移民配额，其中支持技术移民的189/190/491三大签证，共计约5万个配额。可惜的是，这些配额面向全球开放，而我们能获取的信息却十分有限。
          </text>

        </view>

        <!-- 申请流程 -->
        <view class="section">
          <text class="section-title">关于这个小程序</text>
          <text class="section-content">我是这个小程序的开发者 xin，（以广告专员225111）职业获得维州190签证邀请，整个过程历时2年，全程DIY完成。从职业评估、英语考试、材料准备到E01递交，我将全部经验、使用的工具和移民局官方数据信息，
            整合进了这个小程序，它存在的最大意义就是<strong style="color: cornflowerblue;">打破信息差</strong>。</text>
          
        </view>

        <!-- 申请条件 -->
        <view class="section">
          <text class="section-title">基本申请条件</text>
          <view class="condition-list">
            <view class="condition-item">
              <view class="condition-number">1</view>
              <view class="condition-content">
                <text class="condition-title">年龄要求</text>
                <text class="condition-desc">申请时年龄需在45岁以下</text>
              </view>
            </view>
            
            <view class="condition-item">
              <view class="condition-number">2</view>
              <view class="condition-content">
                <text class="condition-title">英语能力</text>
                <text class="condition-desc">至少达到雅思6分或同等水平</text>
              </view>
            </view>
            
            <view class="condition-item">
              <view class="condition-number">3</view>
              <view class="condition-content">
                <text class="condition-title">职业评估</text>
                <text class="condition-desc">职业需在SOL或CSOL清单上并通过评估</text>
              </view>
            </view>
            
            <view class="condition-item">
              <view class="condition-number">4</view>
              <view class="condition-content">
                <text class="condition-title">EOI评分</text>
                <text class="condition-desc">EOI打分至少达到65分</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 常见问题 -->
        <view class="section">
          <text class="section-title">小程序使用指南</text>
          <view class="guide-list">
            <view class="guide-item">
              <view class="guide-icon">1</view>
              <view class="guide-content">
                <text class="guide-title">了解澳洲技术移民的基础概况</text>
                <text class="guide-desc">进入「EOI申领Q&A」了解基本制度与常见问题。</text>
              </view>
            </view>
            <view class="guide-item">
              <view class="guide-icon">2</view>
              <view class="guide-content">
                <text class="guide-title">选择匹配的职业</text>
                <text class="guide-desc">使用「澳洲技术移民职业查询」查找与你背景匹配的职业。</text>
              </view>
            </view>
            <view class="guide-item">
              <view class="guide-icon">3</view>
              <view class="guide-content">
                <text class="guide-title">评估自身分数</text>
                <text class="guide-desc">用「EOI分数计算」了解可得分项与提升空间。</text>
              </view>
            </view>
            <view class="guide-item">
              <view class="guide-icon">4</view>
              <view class="guide-content">
                <text class="guide-title">查看最新排名数据</text>
                <text class="guide-desc">在「国家EOI排名」与「各州NEO排名」查看分数走势。</text>
              </view>
            </view>
            <view class="guide-item">
              <view class="guide-icon">5</view>
              <view class="guide-content">
                <text class="guide-title">准备材料</text>
                <text class="guide-desc">根据评估报告准备学历、语言、工作经验证明等材料。</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 警告提示 -->
        <view class="warning-section">
          <view class="warning-item">
            <text class="warning-title">提示</text>
            <text class="warning-content">以上带*的部分功能仅对订阅用户开放</text>
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
      entered: false,
      jobExamples: [
        { code: '261111', name: '分析程序员（初级）系统' },
        { code: '254499', name: '注册护士（通用）内科' },
        { code: '272511', name: '社会工作者' }
      ]
    }
  },
  
  methods: {
    goBack() {
      uni.navigateBack();
    },
  },
  onReady() {
    // 触发从右侧滑入的进入动画（H5/小程序通用CSS动画实现）
    this.$nextTick(() => {
      setTimeout(() => { this.entered = true }, 20)
    })
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
  position: sticky;
  top: 0;
  z-index: 1001;
}

.header-left {
  position: absolute;
  left: 30rpx;
  top: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 30rpx;
}

.back-icon {
  font-size: 40rpx;
  color: white;
}

.header-title {
  font-size: 30rpx;
  font-family: Arial, Helvetica, sans-serif;
}

.content {
  height: auto;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 内容包装器：不再额外添加 padding，避免双重留白 */
.content-wrapper {
  padding: 30rpx; 
  box-sizing: border-box;
  width: 100%;
}

/* 保证内容不会溢出 */
.content-wrapper > *,
.section { 
  max-width: 100%;
  box-sizing: border-box;
}

.section {
  background: white;
  border-radius: 15rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 25rpx;
  display: block;
}
.jobs-panel { background: #eaf4ff; border-left: 8rpx solid #2c6fbe; border-radius: 16rpx; padding: 28rpx 24rpx; margin-top: 24rpx; }
.panel-title { display: block; font-size: 30rpx; color: #2c6fbe; font-weight: 700; margin-bottom: 18rpx; }
.job-row { background: #ffffff; border-radius: 16rpx; padding: 22rpx; display: flex; align-items: center; box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.03); margin-bottom: 18rpx; }
.code-pill { border: 4rpx solid #1a4f8a; color: #1a4f8a; padding: 6rpx 22rpx; border-radius: 40rpx; font-weight: 700; font-size: 26rpx; margin-right: 20rpx; min-width: 140rpx; text-align: center; }
.job-name { font-size: 30rpx; color: #1a1a1a; }

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30rpx;
  display: block;
}

.section-content-1 {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30rpx;
  padding-top: 35rpx;
  display: block;
}

.job-cards { display: flex; flex-direction: column; gap: 20rpx; }
.job-card { background: #f8fbff; border: 2rpx solid #d6eaff; border-radius: 12rpx; padding: 20rpx; display: flex; align-items: center; }
.job-code-pill { background: #e8f2ff; color: #1a73e8; border: 2rpx solid #cfe3ff; border-radius: 24rpx; padding: 6rpx 16rpx; font-size: 24rpx; margin-right: 16rpx; min-width: 120rpx; text-align: center; }
.job-name { font-size: 26rpx; color: #333; }

.stats-container { display: flex; gap: 20rpx; margin-top: 20rpx; }
.stat-card { flex: 1; background: #f8fbff; border: 2rpx solid #e6eefc; border-radius: 12rpx; padding: 24rpx; text-align: center; }
.stat-number { display: block; font-size: 44rpx; font-weight: 700; color: #1a73e8; margin-bottom: 8rpx; }
.stat-label { font-size: 24rpx; color: #666; }

.condition-list {
  margin-top: 30rpx;
}

.condition-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30rpx;
}

.condition-number {
  width: 60rpx;
  height: 60rpx;
  background: #4A90E2;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: bold;
  margin-right: 25rpx;
  flex-shrink: 0;
}

.condition-content {
  flex: 1;
}

.condition-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.condition-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.guide-list {
  margin-top: 30rpx;
}

.guide-item { display: flex; align-items: flex-start; margin-bottom: 24rpx; padding: 22rpx; background: #f8fbff; border: 2rpx solid #e6eefc; border-radius: 12rpx; }
.guide-icon { width: 44rpx; height: 44rpx; border-radius: 50%; background: #1a73e8; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 26rpx; margin-right: 18rpx; }

.guide-content {
  flex: 1;
}

.guide-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.guide-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.warning-section {
  margin-top: 20rpx;
}

.warning-item {
  background: #fff3cd;
  border: 1rpx solid #ffeaa7;
  border-radius: 10rpx;
  padding: 30rpx;
  display: flex;
  align-items: flex-start;
}

.warning-title {
  background: #f39c12;
  color: white;
  padding: 8rpx 15rpx;
  border-radius: 15rpx;
  font-size: 24rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
  display: block;
}

.warning-content {
  font-size: 26rpx;
  color: #856404;
  line-height: 1.4;
  flex: 1;
  display: block;
  padding-top: 10rpx;
}
</style>