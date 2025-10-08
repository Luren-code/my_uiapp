# 🚀 最小可用版本API接入指南

## 📋 概述

本指南介绍如何使用新接入的最小可用版本真实API系统。该系统提供了真实的澳洲职业数据，同时保持了简单易用的特性。

## 🎯 功能特性

### ✅ 真实数据源
- **澳洲政府开放数据**: 来自 data.gov.au 的官方数据
- **ANZSCO核心数据**: 包含主要职业分类信息
- **智能降级**: API失败时自动使用静态数据

### ✅ 智能缓存
- **6小时缓存**: 减少API调用，提升响应速度
- **自动刷新**: 缓存过期时自动获取新数据
- **手动刷新**: 支持用户主动刷新数据

### ✅ 用户友好
- **状态指示**: 清晰显示数据来源和状态
- **错误处理**: 优雅的错误处理和降级机制
- **实时反馈**: 加载状态和结果实时显示

## 🔧 技术实现

### API服务 (`api/minimal-real-api.js`)
```javascript
// 基础用法
import minimalRealAPI from './api/minimal-real-api.js';

// 获取职业数据
const result = await minimalRealAPI.getOccupations();

// 手动刷新数据
const refreshResult = await minimalRealAPI.refreshData();

// 获取数据状态
const status = minimalRealAPI.getDataStatus();
```

### 状态指示器 (`components/ApiStatusIndicator.vue`)
```vue
<ApiStatusIndicator 
  :dataSource="dataSource"
  :dataCount="dataCount"
  :isLoading="isLoading"
  :lastUpdated="lastUpdated"
  @refresh="handleRefresh"
/>
```

## 📊 数据结构

### API响应格式
```javascript
{
  success: true,           // 是否成功
  data: [...],            // 职业数据数组
  source: 'Official API', // 数据来源
  count: 25,              // 数据数量
  lastUpdated: '2024-10-03T10:30:00Z' // 更新时间
}
```

### 职业数据格式
```javascript
{
  code: '133211',                    // 职业代码
  englishName: 'Engineering Manager', // 英文名称
  chineseName: '工程经理',            // 中文名称
  category: 'Management',            // 职业类别
  skillLevel: 1,                     // 技能等级
  visaSubclasses: ['189', '190', '491'], // 支持签证
  assessmentAuthority: 'Engineers Australia', // 评估机构
  mltssl: true,                      // 是否在MLTSSL列表
  description: '规划、组织、指导...',  // 职业描述
  tasks: [...],                      // 工作职责
  source: 'ANZSCO Official'          // 数据来源标识
}
```

## 🚀 使用步骤

### 1. 应用启动
应用启动时会自动：
1. 尝试从缓存加载数据
2. 如果缓存无效，调用真实API
3. 如果API失败，降级到静态数据
4. 显示相应的状态指示

### 2. 数据刷新
用户可以通过以下方式刷新数据：
1. 点击状态指示器中的刷新按钮
2. 下拉刷新页面（如果实现）
3. 重新进入应用

### 3. 数据使用
获取的数据可以用于：
1. 职业搜索功能
2. 职业详情展示
3. 相关推荐功能

## 📈 数据来源优先级

```
1. 缓存数据 (如果有效)
   ↓
2. 澳洲政府开放数据API
   ↓
3. ANZSCO核心数据
   ↓
4. 静态备用数据
```

## 🔍 状态说明

### 数据来源状态
- **🌐 官方实时数据**: 来自澳洲政府API的最新数据
- **💾 缓存数据**: 本地缓存的有效数据
- **📋 备用数据**: 静态数据或降级数据

### 加载状态
- **⏳ 加载中**: 正在获取数据
- **✅ 加载完成**: 数据获取成功
- **❌ 加载失败**: 数据获取失败，已降级

## 🛠️ 配置选项

### 缓存配置
```javascript
// 在 minimal-real-api.js 中修改
this.cache = {
  occupations: null,
  lastUpdated: null,
  ttl: 6 * 60 * 60 * 1000 // 6小时缓存，可调整
};
```

### API超时配置
```javascript
// 在 fetchGovernmentData 方法中修改
timeout: 15000 // 15秒超时，可调整
```

## 🧪 测试功能

### 运行测试
```bash
# 运行API功能测试
node test-api.js
```

### 测试内容
1. 基础数据获取测试
2. 缓存功能测试
3. 数据刷新功能测试
4. 状态检查功能测试

## 📞 故障排除

### 常见问题

#### 1. API调用失败
**症状**: 显示"备用数据"状态
**解决**: 
- 检查网络连接
- 查看控制台错误信息
- 等待一段时间后重试

#### 2. 数据不更新
**症状**: 数据显示过时
**解决**:
- 点击刷新按钮
- 清除应用缓存
- 重启应用

#### 3. 加载速度慢
**症状**: 数据加载时间过长
**解决**:
- 检查网络速度
- 调整API超时时间
- 使用缓存数据

## 🔮 未来扩展

### 可扩展功能
1. **更多数据源**: 添加更多官方API
2. **实时更新**: WebSocket实时数据推送
3. **离线同步**: 支持离线数据同步
4. **数据分析**: 添加数据统计和分析功能

### 扩展方法
1. 在 `minimal-real-api.js` 中添加新的数据源方法
2. 修改 `fetchRealData()` 方法整合新数据源
3. 更新状态指示器支持新的数据类型

## ✅ 总结

现在您的应用已经成功接入了真实的API数据源，同时保持了：
- **简单易用**: 最小化的API接入复杂度
- **稳定可靠**: 多重降级保障机制
- **用户友好**: 清晰的状态反馈
- **性能优化**: 智能缓存机制

您可以放心使用这个系统，它会为用户提供真实、及时的澳洲职业数据！

