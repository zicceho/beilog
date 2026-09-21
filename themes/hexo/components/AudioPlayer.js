import { useEffect, useState } from 'react'

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src, cover, title, href }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const handleStateChange = (e) => {
      const { playing, currentSrc } = e.detail
      if (currentSrc === src) setIsPlaying(playing)
      else setIsPlaying(false)
    }

    const handleTimeUpdate = (e) => {
      const { currentTime, duration, currentSrc } = e.detail
      if (currentSrc === src && duration > 0) {
        setProgress((currentTime / duration) * 100)
        setRemaining(Math.max(0, duration - currentTime))
      } else if (currentSrc !== src) {
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
  }, [src])

  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent('play-global-audio', {
        detail: { src, cover, title, href }
      })
    )
  }

  return (
    <div 
      className='my-3 mb-6 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg px-2 py-1.5 transition-colors'
      onClick={handleClick}
    >
      {/* 使用 flex 容器严格包裹图标，强制与进度条垂直居中 */}
      <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center'>
        <i 
          className={`fa-solid ${isPlaying ? 'fa-circle-pause' : 'fa-circle-play'} text-2xl`}
          style={{ color: '#3A4A7A' }}
        />
      </div>

      {/* 渐变进度条，使用 flex-1 以及 items-center 保证高度绝对居中 */}
      <div className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-2xl flex items-center'>
        <div
          className='h-full rounded-full transition-all duration-300'
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #5A6A9A 0%, #3A4A7A 100%)'
          }}
        />
      </div>

      {/* 倒计时 */}
      <span className='text-xs text-gray-400 tabular-nums whitespace-nowrap'>
        {formatTime(remaining)}
      </span>
    </div>
  )
}
