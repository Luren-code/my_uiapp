# EOI 职业查询小程序

> 面向澳洲技术移民申请人的工具型小程序，整合 ANZSCO 官方职业数据、EOI 分数计算与移民资源导航。

## 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | uni-app + Vue 3 |
| UI 组件库 | uv-ui |
| 目标平台 | 微信小程序（同时支持 H5、App） |
| 数据层 | 本地静态 JSON + 通用 API 客户端（含超时 / 重试 / 错误处理） |

## 功能概览

### 4 个主入口（tabBar）

| 入口 | 功能 |
|---|---|
| EOI 职业 | 职业列表、双语搜索、热门职业、分类筛选 |
| EOI 排名 | 各职业 EOI 邀请分数线与排名 |
| EOI 资源 | 移民相关学习资料与外部资源 |
| 上岸中心 | 已成功获邀者经验分享 |

### 4 个二级页面

- **EOI 计算器** — 输入年龄、英语、学历、工作经验等条件，计算 EOI 评分
- **新手入门** — 移民流程图解与名词解释
- **递交趋势** — EOI 历史递交分数趋势可视化
- **职业详情** — ANZSCO 职业详情（任务、要求、签证类别、薪资范围、相关职业）

### 核心组件

**`SearchBox-Enhanced.vue`** —— 基于 `uv-search` 二次封装的增强搜索组件
- 实时搜索（按 ANZSCO Code / 英文名 / 中文名）
- 本地搜索历史（最近 N 条）
- 下拉建议面板
- 点击外部自动收起
- 双语职业匹配结果

## 项目结构

```
my-eoi-app/
├── pages/                        # 页面目录
│   ├── index/
│   │   ├── index.vue             # 首页：职业列表 + 搜索
│   │   ├── EOI-calculator/       # EOI 评分计算器
│   │   ├── EOI-guide/            # 新手入门
│   │   └── EOI-trends/           # 递交趋势
│   ├── EOI-ranking/              # EOI 排名
│   ├── EOI-resources/            # EOI 资源
│   ├── landing-center/           # 上岸中心
│   └── occupation-detail/        # 职业详情
├── components/
│   └── SearchBox-Enhanced.vue    # 增强搜索组件
├── config/
│   └── api.js                    # 通用 API 客户端 + 端点定义
├── data/
│   └── occupations.js            # 500+ 条 ANZSCO 官方职业数据
├── utils/
│   ├── data-initializer.js       # 数据初始化
│   └── data-validator.js         # 数据校验
├── uni_modules/                  # uv-ui 组件库
├── static/                       # 静态资源（图标 / 图片）
├── pages.json                    # 路由 + tabBar 配置
├── manifest.json                 # 应用配置
└── main.js                       # 入口
```

## 数据来源

- **ANZSCO 职业数据**：整理自澳大利亚移民局 [SkillSelect](https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect) 公开列表，覆盖 ICT、工程、医疗等类目，每条数据包含：
  - ANZSCO Code、英文名、中文名、所属分类
  - 技能等级（Skill Level 1–5）
  - 可申请签证类别（189 / 190 / 491）
  - 评估机构（如 ACS、EA、VETASSESS）
  - MLTSSL / STSOL / ROL 列表标记
  - 工作描述、典型任务、申请要求
  - 薪资范围、相关职业

- **API 层架构**：在 `config/api.js` 中预置了完整的后端接口定义（`occupationAPI` / `userAPI` / `statisticsAPI`），含 10 秒超时、最多 3 次递增延迟重试、统一错误处理。当前对接静态数据完成端到端联调，未来可无缝切换至真实后端 REST 接口。

## 本地运行

### 环境要求
- Node.js ≥ 16
- HBuilderX（推荐）或微信开发者工具

### 启动

```bash
# 安装依赖
npm install

# 开发模式（默认）
npm run dev

# 编译为微信小程序
npm run build:mp-weixin

# 编译为 H5
npm run build:h5

# 编译为 App
npm run build:app
```

编译完成后用对应平台工具打开 `unpackage/dist/dev/<platform>/` 目录即可预览。

## 已知问题与设计决策

### 导航栏吸顶兼容性
小程序滚动场景下 `position: fixed` 在带动画容器中会失效。最终选用 **`position: sticky`** 实现导航栏吸顶，兼顾动画容器与滚动行为。详见 `log.md` 中的迭代记录。

### 数据存储
当前所有职业数据为静态 JSON。下一步规划：
- 接入云数据库（Supabase / 微信云开发）
- 用户登录后持久化收藏 / 搜索历史
- 实时更新 EOI 邀请分数线

## 开发记录

详见 `log.md` —— 含每次迭代的目标、踩坑、解决方案。

## License

仅供学习与个人使用，职业数据版权归澳大利亚移民局所有。
