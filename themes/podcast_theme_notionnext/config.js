/**
 * Podcast 主题配置文件
 * 在这里配置主题相关的参数、颜色、开关等
 */

const CONFIG = {
  // 主题颜色配置
  COLORS: {
    primary: '#000000',      // 主色调 - 黑色
    secondary: '#666666',    // 次要色 - 灰色
    accent: '#ff6b6b',       // 强调色 - 红色（可选）
    background: '#ffffff',   // 背景色
    text: '#333333',         // 文字色
    border: '#e0e0e0',       // 边框色
    hover: '#f5f5f5',        // 悬停背景色
  },

  // 播放器配置
  PLAYER: {
    enableGlobalPlayer: true,           // 启用全局播放器
    playerPosition: 'bottom',           // 播放器位置: 'bottom' | 'fixed'
    showPlaylistOnHome: true,           // 首页显示播放列表
    autoPlay: false,                    // 自动播放
    defaultVolume: 0.7,                 // 默认音量 0-1
    enableDownload: true,               // 启用下载功能
    enableShare: true,                  // 启用分享功能
    enablePlaybackRate: true,           // 启用播放速度控制
  },

  // 布局配置
  LAYOUT: {
    showSidebar: true,              // 显示侧边栏
    sidebarPosition: 'left',        // 侧边栏位置
    enableBreadcrumb: true,         // 启用面包屑导航
    enableTableOfContents: false,   // 启用目录（文章页）
    maxPostsPerPage: 12,            // 每页最大文章数
  },

  // 首页配置
  HOME: {
    showLatestEpisode: true,        // 显示最新节目
    latestEpisodeCount: 1,          // 显示最新节目数量
    showEpisodeList: true,          // 显示节目列表
    episodeListCount: 10,           // 首页显示节目数量
    showCategoryTags: true,         // 显示分类和标签
  },

  // 文章列表配置
  ARTICLE_LIST: {
    showThumbnail: true,            // 显示缩略图
    showExcerpt: true,              // 显示摘要
    showDate: true,                 // 显示日期
    showCategory: true,             // 显示分类
    showTags: true,                 // 显示标签
    showAuthor: true,               // 显示作者
    showPlayButton: true,           // 显示播放按钮
  },

  // 文章详情页配置
  POST: {
    showTableOfContents: true,      // 显示目录
    showAuthor: true,               // 显示作者
    showDate: true,                 // 显示发布日期
    showCategory: true,             // 显示分类
    showTags: true,                 // 显示标签
    showRelated: true,              // 显示相关文章
    showComments: true,             // 显示评论
    enableCopyCode: true,           // 启用代码复制
  },

  // 导航配置
  NAV: {
    enableSearch: true,             // 启用搜索功能
    enableThemeSwitch: true,        // 启用主题切换
    enableLanguageSwitch: false,    // 启用语言切换
  },

  // 动画配置
  ANIMATION: {
    enableTransition: true,         // 启用过渡动画
    enableHover: true,              // 启用悬停效果
    duration: 300,                  // 动画持续时间(ms)
  },

  // 高级配置
  ADVANCED: {
    lazyLoadImages: true,           // 启用图片懒加载
    enablePjax: false,              // 启用PJAX（需谨慎）
    customCss: '',                  // 自定义CSS
    customJs: '',                   // 自定义JS
  },
}

export default CONFIG
