import { useEffect, useState } from 'react'

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src }) {
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

  // 点击整个胶囊条，唤起全局播放器
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('play-global-audio', { detail: { src } }))
  }

  return (
    <div className='my-3 mb-6 flex justify-start'>
      <div
        onClick={handleClick}
        className='inline-flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]'
        style={{
          background: 'linear-gradient(135deg, #5A6A9A 0%, #3A4A7A 100%)'
        }}
      >
        {/* 播放/暂停按钮 */}
        <i className={`fa ${isPlaying ? 'fa-pause-circle-o' : 'fa-play-circle-o'} text-white text-2xl`} />

        {/* 白色半透明进度条 */}
        <div className='w-40 h-1 bg-white/30 rounded-full overflow-hidden'>
          <div
            className='h-full bg-white rounded-full transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 倒计时 */}
        <span className='text-xs text-white/90 tabular-nums whitespace-nowrap'>
          {formatTime(remaining)}
        </span>
      </div>
    </div>
  )
}
