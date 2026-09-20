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

  return (
    <div
      className={`${siteConfig('HEXO_POST_LIST_COVER_HOVER_ENLARGE', null, CONFIG) ? ' hover:scale-110 transition-all duration-150' : ''}`}>
      <div
        key={post.id}
        id='blog-post-card'
        // ⚠️ 注意看这里：md:h-56 改成了 md:h-48（只改桌面端高度），手机端没有任何前缀，保持原样
        className={`group md:h-48 w-full flex justify-between md:flex-row-reverse flex-col-reverse shadow-sm overflow-hidden border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray`}>
        {/* 文字内容 */}
        <BlogPostCardInfo
          index={index}
          post={post}
          showPageCover={showPageCover}
          showPreview={showPreview}
          showSummary={showSummary}
        />

        {/* 图片封面 */}
        {showPageCover && (
          // ⚠️ 注意看这里：md:w-5/12 改成了 md:w-1/2（只改桌面端宽度占比）
          <div className='md:w-1/2 overflow-hidden'>
            <SmartLink href={post?.href}>
              <>
                <LazyImage
                  priority={index === 1}
                  alt={post?.title}
                  src={post?.pageCoverThumbnail}
                  // ⚠️ 注意看这里：原先是 h-56，现在是 h-56 md:h-48，意思是：手机端维持 224px 高，电脑端变成 192px 高
                  className='h-56 md:h-48 w-full object-cover object-center group-hover:scale-110 duration-500'
                />
              </>
            </SmartLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
