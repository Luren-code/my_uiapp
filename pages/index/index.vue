<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="header-title">EOI职业</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 主标题 -->
      <view class="main-title">
        <text class="title-text">{{ displayTitle }}</text>
        <text class="cursor" v-if="showCursor">|</text>
      </view>

      <!-- API状态指示器 -->
      <ApiStatusIndicator 
        :dataSource="dataSource"
        :dataCount="officialOccupationData.length"
        :isLoading="isLoadingData"
        :lastUpdated="lastUpdated"
      />

      <!-- 简洁搜索框 - 仅在有官方数据时显示 -->
      <view class="search-container" :class="{ 'slide-in': showSearchBox }" v-if="hasOfficialData">
        <SimpleSearchBox 
          :placeholder="'输入职业名称或代码搜索'"
          @select="onOccupationSelect"
        />
      </view>

      <!-- 无官方数据时的提示 -->
      <view class="no-data-notice" v-if="!hasOfficialData && !isLoadingData">
        <view class="notice-icon">⚠️</view>
        <text class="notice-title">仅提供官方真实数据</text>
        <text class="notice-message">
          本应用仅显示来自澳洲移民局SkillSelect的官方职业数据，
          不提供任何虚假或模拟数据。请确保网络连接正常，或稍后重试。
        </text>
      </view>


      <!-- 快速入口 - 添加动画类 -->
      <view class="quick-access" :class="{ 'slide-in': showQuickAccess }">
        <text class="quick-title">- 快速入口 -</text>
        <view class="quick-buttons">
		  <!-- 注意：每个按钮都需要完整的标签闭合 -->
		  <text class="quick-btn" @click="navigateToGuide">新手入门</text>
		  <text class="divider">|</text>
		  <text class="quick-btn" @click="navigateToEOICalculator">EOI分数计算</text>
		  <text class="divider">|</text>
		  <text class="quick-btn" @click="navigateToTrends">递交趋势</text>
		</view>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item active">
        <text class="nav-icon">🔍</text>
        <text class="nav-text active">EOI职业</text>
      </view>
      <view class="nav-item" @click="goRanking">
        <view class="nav-icon-custom">EOI</view>
        <text class="nav-text">EOI排名</text>
      </view>
      <view class="nav-item" @click="goResources">
        <view class="nav-icon-grid">
          <view class="grid-item"> </view>
          <view class="grid-item"></view>
          <view class="grid-item"></view>
          <view class="grid-item"></view>
        </view>
        <text class="nav-text">EOI资源</text>
      </view>
      <view class="nav-item" @click="goLandingCenter">
        <view class="nav-icon-user"></view>
        <text class="nav-text">上岸中心</text>
      </view>
    </view>
  </view>
</template>

<script>
import SimpleSearchBox from '../../components/SimpleSearchBox.vue';
import ApiStatusIndicator from '../../components/ApiStatusIndicator.vue';
import { searchOccupations, occupationsData } from '../../data/occupations.js';
import minimalRealAPI from '../../api/minimal-real-api.js';

export default {
  components: {
    SimpleSearchBox,
    ApiStatusIndicator
  },
  
  data() {
    return {
      displayTitle: '',
      showCursor: false,
      fullTitle: '澳洲技术移民职业查询',
      typeTimer: null,
      showSearchBox: false,    // 控制搜索框显示
      showQuickAccess: false,   // 控制快速入口显示
      hasPlayedAnimation: false, // 记录是否已播放过动画
      
      // 数据相关
      hasOfficialData: false,   // 初始状态
      isLoadingData: true,      // 初始加载状态
      officialOccupationData: [], // 职业数据
      dataSource: 'Loading',    // 数据来源
      dataQuality: 'Good',      // 数据质量
      lastUpdated: null         // 最后更新时间
    }
  },
  
  computed: {
    dataStatusClass() {
      if (this.isLoadingData) return 'status-loading';
      if (this.hasOfficialData) return 'status-success';
      return 'status-error';
    },
    
    dataStatusIcon() {
      if (this.isLoadingData) return '⏳';
      if (this.hasOfficialData) return '✅';
      return '❌';
    },
    
    dataStatusText() {
      if (this.isLoadingData) return 'Loading official data...';
      if (this.hasOfficialData) return 'Official data loaded';
      return 'Official data unavailable';
    },
    
    dataStatusDetail() {
      if (this.isLoadingData) return 'Connecting to government APIs...';
      if (this.hasOfficialData) return `${this.officialOccupationData.length} occupations from ${this.dataSource}`;
      return 'Please check network connection';
    }
  },
  
  onLoad() {
    this.checkAndPlayAnimation();
    this.loadRealData();
  },

  onShow() {
    // 页面显示时的处理
  },
  
  onUnload() {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
    }
  },
  
  methods: {
    checkAndPlayAnimation() {
      // 检查本地存储中是否已记录播放过动画
      const hasPlayed = uni.getStorageSync('hasPlayedIndexAnimation');
      
      if (!hasPlayed) {
        // 首次进入，播放动画
        this.startTyping();
        // 记录已播放过动画
        uni.setStorageSync('hasPlayedIndexAnimation', true);
        this.hasPlayedAnimation = true;
      } else {
        // 非首次进入，直接显示完整内容
        this.displayTitle = this.fullTitle;
        this.showSearchBox = true;
        this.showQuickAccess = true;
        this.showCursor = false;
      }
    },
    
    startTyping() {
      const fullTitle = this.fullTitle;
      let currentIndex = 0;
      
      this.typeTimer = setInterval(() => {
        if (currentIndex <= fullTitle.length) {
          this.displayTitle = fullTitle.substring(0, currentIndex);
          currentIndex++;
        } else {
          // 打字完成后的处理
          clearInterval(this.typeTimer);
          
          // 延时显示搜索框
          setTimeout(() => {
            this.showSearchBox = true;
          }, 300);
          
          // 延时显示快速入口
          setTimeout(() => {
            this.showQuickAccess = true;
          }, 600);
          
          // 延时隐藏光标
          setTimeout(() => {
            this.showCursor = false;
          }, 2000);
        }
      }, 90);
    },
    
    // 快速入口跳转
    navigateToEOICalculator() {
      console.log('跳转到EOI计算器');
      uni.navigateTo({
        url: '/pages/index/EOI-calculator/calculator',
        success: () => {
          console.log('跳转成功');
        },
        fail: (err) => {
          console.error('跳转失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },
    
    navigateToGuide() {
      console.log('跳转到新手入门');
      uni.navigateTo({
        url: '/pages/index/EOI-guide/guide',
        success: () => {
          console.log('跳转成功');
        },
        fail: (err) => {
          console.error('跳转失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },
    
    navigateToTrends() {
      console.log('跳转到递交趋势');
      uni.navigateTo({
        url: '/pages/index/EOI-trends/trends',
        success: () => {
          console.log('跳转成功');
        },
        fail: (err) => {
          console.error('跳转失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },
    
    // 重置动画状态（用于测试或清除缓存）
    resetAnimation() {
      uni.removeStorageSync('hasPlayedIndexAnimation');
      this.hasPlayedAnimation = false;
      // 重新检查并播放动画
      this.checkAndPlayAnimation();
    },
    
    goRanking() {
      uni.reLaunch({ url: '/pages/EOI-ranking/ranking' });
    },
    goResources() {
      uni.reLaunch({ url: '/pages/EOI-resources/resources' });
    },
    goLandingCenter() {
      uni.reLaunch({ url: '/pages/landing-center/landing-center' });
    },
    


    /**
     * 加载真实数据
     */
    async loadRealData() {
      console.log('🔍 开始加载真实数据...');
      
      this.isLoadingData = true;
      this.hasOfficialData = false;
      
      try {
        // 使用最小API获取真实数据
        const result = await minimalRealAPI.getOccupations();
        
        console.log('📊 API结果:', result);
        
        if (result.success && result.data && result.data.length > 0) {
          this.officialOccupationData = result.data;
          this.hasOfficialData = true;
          this.isLoadingData = false;
          this.dataSource = result.source;
          this.dataQuality = 'Good';
          this.lastUpdated = result.lastUpdated;
          
          console.log(`✅ 真实数据加载成功: ${result.count} 个职业，来源: ${result.source}`);
          
          // 显示搜索框
          if (!this.hasPlayedAnimation) {
            setTimeout(() => {
              this.showSearchBox = true;
            }, 300);
          } else {
            this.showSearchBox = true;
          }
          
          // 显示加载结果
          const sourceText = result.source === 'Official API' ? '官方API' : 
                           result.source === 'Cache' ? '缓存数据' : '备用数据';
          
          uni.showToast({
            title: `${sourceText}: ${result.count}个职业`,
            icon: 'success',
            duration: 2000
          });
          
          // 如果有提示消息，显示给用户
          if (result.message) {
            setTimeout(() => {
              uni.showToast({
                title: result.message,
                icon: 'none',
                duration: 3000
              });
            }, 2500);
          }
          
        } else {
          // 如果API失败，使用静态数据
          this.loadStaticData();
        }
      } catch (error) {
        console.error('❌ 真实API调用失败:', error);
        this.loadStaticData();
      }
    },

    /**
     * 加载静态数据作为备用
     */
    loadStaticData() {
      console.log('📋 降级到静态数据...');
      
      try {
        if (occupationsData && occupationsData.length > 0) {
          this.officialOccupationData = occupationsData;
          this.hasOfficialData = true;
          this.isLoadingData = false;
          this.dataSource = 'Static Fallback';
          this.dataQuality = 'Basic';
          
          console.log(`✅ 静态数据加载成功: ${occupationsData.length} 个职业`);
          
          // 显示搜索框
          if (!this.hasPlayedAnimation) {
            setTimeout(() => {
              this.showSearchBox = true;
            }, 300);
          } else {
            this.showSearchBox = true;
          }
          
          uni.showToast({
            title: `备用数据: ${occupationsData.length}个职业`,
            icon: 'success',
            duration: 2000
          });
          
        } else {
          this.onDataError(new Error('静态数据无法加载'));
        }
      } catch (error) {
        this.onDataError(error);
      }
    },


    /**
     * 职业选择处理
     */
    onOccupationSelect(occupation) {
      console.log('选择了职业:', occupation);
      
      try {
        // 先简化参数，只传递必要信息
        const params = {
          code: occupation.code || occupation.anzscoCode,
          name: occupation.englishName,
          chineseName: occupation.chineseName
        };
        
        console.log('准备跳转，参数:', params);
        
        // 跳转到职业详情页面
        uni.navigateTo({
          url: `/pages/occupation-detail/detail?code=${params.code}&name=${encodeURIComponent(params.name)}&chineseName=${encodeURIComponent(params.chineseName || '')}`,
          success: () => {
            console.log('✅ 跳转到职业详情页面成功');
          },
          fail: (err) => {
            console.error('❌ 跳转失败:', err);
            
            // 显示详细错误信息
            uni.showModal({
              title: '跳转失败',
              content: `错误信息: ${JSON.stringify(err)}`,
              showCancel: false
            });
          }
        });
        
      } catch (error) {
        console.error('❌ 跳转过程中发生错误:', error);
        uni.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    },

    /**
     * 数据加载失败处理
     */
    onDataError(error) {
      console.error('数据加载失败:', error);
      
      this.hasOfficialData = false;
      this.isLoadingData = false;
      this.officialOccupationData = [];
      
      uni.showToast({
        title: '数据加载失败',
        icon: 'none'
      });
    }

  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  background: linear-gradient(to bottom, #4A90E2, #F8F8F8);
  display: flex;
  flex-direction: column;
}

.header {
  background: #4A90E2;
  padding: 95rpx 0 30rpx 0;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1001;
}

.header-title {
  color: white;
  font-size: 36rpx;
  font-weight: 500;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 40rpx;
  padding-bottom: 200rpx;
  overflow-y: auto;
  background-color: #F8F8F8;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0 60rpx 0;
  flex-shrink: 0;
}

.title-text {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  line-height: 1.2;
}

.cursor {
  font-size: 44rpx;
  color: #333;
  animation: blink 1s infinite;
  margin-left: 4rpx;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 搜索框动画样式 */
.search-container {
  margin-bottom: 60rpx;
  flex-shrink: 0;
  /* 初始状态：隐藏在上方 */
  opacity: 0;
  transform: translateY(-50rpx);
  transition: all 0.6s ease-out;
}

.search-container.slide-in {
  /* 动画结束状态：显示 */
  opacity: 1;
  transform: translateY(0);
}

.search-box {
  background: white;
  border-radius: 50rpx;
  padding: 24rpx 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  border: 2rpx solid #4A90E2;
}

.search-icon {
  margin-right: 20rpx;
  font-size: 32rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.clear-btn {
  color: #ccc;
  font-size: 36rpx;
  margin-left: 20rpx;
  padding: 0 10rpx;
  line-height: 1;
}

/* 数据状态指示器样式 */
.data-status {
  display: flex;
  align-items: center;
  padding: 15rpx 30rpx;
  margin: 20rpx 0;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.status-loading {
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
}

.status-success {
  background: linear-gradient(135deg, #00b894, #00cec9);
}

.status-error {
  background: linear-gradient(135deg, #fd79a8, #e84393);
}

.status-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.status-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4rpx;
}

.status-detail {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
}

.refresh-btn {
  padding: 12rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  font-size: 28rpx;
  color: #fff;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* 无数据提示样式 */
.no-data-notice {
  text-align: center;
  padding: 60rpx 40rpx;
  background: #fff;
  border-radius: 16rpx;
  margin: 40rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.notice-icon {
  font-size: 80rpx;
  margin-bottom: 30rpx;
}

.notice-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.notice-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30rpx;
}

.notice-actions {
  display: flex;
  gap: 20rpx;
  justify-content: center;
}

.notice-btn {
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  border: none;
}

.notice-btn.primary {
  background: #4A90E2;
  color: #fff;
}

.notice-btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1rpx solid #ddd;
}

/* 快速入口动画样式 */
.quick-access {
  text-align: center;
  flex-shrink: 0;
  /* 初始状态：隐藏在上方 */
  opacity: 0;
  transform: translateY(-30rpx);
  transition: all 0.6s ease-out;
}

.quick-access.slide-in {
  /* 动画结束状态：显示 */
  opacity: 1;
  transform: translateY(0);
}

.quick-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
  display: block;
}

.quick-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-btn {
  color: #666;
  font-size: 28rpx;
  margin: 0 20rpx;
  /* 添加按钮悬停效果 */
  transition: color 0.3s ease;
}

.quick-btn:hover {
  color: #4A90E2;
}

.divider {
  color: #ddd;
  font-size: 28rpx;
  margin: 0 20rpx;
}

/* 底部导航保持原样 */
.bottom-nav { display: flex; background: #fff; border-top: 1rpx solid #eee; padding: 20rpx 0; position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000; box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.08); padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); }

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 0;
}

.nav-icon { font-size: 40rpx; margin-bottom: 8rpx; color: #999; }

.nav-icon-custom { width: 48rpx; height: 48rpx; background: #999; color: #fff; border-radius: 8rpx; display: flex; align-items: center; justify-content: center; font-size: 20rpx; font-weight: bold; margin-bottom: 8rpx; }

.nav-icon-grid { width: 48rpx; height: 48rpx; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 4rpx; margin-bottom: 8rpx; }

.grid-item { width: 20rpx; height: 20rpx; background: #999; }

.nav-icon-user {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #999;
  margin-bottom: 8rpx;
  position: relative;
}

.nav-icon-user::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24rpx;
  height: 24rpx;
  background: white;
  border-radius: 50%;
}

.nav-text { font-size: 20rpx; color: #999; }
.nav-text.active { color: #4A90E2; }
.nav-item.active .nav-icon { color: #4A90E2; }
.nav-item.active .nav-icon-custom { background: #4A90E2; }
.nav-item.active .grid-item { background: #4A90E2; }

/* 无数据提示样式 */
.no-data-notice {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  margin: 40rpx 0;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  border-left: 6rpx solid #FF9500;
}

.notice-icon {
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.notice-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.notice-message {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  text-align: left;
}
</style>