import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview =
    siteConfig('HEXO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  if (
    post &&
    !post.pageCoverThumbnail &&
    siteConfig('HEXO_POST_LIST_COVER_DEFAULT', null, CONFIG)
  ) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }
  const showPageCover =
    siteConfig('HEXO_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail &&
    !showPreview

  const audioUrl = post?.audio || post?.Audio

  const handleCoverClick = (e) => {
    if (audioUrl) {
      e.preventDefault()
      window.dispatchEvent(
        new CustomEvent('play-global-audio', {
          detail: {
            src: audioUrl,
            cover: post.pageCoverThumbnail || post.pageCover,
            title: post.title,
            href: post.href,
            category: post.category
          }
        })
      )
    }
  }

  return (
    <div
      className={`${siteConfig('HEXO_POST_LIST_COVER_HOVER_ENLARGE', null, CONFIG) ? ' hover:scale-110 transition-all duration-150' : ''}`}>
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
          <div className='md:w-5/12 overflow-hidden relative'>
            <SmartLink href={post?.href} onClick={handleCoverClick}>
              <LazyImage
                priority={index === 1}
                alt={post?.title}
                src={post?.pageCoverThumbnail}
                className='h-56 w-full object-cover object-center group-hover:scale-110 duration-500'
              />
              
              {/* 右下角半透明玻璃质感播放图标 */}
              <div className='absolute bottom-2 right-2 z-10 pointer-events-none'>
                <i className='fa-regular fa-play-circle text-4xl text-white/40 group-hover:text-white/80 transition-colors duration-300 drop-shadow-md' />
              </div>
            </SmartLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
