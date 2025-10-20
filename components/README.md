# 组件说明

## SearchBox-Enhanced.vue

增强版搜索框组件，使用 uv-ui 组件库构建。

### 使用的 uv-ui 组件

- `uv-search` - 搜索输入框
- `uv-tag` - 搜索历史标签
- `uv-button` - 清除按钮
- `uv-list` / `uv-list-item` - 搜索结果列表
- `uv-badge` - 职业代码徽章
- `uv-empty` - 空状态提示

### 功能特性

- ✅ 实时搜索（防抖 300ms）
- ✅ 搜索历史记录
- ✅ 下拉结果展示
- ✅ 点击跳转详情页
- ✅ 优雅的交互动画

### 使用方法

```vue
<template>
  <SearchBoxEnhanced 
    placeholder="输入职业名称或代码搜索"
    @select="onOccupationSelect"
  />
</template>

<script>
import SearchBoxEnhanced from '../../components/SearchBox-Enhanced.vue';

export default {
  components: {
    SearchBoxEnhanced
  },
  methods: {
    onOccupationSelect(occupation) {
      // 处理职业选择
      console.log('选择了:', occupation);
    }
  }
}
</script>
```

### Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| placeholder | String | '输入职业名称或代码搜索' | 搜索框占位符 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | occupation | 选择职业时触发 |
