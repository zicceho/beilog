/**
 * Podcast 主题 - 主题入口文件
 * 定义所有页面布局
 * 
 * NotionNext 会自动根据路由展示对应的布局组件
 */

import CONFIG from './config'
import LayoutBase from './components/LayoutBase'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import EpisodeCard from './components/EpisodeCard'
import AudioPlayer from './components/AudioPlayer'
import GlobalPlayer from './components/GlobalPlayer'
import style from './style'

/**
 * 首页布局
 * 展示最新节目、热门节目、分类等
 */
const LayoutIndex = ({ posts = [], categories = [], tags = [] }) => {
  const latestEpisodes = posts.slice(0, CONFIG.HOME.latestEpisodeCount)
  const episodeList = posts.slice(0, CONFIG.HOME.episodeListCount)

  return (
    <LayoutBase>
      {/* 首页 Banner */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">念安酒馆</h1>
          <p className="text-xl text-gray-300">听有你的故事，等有故事的你</p>
        </div>
      </section>

      {/* 最新节目 */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {CONFIG.HOME.showLatestEpisode && latestEpisodes.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-8 text-gray-900">最新节目</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {latestEpisodes.map((post) => (
                <EpisodeCard key={post.id} episode={post} size="large" />
              ))}
            </div>
          </>
        )}

        {/* 节目列表 */}
        {CONFIG.HOME.showEpisodeList && episodeList.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-8 text-gray-900">全部节目</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {episodeList.map((post) => (
                <EpisodeCard key={post.id} episode={post} size="medium" />
              ))}
            </div>
          </>
        )}
      </section>
    </LayoutBase>
  )
}

/**
 * 文章列表布局（用于分类、标签、分页等）
 */
const LayoutPostList = ({ 
  posts = [], 
  currentPage = 1, 
  totalPage = 1,
  category = '',
  tag = ''
}) => {
  const title = category ? `${category} - 节目列表` : tag ? `${tag} - 节目列表` : '节目列表'

  return (
    <LayoutBase>
      {/* 标题 */}
      <section className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">共 {posts.length} 期节目</p>
        </div>
      </section>

      {/* 内容 */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <EpisodeCard key={post.id} episode={post} size="medium" />
          ))}
        </div>

        {/* 分页 */}
        {totalPage > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPage }).map((_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded transition-colors ${
                  currentPage === i + 1
                    ? 'bg-black text-white'
                    : 'border border-gray-300 text-gray-900 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </LayoutBase>
  )
}

/**
 * 文章详情布局
 */
const LayoutSlug = ({ post = {} }) => {
  const {
    title = '未知节目',
    content = '',
    summary = '',
    cover = '',
    date = new Date(),
    category = '',
    tags = [],
    audioUrl = '',
    author = '',
    duration = '00:00',
  } = post

  return (
    <LayoutBase>
      {/* 文章头部 */}
      <article className="max-w-3xl mx-auto px-4 py-16">
        {/* 分类和标签 */}
        <div className="flex items-center gap-4 mb-4">
          {category && (
            <span className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded">
              {category}
            </span>
          )}
          {tags && tags.map((tag) => (
            <span key={tag} className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded">
              #{tag}
            </span>
          ))}
        </div>

        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm py-4 border-y border-gray-200 mb-8">
          {author && (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              {author}
            </span>
          )}
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            </svg>
            {duration}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            </svg>
            {new Date(date).toLocaleDateString('zh-CN')}
          </span>
        </div>

        {/* 播放器 */}
        {audioUrl && (
          <div className="mb-8">
            <AudioPlayer
              src={audioUrl}
              title={title}
              poster={cover}
            />
          </div>
        )}

        {/* 摘要 */}
        {summary && (
          <div className="bg-gray-50 border-l-4 border-black p-4 mb-8">
            <p className="text-gray-700 italic">{summary}</p>
          </div>
        )}

        {/* 文章内容 */}
        <div className="prose prose-sm md:prose lg:prose-lg max-w-none mb-8">
          {content && (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      </article>
    </LayoutBase>
  )
}

/**
 * 分类页面布局
 */
const LayoutCategoryIndex = ({ categories = [] }) => {
  return (
    <LayoutBase>
      <section className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">所有栏目</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.name} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {category.count || 0} 期节目
              </p>
              <a href={`/category/${category.slug}`} className="text-black font-medium hover:underline">
                查看全部 →
              </a>
            </div>
          ))}
        </div>
      </section>
    </LayoutBase>
  )
}

/**
 * 标签页面布局
 */
const LayoutTagIndex = ({ tags = [] }) => {
  return (
    <LayoutBase>
      <section className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">所有标签</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <a
              key={tag.name}
              href={`/tag/${tag.slug}`}
              className="px-4 py-2 bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition-colors font-medium"
            >
              {tag.name} ({tag.count || 0})
            </a>
          ))}
        </div>
      </section>
    </LayoutBase>
  )
}

/**
 * 搜索结果页面布局
 */
const LayoutSearch = ({ posts = [], keyword = '' }) => {
  return (
    <LayoutBase>
      <section className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">
            搜索: {keyword}
          </h1>
          <p className="text-gray-600 mt-2">共找到 {posts.length} 期节目</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <EpisodeCard key={post.id} episode={post} size="medium" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">未找到相关节目</p>
          </div>
        )}
      </section>
    </LayoutBase>
  )
}

/**
 * 归档页面布局
 */
const LayoutArchive = ({ posts = [] }) => {
  // 按年份分组
  const postsByYear = {}
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear()
    if (!postsByYear[year]) {
      postsByYear[year] = []
    }
    postsByYear[year].push(post)
  })

  const years = Object.keys(postsByYear).sort((a, b) => b - a)

  return (
    <LayoutBase>
      <section className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900">归档</h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16">
        {years.map((year) => (
          <div key={year} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{year}</h2>
            <ul className="space-y-4">
              {postsByYear[year].map((post) => (
                <li key={post.id}>
                  <a href={`/${post.slug}`} className="flex items-center gap-4 hover:text-gray-600 transition-colors">
                    <time className="text-gray-600 text-sm whitespace-nowrap">
                      {new Date(post.date).toLocaleDateString('zh-CN')}
                    </time>
                    <span className="text-gray-900 font-medium">{post.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </LayoutBase>
  )
}

/**
 * 404 页面布局
 */
const Layout404 = () => {
  return (
    <LayoutBase>
      <section className="max-w-3xl mx-auto px-4 py-32 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">抱歉，您访问的页面不存在</p>
        <a href="/" className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors">
          返回首页
        </a>
      </section>
    </LayoutBase>
  )
}

/**
 * 占位符布局（用于其他未定义的路由）
 */
const LayoutBase404 = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">页面未找到</h1>
      <p className="text-gray-600 mb-4">该页面布局暂未定义</p>
    </div>
  </div>
)

// 导出所有布局组件和配置
export {
  LayoutIndex,
  LayoutPostList,
  LayoutSlug,
  LayoutCategoryIndex,
  LayoutTagIndex,
  LayoutSearch,
  LayoutArchive,
  Layout404,
  CONFIG as THEME_CONFIG
}
