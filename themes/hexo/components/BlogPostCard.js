import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'
import { useEffect, useState } from 'react'

// 模块级全局状态：保证同一时间只有一个音频在播放，且暂停后能恢复
let currentAudio = null
let currentSrc = null

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

  // 解析 ext 字段
  let audioUrl = null
  if (post.ext) {
    try {
      const extData = typeof post.ext === 'string' ? JSON.parse(post.ext) : post.ext
      audioUrl = extData?.audio || null
    } catch (e) {
      audioUrl = null
    }
  }

  const [isPlaying, setIsPlaying] = useState(false)

  // 监听全局音频状态，同步当前卡片图标
  useEffect(() => {
    const handleStateChange = (e) => {
      const { src, playing } = e.detail
      if (src === audioUrl) {
        setIsPlaying(playing)
      } else {
        setIsPlaying(false)
      }
    }
    window.addEventListener('cover-audio-state-change', handleStateChange)
    return () => window.removeEventListener('cover-audio-state-change', handleStateChange)
  }, [audioUrl])

  const broadcastState = (src, playing) => {
    window.dispatchEvent(
      new CustomEvent('cover-audio-state-change', { detail: { src, playing } })
    )
  }

  const handleCoverClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!audioUrl) {
      alert('暂无音频节目，请点击标题查看文稿')
      return
    }

    // 情况1：点击的是同一个音频
    if (currentSrc === audioUrl && currentAudio) {
      if (currentAudio.paused) {
        // 暂停中 → 继续播放
        currentAudio.play().then(() => broadcastState(audioUrl, true)).catch(() => {})
      } else {
        // 播放中 → 暂停（保留实例，不销毁）
        currentAudio.pause()
        broadcastState(audioUrl, false)
      }
      return
    }

    // 情况2：点击的是不同音频，先停掉旧的
    if (currentAudio) {
      currentAudio.pause()
      broadcastState(currentSrc, false)
      currentAudio = null
      currentSrc = null
    }

    // 情况3：播放新音频
    const audio = new Audio(audioUrl)
    audio
      .play()
      .then(() => {
        currentAudio = audio
        currentSrc = audioUrl
        broadcastState(audioUrl, true)
      })
      .catch(() => {
        alert('播放失败，请检查音频链接')
      })

    audio.onended = () => {
      if (currentAudio === audio) {
        currentAudio = null
        currentSrc = null
        broadcastState(audioUrl, false)
      }
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
            <div className='absolute bottom-2 right-2 z-10 pointer-events-none'>
              <i
                className={`fa-solid ${isPlaying ? 'fa-circle-pause' : 'fa-circle-play'} text-2xl text-white/70 drop-shadow-lg transition-colors`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
