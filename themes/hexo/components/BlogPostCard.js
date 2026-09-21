import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'
import { useEffect, useState } from 'react'

let currentAudio = null
let currentSrc = null

// 解析 ext：既支持纯链接，也支持 {"audio":"链接"} 格式
const parseAudioFromExt = (ext) => {
  if (!ext) return null
  const raw = typeof ext === 'string' ? ext.trim() : ''
  if (!raw) return null
  // 先尝试 JSON 解析
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.audio) return parsed.audio
  } catch (e) {
    // 不是 JSON，看是不是直接的链接
  }
  // 纯链接判断
  if (raw.startsWith('http')) return raw
  return null
}

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

  const audioUrl = parseAudioFromExt(post.ext)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const handleStateChange = (e) => {
      const { src, playing } = e.detail
      if (src === audioUrl) setIsPlaying(playing)
      else setIsPlaying(false)
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

    // 同一首：暂停/继续
    if (currentSrc === audioUrl && currentAudio) {
      if (currentAudio.paused) {
        currentAudio.play().then(() => broadcastState(audioUrl, true)).catch(() => {})
      } else {
        currentAudio.pause()
        broadcastState(audioUrl, false)
      }
      return
    }

    // 不同首：停旧的，播新的
    if (currentAudio) {
      currentAudio.pause()
      broadcastState(currentSrc, false)
      currentAudio = null
      currentSrc = null
    }

    const audio = new Audio(audioUrl)
    audio
      .play()
      .then(() => {
        currentAudio = audio
        currentSrc = audioUrl
        window.__coverAudio = audio
        broadcastState(audioUrl, true)
      })
      .catch(() => alert('播放失败，请检查音频链接'))

    audio.onended = () => {
      if (currentAudio === audio) {
        currentAudio = null
        currentSrc = null
        window.__coverAudio = null
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
