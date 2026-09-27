/**
 * Podcast 主题 - 样式文件
 * 这里定义主题特有的样式
 */

const style = `
/* ==================== 全局样式 ==================== */
:root {
  --primary-color: #000000;
  --secondary-color: #666666;
  --border-color: #e0e0e0;
  --hover-bg: #f5f5f5;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  color: #333333;
  background-color: #ffffff;
}

/* ==================== 音频播放器 ==================== */
.podcast-player {
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.podcast-player-progress {
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(to right, #000000 0%, #000000 var(--progress), #e0e0e0 var(--progress), #e0e0e0 100%);
  cursor: pointer;
}

.podcast-player-progress::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #000000;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.podcast-player-progress::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #000000;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* ==================== 全局播放器 ==================== */
.global-player {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ==================== 卡片样式 ==================== */
.episode-card {
  transition: all 0.3s ease;
}

.episode-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.episode-card-cover {
  aspect-ratio: 1;
  overflow: hidden;
  background-color: #f5f5f5;
}

.episode-card-cover img {
  transition: transform 0.3s ease;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.episode-card:hover .episode-card-cover img {
  transform: scale(1.05);
}

/* ==================== 文章列表 ==================== */
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .post-list {
    grid-template-columns: 1fr;
  }
}

/* ==================== 分类和标签 ==================== */
.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #f5f5f5;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #666666;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-tag:hover {
  background-color: #e0e0e0;
  color: #333333;
}

/* ==================== 链接样式 ==================== */
a {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #666666;
}

/* ==================== 代码块 ==================== */
pre {
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  line-height: 1.5;
}

code {
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.875rem;
}

/* ==================== 引用 ==================== */
blockquote {
  border-left: 3px solid var(--primary-color);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #666666;
  font-style: italic;
}

/* ==================== 表格 ==================== */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

table th,
table td {
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  text-align: left;
}

table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

/* ==================== 滚动条 ==================== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cccccc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999999;
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 768px) {
  body {
    font-size: 16px;
  }

  h1 {
    font-size: 1.75rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }
}

/* ==================== 打印样式 ==================== */
@media print {
  .global-player,
  .no-print {
    display: none !important;
  }

  a {
    text-decoration: underline;
  }
}
`

export default style
