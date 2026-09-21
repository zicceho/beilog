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
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const handleStateChange = (e) => {
      const { playing, currentSrc } = e.detail
      if (currentSrc === src) {
        setIsPlaying(playing)
      } else {
        setIsPlaying(false)
      }
    }

    const handleTimeUpdate = (e) => {
      const { currentTime, duration, currentSrc } = e.detail
      if (currentSrc === src && duration > 0) {
        setCurrentTime(currentTime)
        setDuration(duration)
        setProgress((currentTime / duration) * 100)
      } else if (currentSrc !== src) {
        setCurrentTime(0)
        setDuration(0)
        setProgress(0)
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
    if (isPlaying) {
      window.dispatchEvent(new CustomEvent('pause-global-audio'))
    } else {
      window.dispatchEvent(
        new CustomEvent('play-global-audio', {
          detail: { src }
        })
      )
    }
  }

  return (
    <div className='my-4 mb-8 flex items-center gap-3 px-1'>
      {/* 播放/暂停按钮 */}
      <button
        onClick={handleClick}
        className='flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors'
        style={{ backgroundColor: '#3A4A7A' }}>
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm text-white ${!isPlaying ? 'ml-[2px]' : ''}`} />
      </button>

      {/* 进度条 + 时间 */}
      <div className='flex-1 flex items-center gap-2'>
        <div className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden'>
          <div
            className='h-full rounded-full transition-all duration-300'
            style={{ width: `${progress}%`, backgroundColor: '#3A4A7A' }}
          />
        </div>
        <span className='text-[10px] text-gray-500 tabular-nums whitespace-nowrap'>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  )
}
