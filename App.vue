<!-- 是整个应用的基础，后续可以在这里添加更多全局功能，如用户状态管理、全局配置、错误处理等 -->

<script>
export default {
  data() {
    return {
      // 全局状态
      userInfo: null,
      isLogin: false,
      systemInfo: null
    }
  },
  
  onLaunch() {
    console.log('App Launch');
    // 应用启动时的初始化
    this.initApp();
  },
  
  onShow: function() {
    console.log('App Show');
    // 应用显示时的处理
    this.handleAppShow();
  },
  
  onHide: function() {
    console.log('App Hide');
    // 应用隐藏时的处理
    this.handleAppHide();
  },
  
  methods: {
    // 应用初始化
    initApp() {
      // 获取系统信息
      this.getSystemInfo();
      
      // 检查登录状态
      this.checkLoginStatus();
      
      // 初始化全局配置
      this.initGlobalConfig();
    },
    
    // 获取系统信息
    getSystemInfo() {
      uni.getSystemInfo({
        success: (res) => {
          this.systemInfo = res;
          console.log('系统信息:', res);
        },
        fail: (err) => {
          console.error('获取系统信息失败:', err);
        }
      });
    },
    
    // 检查登录状态
    checkLoginStatus() {
      const token = uni.getStorageSync('token');
      this.isLogin = !!token;
      console.log('登录状态:', this.isLogin);
    },
    
    // 初始化全局配置
    initGlobalConfig() {
      // 可以在这里设置全局配置
      console.log('初始化全局配置');
    },
    
    // 处理应用显示
    handleAppShow() {
      // 应用从后台切换到前台时的处理
      console.log('应用显示处理');
    },
    
    // 处理应用隐藏
    handleAppHide() {
      // 应用切换到后台时的处理
      console.log('应用隐藏处理');
    }
  }
}
</script>

<style lang="scss">
@import '@/uni.scss';
</style>
