import { useEffect, useState } from 'react'

export default function AudioPlayer({ src, cover, title, href, category }) {
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

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
    const total = Math.floor(seconds)
    const mins = Math.floor(total / 60)
    const secs = total % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleClick = () => {
    if (isPlaying) {
      // 如果正在播放，点击让全局播放器弹出
      window.dispatchEvent(new CustomEvent('expand-global-audio'))
    } else {
      // 如果暂停，点击开始播放
      window.dispatchEvent(
        new CustomEvent('play-global-audio', {
          detail: { src, cover, title, href, category }
        })
      )
    }
  }

  return (
    <div className='notion-audio-player-wrapper my-4 mb-6 p-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md cursor-pointer' onClick={handleClick}>
      <div className='relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group'>
        {cover ? (
          <img src={cover} alt='封面' className='w-full h-full object-cover' />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white'>
            <i className='fas fa-music text-2xl' />
          </div>
        )}
        {/* 透明圆环 + 居中三角形 */}
        <div className='absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors'>
          <div className='w-12 h-12 rounded-full border border-white/70 bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg'>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xl text-white ${!isPlaying ? 'translate-x-[2px]' : ''}`} />
          </div>
        </div>
      </div>

      <div className='min-w-0 flex-1 flex flex-col justify-center gap-1.5'>
        <div className='font-bold text-base text-gray-800 dark:text-gray-100 truncate'>
          {title || '本期节目'}
        </div>
        {/* 不可拖动进度条 */}
        <div className='flex items-center gap-2 mt-1'>
          <span className='text-[10px] text-gray-500 tabular-nums w-8 text-right'>{formatTime(currentTime)}</span>
          <div className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full relative pointer-events-none'>
            <div className='h-full bg-indigo-500 rounded-full transition-all duration-300' style={{ width: `${progress}%` }} />
          </div>
          <span className='text-[10px] text-gray-500 tabular-nums w-8'>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
