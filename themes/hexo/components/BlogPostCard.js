import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'
import SmartLink from '@/components/SmartLink'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview =
    siteConfig('HEXO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  if (post && !post.pageCoverThumbnail && siteConfig('HEXO_POST_LIST_COVER_DEFAULT', null, CONFIG)) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }
  const showPageCover =
    siteConfig('HEXO_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail &&
    !showPreview

  // 解析 ext 字段，拿到音频链接
  let audioUrl = null
  if (post.ext) {
    try {
      const extData = typeof post.ext === 'string' ? JSON.parse(post.ext) : post.ext
      audioUrl = extData?.audio
    } catch (e) {
      // 解析失败就忽略，不影响页面
    }
  }

  // 点击封面图：有音频就播放，没有就提示
  const handleCoverClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play().catch(() => {
        alert('播放失败，请检查音频链接')
      })
    } else {
      alert('暂无音频节目，请点击标题查看文稿')
    }
  }

  return (
    <div className={`${siteConfig('HEXO_POST_LIST_COVER_HOVER_ENLARGE', null, CONFIG) ? ' hover:scale-110 transition-all duration-150' : ''}`}>
      <div
        key={post.id}
        id='blog-post-card'
        className={`group md:h-56 w-full flex justify-start md:gap-2 md:flex-row-reverse flex-col-reverse shadow-sm overflow-hidden border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray`}>
        <BlogPostCardInfo
          index={index}
          post={post}
          showPageCover={showPageCover}
          showPreview={showPreview}
          showSummary={showSummary}
        />

        {showPageCover && (
          <div
            className='md:w-[38%] h-56 flex-shrink-0 overflow-hidden relative cursor-pointer'
            onClick={handleCoverClick}>
            <LazyImage
              priority={index === 1}
              alt={post?.title}
              src={post?.pageCoverThumbnail}
              className='h-56 w-full object-cover object-center group-hover:scale-110 duration-500'
            />
            {/* 右下角播放图标 */}
            <div className='absolute bottom-2 right-2 z-10 pointer-events-none'>
              <i className='fa-solid fa-circle-play text-2xl text-white/60 drop-shadow-lg' />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
