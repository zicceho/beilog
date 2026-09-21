import { useEffect, useState } from 'react'

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 默认音频链接（无音频时播放）
const DEFAULT_AUDIO_URL = 'https://na.885111.xyz/faq'

export default function AudioPlayer({ src, cover, title, href, siteInfo }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [remaining, setRemaining] = useState(0)

  // 有传入的音频则使用，否则使用默认音频
  const hasAudio = !!src
  const audioSrc = src || DEFAULT_AUDIO_URL

  useEffect(() => {
    const handleStateChange = (e) => {
      const { playing, currentSrc } = e.detail
      if (currentSrc === audioSrc) setIsPlaying(playing)
      else setIsPlaying(false)
    }

    const handleTimeUpdate = (e) => {
      const { currentTime, duration, currentSrc } = e.detail
      if (currentSrc === audioSrc && duration > 0) {
        setProgress((currentTime / duration) * 100)
        setRemaining(Math.max(0, duration - currentTime))
      } else if (currentSrc !== audioSrc) {
        setProgress(0)
        setRemaining(0)
      }
    }

    window.addEventListener('audio-play-state-change', handleStateChange)
    window.addEventListener('audio-time-update', handleTimeUpdate)
    return () => {
      window.removeEventListener('audio-play-state-change', handleStateChange)
      window.removeEventListener('audio-time-update', handleTimeUpdate)
    }
  }, [audioSrc])

  const handleClick = () => {
    // 始终使用 audioSrc 触发播放
    window.dispatchEvent(
      new CustomEvent('toggle-global-audio', {
        detail: { src: audioSrc, cover, title, href }
      })
    )
  }

  return (
    <div 
      className='my-3 mb-6 flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5'
      onClick={handleClick}
    >
      <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center leading-none'>
        <i 
          className={`fa-solid ${isPlaying ? 'fa-circle-pause' : 'fa-circle-play'} text-2xl`}
          style={{ color: '#3A4A7A' }}
        />
      </div>

      {/* 进度条自适应宽度，translate-y 微调对齐 */}
      <div className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex items-center translate-y-[1px]'>
        <div
          className='h-full rounded-full transition-all duration-300'
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #5A6A9A 0%, #3A4A7A 100%)'
          }}
        />
      </div>

      <span className='text-xs text-gray-400 tabular-nums whitespace-nowrap'>
        {formatTime(remaining)}
      </span>
    </div>
  )
}
