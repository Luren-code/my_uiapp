<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="header-title">EOI职业</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <view class="main-content">
        <!-- 主标题 -->
        <view class="main-title">
          <text class="title-text">{{ displayTitle }}</text>
          <text class="cursor" v-if="showCursor">|</text>
        </view>

        <!-- 简洁搜索框 -->
        <view class="search-container" :class="{ 'slide-in': showSearchBox }">
          <SimpleSearchBox 
            :placeholder="'输入职业名称或代码搜索'"
            @select="onOccupationSelect"
          />
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
    </view>

  </view>
</template>

<script>
import SimpleSearchBox from '../../components/SimpleSearchBox.vue';
import { searchOccupations, occupationsData } from '../../data/occupations.js';

export default {
  components: {
    SimpleSearchBox // 注册子组件
  },
  
  data() {
    return {
      displayTitle: '',
      showCursor: false,
      fullTitle: '澳洲技术移民职业查询',
      typeTimer: null,
      timeouts: [],              // 记录所有 setTimeout，便于清理
      showSearchBox: false,    // 控制搜索框显示
      showQuickAccess: false,   // 控制快速入口显示
    }
  },
  
  onLoad() {
    // 页面加载时, 启动打字动画
    this.startTyping();
  },

  onUnload() {
    // 页面销毁时, 必须清理所有定时器, 它们不会随页面一起销毁
    this.stopAllTimers();
  },
  
  methods: {
    // 打字机动画
    startTyping() {
      console.log('🎯 startTyping 开始执行');
      
      // 防重入：如果已有定时器在运行，先清理
      if (this.typeTimer) {
        clearInterval(this.typeTimer);
        this.typeTimer = null;
      }
      
      const fullTitle = this.fullTitle;
      let currentIndex = 0;
      
      // 显示光标
      this.showCursor = true;
      console.log('💡 光标显示，开始打字动画');
      
      this.typeTimer = setInterval(() => {
        if (currentIndex < fullTitle.length) {
          this.displayTitle = fullTitle.substring(0, currentIndex + 1);
          currentIndex++;
        } else {
          // 打字完成后的处理
          clearInterval(this.typeTimer);
          this.typeTimer = null;
          console.log('✅ 打字动画完成');
          
          // 打字完成后光标立即消失
          this.showCursor = false;
          
          // 略微加快过渡的展示节奏
          const t1 = setTimeout(() => {
            this.showSearchBox = true;
            console.log('📦 搜索框显示');
          }, 200);
          this.timeouts.push(t1);
          
          const t2 = setTimeout(() => {
            this.showQuickAccess = true;
            console.log('🚪 快速入口显示');
          }, 450);
          this.timeouts.push(t2);
        }
      }, 100);
    },
    
    // 清理所有定时器
    stopAllTimers() {
      if (this.typeTimer) {
        clearInterval(this.typeTimer);
        this.typeTimer = null;
      }
      // 清理所有 setTimeout
      this.timeouts.forEach(id => clearTimeout(id));
      this.timeouts = [];
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


  }
}
</script>

<style scoped>
.container {
  height: 100vh;
  background: #0D5B8F;
  display: flex;
  flex-direction: column;
}

.header {
  /* 仅占导航栏高度，整体在系统胶囊下方开始 */
  background: #0D5B8F; /* 深蓝，匹配目标截图 */
  top: var(--status-bar-height); /* 顶部预留一个状态栏高度 */
  /* height: 200rpx; 导航可视高度 */
  padding-top: 80rpx;
  padding-bottom: 20rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  z-index: 1001;
}

.header-title {
  color: #FFFFFF;
  font-size: 34rpx; /* 稍大，匹配目标视觉 */
  font-weight: 700;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 320rpx 32rpx 120rpx 32rpx; /* 顶部留白同步跟随 header 新高度 */
  background-color: #F8F8F8;
  min-height: calc(100vh - 300rpx);
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 700rpx; /* 放宽主容器以增大搜索框宽度 */
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0 60rpx 0;
  flex-shrink: 0;
  width: 100%;
}

.title-text {
  font-size: 50rpx;
  font-weight: bold;
  color: #000000;
  text-align: center;
  line-height: 1.3;
}

.cursor {
  font-size: 40rpx;
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
  margin-bottom: 50rpx;
  flex-shrink: 0;
  width: 100%;
  max-width: 700rpx; /* 限制下拉同宽 */
  /* 初始状态：隐藏在上方 */
  opacity: 0;
  transform: translateY(-20rpx);
  transition: all 0.6s ease-out;
  position: relative; /* 作为下拉面板定位的参照，并建立新的层叠上下文 */
  z-index: 1002; /* 确保搜索下拉高于下方元素 */
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



/* 快速入口动画样式 */
.quick-access {
  text-align: center;
  flex-shrink: 0;
  width: 100%;
  /* 初始状态：隐藏 */
  opacity: 0;
  transform: translateY(20rpx);
  transition: all 0.6s ease-out;
  margin-top: 0;
  position: relative;
  z-index: 1; /* 低于搜索容器，避免被下拉面板遮挡关系错误 */
}

.quick-access.slide-in {
  /* 动画结束状态：显示 */
  opacity: 1;
  transform: translateY(0);
}

.quick-title {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 24rpx;
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
  font-size: 26rpx;
  margin: 0 16rpx;
  /* 添加按钮悬停效果 */
  transition: color 0.3s ease;
}

.quick-btn:hover {
  color: #4A90E2;
}

.divider {
  color: #ddd;
  font-size: 26rpx;
  margin: 0 16rpx;
}


</style>