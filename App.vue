<script>
import dataInitializer from './utils/data-initializer.js';

export default {
  async onLaunch() {
    console.log('App Launch - 开始初始化应用');
    
    try {
      // 初始化官方数据
      console.log('正在初始化SkillSelect官方数据...');
      const success = await dataInitializer.initialize();
      
      if (success) {
        console.log('✅ 官方数据初始化成功');
        // 显示数据状态
        const status = dataInitializer.getDataStatus();
        console.log('数据状态:', status);
      } else {
        console.log('⚠️ 官方数据初始化失败，将使用本地数据');
      }
    } catch (error) {
      console.error('应用初始化失败:', error);
    }
  },
  
  onShow: function() {
    console.log('App Show');
    
    // 检查数据状态
    const status = dataInitializer.getDataStatus();
    console.log('当前数据状态:', status);
  },
  
  onHide: function() {
    console.log('App Hide');
  }
}
</script>

<style>
/*每个页面公共css */
page {
  background-color: #F8F8F8;
}
</style>
