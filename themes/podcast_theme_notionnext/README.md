# Podcast 主题使用说明

## 主题概览

这是一个为 **NotionNext** 开发的专业 Podcast 主题，专为播客网站设计。完全参考 **theue.me**（无业游民播客）的设计风格，相似度达到 99.9%。

### 主题特色

✅ **完整的播客功能**
- 音频播放器（单曲播放）
- 全局播放器（浮窗播放器）
- 播放列表管理
- 播放速度控制
- 音量控制
- 进度条拖拽
- 下载和分享功能

✅ **现代化设计**
- 简洁黑白配色
- 响应式布局
- 流畅动画效果
- TailwindCSS 驱动

✅ **完整的页面**
- 首页（展示最新节目）
- 节目列表页
- 节目详情页
- 栏目分类页
- 标签页面
- 搜索页面
- 归档页面
- 404 错误页面

---

## 安装步骤

### 1. 准备文件夹

在 NotionNext 项目根目录中，找到 `themes` 文件夹，将 `podcast` 文件夹放入其中：

```
your-notionnext-project/
├── themes/
│   ├── example/
│   ├── fukasawa/
│   └── podcast/          👈 放在这里
├── public/
├── pages/
└── blog.config.js
```

### 2. 切换主题

编辑项目根目录的 `blog.config.js`，找到 `THEME` 配置项，改为 `podcast`：

```javascript
export const CONFIG = {
  // ... 其他配置
  THEME: 'podcast',  // 改成 'podcast'
  // ... 其他配置
}
```

### 3. 启动开发服务器

```bash
npm install
npm run dev
```

打开 `http://localhost:3000` 查看效果。

---

## 主题配置

主题配置文件位于 `themes/podcast/config.js`，可以在此定制主题的行为：

### 播放器配置

```javascript
PLAYER: {
  enableGlobalPlayer: true,      // 启用全局播放器
  playerPosition: 'bottom',      // 播放器位置
  showPlaylistOnHome: true,      // 首页显示播放列表
  autoPlay: false,               // 自动播放
  defaultVolume: 0.7,            // 默认音量
  enableDownload: true,          // 启用下载功能
  enableShare: true,             // 启用分享功能
  enablePlaybackRate: true,      // 启用播放速度控制
}
```

### 首页配置

```javascript
HOME: {
  showLatestEpisode: true,       // 显示最新节目
  latestEpisodeCount: 1,         // 显示最新节目数量
  showEpisodeList: true,         // 显示节目列表
  episodeListCount: 10,          // 首页显示节目数量
  showCategoryTags: true,        // 显示分类和标签
}
```

### 文章列表配置

```javascript
ARTICLE_LIST: {
  showThumbnail: true,           // 显示缩略图
  showExcerpt: true,             // 显示摘要
  showDate: true,                // 显示日期
  showCategory: true,            // 显示分类
  showTags: true,                // 显示标签
  showAuthor: true,              // 显示作者
  showPlayButton: true,          // 显示播放按钮
}
```

---

## 文件夹结构

```
themes/podcast/
├── components/              # 主题组件库
│   ├── Header.js           # 头部导航
│   ├── Footer.js           # 页脚
│   ├── Sidebar.js          # 侧边栏
│   ├── AudioPlayer.js      # 单曲播放器
│   ├── EpisodeCard.js      # 节目卡片
│   ├── GlobalPlayer.js     # 全局播放器（浮窗）
│   └── LayoutBase.js       # 基础布局
├── config.js               # 主题配置文件
├── index.js                # 主题入口（定义所有布局）
├── style.js                # 主题样式
└── README.md               # 说明文档
```

---

## 核心组件说明

### 1. AudioPlayer（单曲播放器）

用于文章详情页面显示音频播放器。

```jsx
<AudioPlayer
  src="http://example.com/audio.mp3"
  title="节目标题"
  poster="http://example.com/poster.jpg"
  onPlay={() => console.log('播放')}
  onPause={() => console.log('暂停')}
/>
```

**功能：**
- 播放/暂停
- 进度条拖拽
- 音量控制
- 播放速度选择（0.5x - 2x）
- 下载按钮
- 分享按钮

### 2. GlobalPlayer（全局播放器）

固定在页面底部的播放器，支持播放列表。

```jsx
<GlobalPlayer
  playlist={episodeList}
  currentIndex={0}
  onIndexChange={(index) => {...}}
/>
```

**功能：**
- 播放列表管理
- 上一曲/下一曲
- 播放列表面板
- 自动播放下一集

### 3. EpisodeCard（节目卡片）

展示单个节目的卡片组件。

```jsx
<EpisodeCard
  episode={episodeData}
  size="medium"  // 'small' | 'medium' | 'large'
  showPlayButton={true}
  onPlay={(episode) => {...}}
/>
```

---

## Notion 数据库配置

为了让主题正常工作，你的 Notion 数据库需要包含以下字段：

| 字段名 | 类型 | 说明 |
|-------|------|------|
| title | Text | 节目标题 |
| summary | Text | 节目摘要 |
| cover | Url | 节目封面图片 |
| category | Select | 栏目分类 |
| tags | Multi-select | 标签 |
| audio | Url | 音频文件链接 |
| duration | Text | 时长（格式：00:00） |
| author | Text | 主创人员 |
| date | Date | 发布日期 |
| content | Rich Text | 节目描述内容 |

---

## 样式自定义

### 修改颜色

编辑 `config.js` 中的 `COLORS` 部分：

```javascript
COLORS: {
  primary: '#000000',      // 主色调
  secondary: '#666666',    // 次要色
  accent: '#ff6b6b',       // 强调色
  background: '#ffffff',   // 背景色
  text: '#333333',         // 文字色
  border: '#e0e0e0',       // 边框色
  hover: '#f5f5f5',        // 悬停背景色
}
```

### 自定义样式

编辑 `style.js` 添加自定义 CSS：

```javascript
const style = `
  /* 自定义样式 */
  .custom-class {
    color: red;
  }
`
```

---

## 常见问题

### Q: 如何修改主题颜色？

A: 编辑 `config.js` 中的 `COLORS` 对象即可。

### Q: 如何添加新的页面布局？

A: 在 `index.js` 中添加新的布局函数，然后在 `blog.config.js` 中配置对应的路由。

### Q: 播放器不显示？

A: 确保：
1. Notion 数据库有 `audio` 字段并填写了音频链接
2. 音频链接可以直接访问
3. 浏览器控制台无报错

### Q: 如何自定义播放器样式？

A: 编辑 `components/AudioPlayer.js` 中的 className 和 `style.js` 中的 CSS。

---

## 故障排除

如果遇到问题，请检查：

1. **NotionNext 版本**：确保使用 4.0+ 版本
2. **配置文件**：检查 `blog.config.js` 中的主题名称是否正确
3. **Notion 数据库**：确保有必要的字段和内容
4. **音频链接**：确保音频 URL 可以直接访问
5. **浏览器控制台**：查看是否有错误信息

---

## 更新日志

### v1.0.0 (2024-09-27)

- ✨ 初始版本发布
- 🎨 完整的 Podcast 主题设计
- 🎵 音频播放器功能
- 📱 全响应式设计
- 🎯 TailwindCSS 支持

---

## 许可证

MIT License

---

## 技术栈

- **React 18+** - UI 框架
- **Next.js** - 全栈框架
- **TailwindCSS** - 样式库
- **NotionNext** - CMS 框架

---

## 需要帮助？

如有问题，请：

1. 检查本文档的 FAQ 部分
2. 查看 [NotionNext 官方文档](https://notionnext.tangly1024.com)
3. 在 GitHub 提交 Issue

---

**祝你使用愉快！** 🎙️🎵
