# Git 提交规范指南

## 提交信息格式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## 提交类型 (type)

- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式化（不影响功能）
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动
- **perf**: 性能优化
- **ci**: CI配置文件和脚本的变动

## 作用域 (scope) - 可选

指定提交影响的范围：
- **pages**: 页面相关
- **components**: 组件相关
- **styles**: 样式相关
- **config**: 配置相关
- **api**: API相关

## 描述 (description)

- 使用现在时态："add feature" 而不是 "added feature"
- 首字母小写
- 结尾不加句号
- 简洁明了地描述做了什么

## 示例

### 好的提交信息
```
feat(pages): add EOI calculator with score calculation
fix(styles): resolve navbar alignment issue on mobile
docs: update README with installation instructions
refactor(components): extract common button component
```

### 每日开发提交建议格式
```
feat: 2025-09-13 - implement user authentication
fix: 2025-09-13 - resolve login form validation
docs: 2025-09-13 - update development log
```

## 每日提交工作流程

### 开发期间
1. **功能开发**: `feat: implement new feature`
2. **Bug修复**: `fix: resolve specific issue`
3. **样式调整**: `style: update component styling`

### 每日结束
1. **汇总提交**: `feat: 2025-MM-DD - daily development summary`
2. **文档更新**: `docs: 2025-MM-DD - update development log`
3. **推送远程**: 确保所有提交都推送到GitHub

## VS Code Git 操作快捷键

- `Ctrl/Cmd + Shift + G`: 打开Git面板
- `Ctrl/Cmd + Enter`: 提交更改
- `Ctrl/Cmd + Shift + P`: 命令面板，搜索Git命令

## 注意事项

1. **每次提交都要有意义** - 避免"update"、"fix"这样的无意义提交
2. **原子性提交** - 每个提交只做一件事
3. **及时推送** - 每日工作结束后推送到远程仓库
4. **保持历史清洁** - 避免过多无意义的合并提交
