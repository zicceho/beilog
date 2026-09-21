import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'
import { useEffect, useState } from 'react'

// 模块级：记录当前全局正在播放的音频实例与链接，保证同一时间只有一个
let globalAudioInstance = null
let currentAudioSrc = null

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
      // 解析失败忽略
    }
  }

  const [isPlaying, setIsPlaying] = useState(false)

  // 监听全局播放状态，同步当前卡片的图标
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

    // 情况1：点击的是当前正在播放的 -> 暂停
    if (currentAudioSrc === audioUrl && globalAudioInstance) {
      globalAudioInstance.pause()
      globalAudioInstance = null
      currentAudioSrc = null
      broadcastState(audioUrl, false)
      return
    }

    // 情况2：有其他音频正在播放 -> 先停掉它
    if (globalAudioInstance) {
      globalAudioInstance.pause()
      broadcastState(currentAudioSrc, false)
      globalAudioInstance = null
      currentAudioSrc = null
    }

    // 情况3：开始播放新音频
    const audio = new Audio(audioUrl)
    audio
      .play()
      .then(() => {
        globalAudioInstance = audio
        currentAudioSrc = audioUrl
        broadcastState(audioUrl, true)
      })
      .catch(() => {
        alert('播放失败，请检查音频链接')
      })

    // 播放结束自动复位
    audio.onended = () => {
      if (globalAudioInstance === audio) {
        globalAudioInstance = null
        currentAudioSrc = null
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
            {/* 右下角图标：播放时显示暂停，暂停时显示播放 */}
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
