import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
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
    e.preventDefault()
    e.stopPropagation()

    if (audioUrl) {
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
      alert('暂无音频节目，点击标题查看文稿')
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
            <LazyImage
              priority={index === 1}
              alt={post?.title}
              src={post?.pageCoverThumbnail}
              className='h-56 w-full object-cover object-center group-hover:scale-110 duration-500'
            />
            
            <div
              className={`absolute z-10 pointer-events-none transition-all duration-300 ease-in-out ${
                isPlaying
                  ? 'bottom-2 right-2'
                  : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
              }`}>
              <i
                className={`fa-regular ${
                  isPlaying
                    ? 'fa-pause-circle text-3xl'
                    : 'fa-play-circle text-5xl'
                } text-white/70 drop-shadow-lg`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
