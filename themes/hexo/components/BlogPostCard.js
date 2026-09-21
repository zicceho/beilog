import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'
import SmartLink from '@/components/SmartLink'

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

  // 拼接跳转链接：有音频则带 autoplay=true 参数
  const jumpHref = audioUrl ? `${post?.href}?autoplay=true` : post?.href

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
          <div className='md:w-[38%] h-56 flex-shrink-0 overflow-hidden relative'>
            {/* 点击封面跳转到详情页，并附带参数 */}
            <SmartLink href={jumpHref}>
              <LazyImage
                priority={index === 1}
                alt={post?.title}
                src={post?.pageCoverThumbnail}
                className='h-56 w-full object-cover object-center group-hover:scale-110 duration-500 cursor-pointer'
              />
              
              {/* 播放按钮：缩小并放置在右下角，纯视觉提示 */}
              {audioUrl && (
                <div className='absolute bottom-2 right-2 z-10 pointer-events-none'>
                  <i className='fa-regular fa-play-circle text-2xl text-white/70 drop-shadow-md' />
                </div>
              )}
            </SmartLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
