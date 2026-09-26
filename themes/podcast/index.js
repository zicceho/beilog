import Comment from '@/components/Comment'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import ArticleCopyright from './components/ArticleCopyright'
import ArticleRecommend from './components/ArticleRecommend'
import ArticleAdjacent from './components/ArticleAdjacent'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Style } from './style'
import CONFIG from './config'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import EpisodeCard from './components/EpisodeCard'
import NoteCard from './components/NoteCard'
import AudioPlayer, { getAudioUrl } from './components/AudioPlayer'
import GlobalAudioPlayer from './components/GlobalAudioPlayer'
import NotionAudioEnhancer from './components/NotionAudioEnhancer'
import SearchBox from './components/SearchBox'
import Pagination from './components/Pagination'
import ArticleLock from './components/ArticleLock'
import RightFloatArea from './components/RightFloatArea'

function LayoutBase(props) {
  const { children, siteInfo, slotTop, rightAreaSlot, className, hideSidebar } = props
  const { fullWidth } = useGlobal()
  const showSidebar = !hideSidebar && !fullWidth && siteConfig('NIANAN_SIDEBAR_ENABLE', true, CONFIG)
  return (
    <div id='theme-podcast' className={className || ''}>
      <Style />
      <Header {...props} />
      {slotTop && <div className='nianan-slot-top'>{slotTop}</div>}
      <main className={`nianan-main ${fullWidth ? 'nianan-main--full' : ''}`}>
        <div className='nianan-shell'>
          <div className='nianan-content'>{children}</div>
          {showSidebar && <Sidebar {...props} />}
        </div>
      </main>
      <Footer {...props} siteInfo={siteInfo} />
      <GlobalAudioPlayer posts={props.posts || []} siteInfo={siteInfo} />
      <RightFloatArea post={props.post} posts={props.posts || []} />
      {rightAreaSlot}
    </div>
  )
}

function getEpisodePosts(posts = []) {
  return posts.filter(post => Boolean(getAudioUrl(post)))
}

function getNotePosts(posts = []) {
  return posts.filter(post => !getAudioUrl(post))
}

function PageHeader({ eyebrow, title, description }) {
  return (
    <header className='nianan-page-header'>
      {eyebrow && <div className='nianan-page-eyebrow'>{eyebrow}</div>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  )
}

function EpisodeSection({ posts, limit }) {
  const items = posts.slice(0, limit)
  if (!items.length) return null
  return (
    <section className='nianan-section'>
      <div className='nianan-section-heading'>
        <h2>最新节目</h2>
        <SmartLink href={siteConfig('NIANAN_EPISODES_PATH', '/archive', CONFIG)}>更多</SmartLink>
      </div>
      <div>
        {items.map(post => <EpisodeCard key={post.id} post={post} />)}
      </div>
    </section>
  )
}

function NotesSection({ posts, limit }) {
  const items = posts.slice(0, limit)
  if (!items.length) return null
  return (
    <section className='nianan-section'>
      <div className='nianan-section-heading'>
        <h2>最新文章</h2>
        <SmartLink href={siteConfig('NIANAN_NOTES_PATH', '/category/笔记', CONFIG)}>更多</SmartLink>
      </div>
      <div>
        {items.map(post => <NoteCard key={post.id} post={post} />)}
      </div>
    </section>
  )
}

function LayoutIndex(props) {
  const { posts = [], siteInfo } = props
  const episodes = getEpisodePosts(posts)
  const notes = getNotePosts(posts)
  const featured = episodes[0] || posts[0]

  return (
    <LayoutBase {...props} siteInfo={siteInfo} hideSidebar>
      {siteConfig('NIANAN_HOME_SHOW_FEATURED', true, CONFIG) && featured && (
        <section className='nianan-featured'>
          <div className='nianan-section-label'>最新节目</div>
          <h1>
            <SmartLink href={featured.href || '#'}>{featured.title}</SmartLink>
          </h1>
          <div className='nianan-entry-meta'>
            {featured.publishDay && <span>{featured.publishDay}</span>}
            {featured.category && <span>{featured.category}</span>}
          </div>
          {getAudioUrl(featured) && <AudioPlayer post={featured} />}
          {featured.summary && <p>{featured.summary}</p>}
          {getAudioUrl(featured) && <div className='nianan-platform-links'>{[
            ['iTunes', 'NIANAN_SUBSCRIBE_ITUNES'],
            ['Android', 'NIANAN_SUBSCRIBE_ANDROID'],
            ['Spotify', 'NIANAN_SUBSCRIBE_SPOTIFY'],
            ['小宇宙', 'NIANAN_SUBSCRIBE_XIAOYUZHOU'],
            ['网易云音乐', 'NIANAN_SUBSCRIBE_NETEASE'],
            ['喜马拉雅', 'NIANAN_SUBSCRIBE_XIMALAYA']
          ].map(([label, key]) => {
            const href = siteConfig(key, '', CONFIG)
            return href ? <a key={label} href={href} target='_blank' rel='noreferrer'>{label}</a> : null
          })}</div>}
        </section>
      )}

      <EpisodeSection posts={episodes.length ? episodes : posts} limit={siteConfig('NIANAN_HOME_EPISODES_LIMIT', 8, CONFIG)} />
      <NotesSection posts={notes} limit={siteConfig('NIANAN_HOME_NOTES_LIMIT', 6, CONFIG)} />
    </LayoutBase>
  )
}

function LayoutPostList(props) {
  const { posts = [], category, tag, page = 1, postCount = posts.length } = props
  const POSTS_PER_PAGE = Number(siteConfig('POSTS_PER_PAGE', 12, CONFIG)) || 12
  const totalPage = Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE))
  const title = category ? category : tag ? `#${tag}` : '节目'

  return (
    <LayoutBase {...props}>
      <PageHeader title={title} />
      <section className='nianan-section nianan-list-page'>
        {posts.map(post => (
          getAudioUrl(post)
            ? <EpisodeCard key={post.id} post={post} />
            : <NoteCard key={post.id} post={post} />
        ))}
        <Pagination page={page} totalPage={totalPage} />
      </section>
    </LayoutBase>
  )
}

function LayoutSearch(props) {
  const router = useRouter()
  const { keyword } = props
  const currentKeyword = keyword || router.query?.keyword || ''

  return (
    <LayoutBase {...props}>
      <PageHeader eyebrow='搜索' title={currentKeyword ? `搜索：${currentKeyword}` : '搜索'} />
      <SearchBox keyword={currentKeyword} />
      <section className='nianan-section nianan-list-page'>
        {(props.posts || []).map(post => (
          getAudioUrl(post)
            ? <EpisodeCard key={post.id} post={post} />
            : <NoteCard key={post.id} post={post} />
        ))}
        {(!props.posts || props.posts.length === 0) && <p className='nianan-empty'>没有找到相关内容。</p>}
      </section>
    </LayoutBase>
  )
}

function LayoutArchive(props) {
  const archivePosts = props.archivePosts || {}
  const allPosts = Object.values(archivePosts).flatMap(value => Array.isArray(value) ? value : [])
  const episodes = allPosts.filter(post => getAudioUrl(post))
  const items = episodes.length ? episodes : allPosts
  return (
    <LayoutBase {...props}>
      <PageHeader eyebrow='节目' title='播客' />
      <div className='nianan-subscribe-line'>
        <span>订阅</span>
        <div>
          {siteConfig('NIANAN_SUBSCRIBE_ITUNES', '', CONFIG) && <a href={siteConfig('NIANAN_SUBSCRIBE_ITUNES', '', CONFIG)} target='_blank' rel='noreferrer'>iTunes</a>}
          {siteConfig('NIANAN_SUBSCRIBE_XIAOYUZHOU', '', CONFIG) && <a href={siteConfig('NIANAN_SUBSCRIBE_XIAOYUZHOU', '', CONFIG)} target='_blank' rel='noreferrer'>小宇宙</a>}
          {siteConfig('NIANAN_SUBSCRIBE_SPOTIFY', '', CONFIG) && <a href={siteConfig('NIANAN_SUBSCRIBE_SPOTIFY', '', CONFIG)} target='_blank' rel='noreferrer'>Spotify</a>}
          {siteConfig('NIANAN_SUBSCRIBE_NETEASE', '', CONFIG) && <a href={siteConfig('NIANAN_SUBSCRIBE_NETEASE', '', CONFIG)} target='_blank' rel='noreferrer'>网易云音乐</a>}
          {siteConfig('NIANAN_SUBSCRIBE_XIMALAYA', '', CONFIG) && <a href={siteConfig('NIANAN_SUBSCRIBE_XIMALAYA', '', CONFIG)} target='_blank' rel='noreferrer'>喜马拉雅</a>}
          {siteConfig('NIANAN_SUBSCRIBE_RSS', '', CONFIG) && <a href={siteConfig('NIANAN_SUBSCRIBE_RSS', '', CONFIG)} target='_blank' rel='noreferrer'>RSS</a>}
        </div>
      </div>
      <section className='nianan-section nianan-list-page'>
        {items.map(post => <EpisodeCard key={post.id} post={post} />)}
      </section>
    </LayoutBase>
  )
}

function LayoutCategoryIndex(props) {
  const { categoryOptions = [] } = props
  return (
    <LayoutBase {...props}>
      <PageHeader eyebrow='栏目' title='栏目' />
      <div className='nianan-index-list'>
        {categoryOptions.map(category => (
          <SmartLink key={category.name} href={category.href || `/category/${encodeURIComponent(category.name)}`}>
            <strong>{category.name}</strong><span>{category.count}</span>
          </SmartLink>
        ))}
      </div>
    </LayoutBase>
  )
}

function LayoutTagIndex(props) {
  const { tagOptions = [] } = props
  return (
    <LayoutBase {...props}>
      <PageHeader eyebrow='标签' title='标签' />
      <div className='nianan-index-list nianan-tag-list'>
        {tagOptions.map(tag => (
          <SmartLink key={tag.name} href={tag.href || `/tag/${encodeURIComponent(tag.name)}`}>
            <strong>#{tag.name}</strong><span>{tag.count}</span>
          </SmartLink>
        ))}
      </div>
    </LayoutBase>
  )
}

function LayoutSlug(props) {
  const { post, lock, validPassword } = props
  const waitingMs = Number(siteConfig('POST_WAITING_TIME_FOR_404', 1)) * 1000
  const router = useRouter()

  useEffect(() => {
    if (post || lock) return
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && !document.querySelector('#notion-article')) {
        router.push('/404')
      }
    }, waitingMs)
    return () => clearTimeout(timer)
  }, [post, lock, router, waitingMs])

  if (lock) {
    return (
      <LayoutBase {...props}>
        <ArticleLock validPassword={validPassword} />
      </LayoutBase>
    )
  }

  if (!post) return <Layout404 {...props} />

  const audioUrl = getAudioUrl(post)
  return (
    <LayoutBase {...props}>
      <article className='nianan-article'>
        {siteConfig('NIANAN_ARTICLE_COVER', false, CONFIG) && post.pageCover && (
          <img className='nianan-article-cover' src={post.pageCover} alt='' />
        )}

        <header className='nianan-article-header'>
          {post.category && <SmartLink href={`/category/${encodeURIComponent(post.category)}`} className='nianan-entry-category'>{post.category}</SmartLink>}
          <h1>{post.title}</h1>
          <div className='nianan-article-meta'>
            {post.publishDay && <span>{post.publishDay}</span>}
            {post.lastEditedDay && <span>更新于 {post.lastEditedDay}</span>}
            {post.tagItems?.length > 0 && <span>{post.tagItems.map(tag => `#${tag.name}`).join(' ')}</span>}
          </div>
        </header>

        {audioUrl && <AudioPlayer post={post} />}

        <div id='article-wrapper' className='nianan-article-body'>
          <NotionPage post={post} />
          <NotionAudioEnhancer post={post} />
          {siteConfig('NIANAN_ARTICLE_SHARE', true, CONFIG) && <ShareBar post={post} />}
          {siteConfig('NIANAN_ARTICLE_COPYRIGHT', false, CONFIG) && <ArticleCopyright post={post} />}
          {siteConfig('NIANAN_ARTICLE_RECOMMEND', false, CONFIG) && (
            <ArticleRecommend recommendPosts={props.recommendPosts} siteInfo={props.siteInfo} />
          )}
          {siteConfig('NIANAN_ARTICLE_ADJACENT', true, CONFIG) && (
            <ArticleAdjacent prev={props.prev} next={props.next} />
          )}
        </div>
        {siteConfig('NIANAN_ARTICLE_COMMENT', true, CONFIG) && <Comment frontMatter={post} />}
      </article>
    </LayoutBase>
  )
}

function Layout404(props) {
  return (
    <LayoutBase {...props}>
      <section className='nianan-404'>
        <div>404</div>
        <p>这页暂时找不到了。</p>
        <SmartLink href='/'>回到首页</SmartLink>
      </section>
    </LayoutBase>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
