import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'
import { useEffect, useState } from 'react'

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
  const [isPlaying, setIsPlaying] = useState(false)

  // 监听全局播放状态
  useEffect(() => {
    const handleStateChange = (e) => {
      const { playing, currentSrc } = e.detail
      if (currentSrc === audioUrl) {
        setIsPlaying(playing)
      } else {
        setIsPlaying(false)
      }
    }
    window.addEventListener('audio-play-state-change', handleStateChange)
    return () =>
      window.removeEventListener('audio-play-state-change', handleStateChange)
  }, [audioUrl])

  const handleCoverClick = (e) => {
    if (audioUrl) {
      // 有音频：阻止跳转，只控制播放/暂停
      e.preventDefault()
      e.stopPropagation()
      if (isPlaying) {
        window.dispatchEvent(new CustomEvent('pause-global-audio'))
      } else {
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
    } else {
      // 没有音频：阻止跳转，什么都不做（或者你也可以弹出提示）
      e.preventDefault()
      e.stopPropagation()
      // 可选：在这里加入“暂无音频节目”的提示逻辑
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
          <div
            className='md:w-[38%] h-56 flex-shrink-0 overflow-hidden relative cursor-pointer'
            onClick={handleCoverClick}>
            {/* 这里用 div 替代了 SmartLink，确保点击图片不跳转 */}
            <LazyImage
              priority={index === 1}
              alt={post?.title}
              src={post?.pageCoverThumbnail}
              className='h-56 w-full object-cover object-center group-hover:scale-110 duration-500'
            />
            
            {/* APlayer 式动效按钮：居中变大 <-> 右下角变小 */}
            <div
              className={`absolute z-10 transition-all duration-300 ease-in-out pointer-events-none ${
                isPlaying
                  ? 'bottom-2 right-2 w-8 h-8'
                  : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12'
              } rounded-full border-[1.5px] border-white/60 bg-black/20 backdrop-blur-md flex items-center justify-center shadow-lg`}>
              <i
                className={`fas ${
                  isPlaying ? 'fa-pause text-xs' : 'fa-play text-lg ml-[2px]'
                } text-white/90`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
