import { useEffect, useRef, useState } from 'react'

const formatRemaining = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `-${mins}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      const dur = audio.duration || 0
      if (dur > 0) {
        setProgress((audio.currentTime / dur) * 100)
        setRemaining(Math.max(0, dur - audio.currentTime))
      }
    }
    const onLoadedMetadata = () => {
      if (audio.duration) {
        setRemaining(audio.duration)
      }
    }
    const onPlaying = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      setIsPlaying(false)
      setProgress(100)
      setRemaining(0)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [src])

  const togglePlay = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  const handleProgressClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // 点击进度条 → 弹出全局播放器（以后接全局用）
    window.dispatchEvent(
      new CustomEvent('open-global-player', {
        detail: { src }
      })
    )
  }

  return (
    <div className='my-4 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700'>
      <audio ref={audioRef} src={src} preload='metadata' />

      {/* 播放/暂停：保持现在的 SVG 图标样式 */}
      <button
        onClick={togglePlay}
        className='flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105'
        style={{ backgroundColor: '#3A4A7A' }}
        aria-label={isPlaying ? '暂停' : '播放'}>
        {isPlaying ? (
          <svg width='14' height='14' viewBox='0 0 24 24' fill='white'>
            <rect x='6' y='4' width='4' height='16' rx='1' />
            <rect x='14' y='4' width='4' height='16' rx='1' />
          </svg>
        ) : (
          <svg width='14' height='14' viewBox='0 0 24 24' fill='white' style={{ marginLeft: '2px' }}>
            <path d='M8 5v14l11-7z' />
          </svg>
        )}
      </button>

      {/* 进度条：不可拖，点击 → 弹出全局播放器 */}
      <div
        onClick={handleProgressClick}
        className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer'>
        <div
          className='h-full rounded-full transition-all duration-300'
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #5A6A9A 0%, #3A4A7A 100%)' }}
        />
      </div>

      {/* 右侧倒计时 */}
      <span className='text-xs text-gray-500 tabular-nums whitespace-nowrap'>
        {formatRemaining(remaining)}
      </span>
    </div>
  )
}
