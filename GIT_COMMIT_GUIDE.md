# Git 提交规范指南

## 📋 面试官认可的提交格式

### 标准提交格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型 (type)
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建工具、依赖管理等

### 作用域 (scope) - 可选
- `pages`: 页面相关
- `components`: 组件相关
- `utils`: 工具函数
- `api`: 接口相关
- `config`: 配置相关

## 🎯 面试友好的提交示例

### ✅ 好的提交示例
```bash
feat(pages): implement EOI calculator basic layout
- Add calculator form with input fields
- Implement score calculation logic
- Add validation for required fields

fix(components): resolve button click event issue
- Fix event handler not triggering on iOS
- Add proper event binding for touch devices

refactor(utils): optimize calculation performance
- Extract common calculation functions
- Reduce computational complexity from O(n²) to O(n)
- Add unit tests for edge cases
```

### ❌ 避免的提交示例
```bash
update files
fix bug
add stuff
完成功能
```

## 🚀 开发阶段提交策略

### 第一阶段：项目初始化
```bash
chore: initialize project structure
feat(config): setup uni-app configuration
feat(pages): create basic page templates
```

### 第二阶段：功能开发
```bash
feat(calculator): implement basic calculation logic
feat(calculator): add form validation
feat(calculator): integrate with UI components
fix(calculator): resolve input formatting issue
```

### 第三阶段：优化完善
```bash
perf(calculator): optimize calculation performance
style(pages): improve responsive layout
docs: add component usage documentation
```

## ⏰ 提交时间策略

### 合理的提交频率
- **每个小功能完成后提交** (30分钟-2小时)
- **每天至少1-3次提交**
- **避免一次性大量提交**

### 时间分布建议
- 上午：新功能开发提交
- 下午：bug修复、优化提交
- 晚上：文档、测试提交

## 📊 证明项目真实性的技巧

### 1. 渐进式开发记录
```bash
feat(calculator): create basic form structure
feat(calculator): add input validation logic  
feat(calculator): implement calculation algorithm
feat(calculator): integrate with UI framework
fix(calculator): resolve edge case handling
perf(calculator): optimize calculation speed
```

### 2. 真实的调试过程
```bash
feat(api): add data fetching functionality
fix(api): resolve CORS issue in development
fix(api): handle network timeout scenarios
refactor(api): improve error handling logic
```

### 3. 学习和改进轨迹
```bash
feat(ui): implement basic styling
style(ui): improve color scheme and typography
refactor(ui): adopt better CSS organization
perf(ui): optimize loading performance
```

## 🔍 面试官验证要点

### 提交记录会被检查的方面：
1. **提交时间分布** - 是否符合正常开发节奏
2. **代码变更量** - 每次提交的代码量是否合理
3. **提交信息质量** - 是否体现真实的开发过程
4. **问题解决轨迹** - 是否有调试、修复的记录
5. **技术成长轨迹** - 是否有学习和改进的过程

### 常见面试问题：
- "这个提交解决了什么具体问题？"
- "为什么选择这种实现方式？"
- "遇到了什么技术难点，如何解决的？"
- "这个功能开发用了多长时间？"

## 💡 实用技巧

### 修改最近的提交信息
```bash
git commit --amend -m "新的提交信息"
```

### 查看详细提交历史
```bash
git log --stat --oneline
git log --graph --pretty=format:'%h - %an, %ar : %s'
```

### 分批提交同一功能
```bash
# 只提交特定文件
git add specific-file.vue
git commit -m "feat(calculator): implement input validation"

# 提交部分更改
git add -p  # 交互式选择要提交的代码块
```
