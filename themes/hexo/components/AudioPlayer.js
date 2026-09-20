import { useEffect, useRef, useState } from 'react'
import SmartLink from '@/components/SmartLink'

const formatTime = seconds => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src, cover, title, href }) {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showVolume, setShowVolume] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

  const seekFromClientX = clientX => {
    const audio = audioRef.current
    const bar = progressRef.current
    if (!audio || !bar || !duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const next = ratio * duration
    audio.currentTime = next
    setCurrentTime(next)
  }

  const handlePointerDown = e => {
    e.preventDefault()
    setDragging(true)
    seekFromClientX(e.clientX)
  }
  const handlePointerMove = e => {
    if (dragging) seekFromClientX(e.clientX)
  }
  const handlePointerUp = () => {
    setDragging(false)
  }

  const handleVolumeChange = e => {
    const audio = audioRef.current
    if (!audio) return
    const vol = parseFloat(e.target.value)
    audio.volume = vol
    setVolume(vol)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration || 0)
    const onPlaying = () => {
      setPlaying(true)
      setLoading(false)
    }
    const onPause = () => {
      setPlaying(false)
      setLoading(false)
    }
    const onWaiting = () => setLoading(true)
    const onEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
      audio.currentTime = 0
    }
    const onError = () => {
      setLoading(false)
      setPlaying(false)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [src])

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className='notion-audio-player-wrapper my-4 p-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center gap-3'>
      <audio ref={audioRef} src={src} preload='metadata' />
      
      {/* 方形封面图 */}
      <div className='flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700'>
        {cover ? (
          <img src={cover} alt='封面' className='w-full h-full object-cover' />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white'>
            <i className='fas fa-music text-xl' />
          </div>
        )}
      </div>

      {/* 右侧控制区 */}
      <div className='flex-1 min-w-0 flex flex-col justify-center gap-1.5'>
        {/* 文章标题，可点击跳转 */}
        <div className='flex justify-between items-center text-xs'>
          {href ? (
            <SmartLink href={href} className='font-bold text-gray-700 dark:text-gray-200 truncate hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer transition-colors'>
              {title || '本期节目'}
            </SmartLink>
          ) : (
            <div className='font-bold text-gray-700 dark:text-gray-200 truncate'>{title || '本期节目'}</div>
          )}
        </div>

        {/* 播放按钮 + 进度条 + 时间 */}
        <div className='flex items-center gap-2.5'>
          <button
            onClick={togglePlay}
            className='flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors'
          >
            {loading ? (
              <i className='fas fa-spinner fa-spin text-xs' />
            ) : playing ? (
              <i className='fas fa-pause text-xs' />
            ) : (
              <i className='fas fa-play text-xs' />
            )}
          </button>
          
          <div className='flex-1 min-w-0 flex items-center gap-2'>
            <div
              ref={progressRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer relative'
            >
              <div className='h-full bg-indigo-500 rounded-full' style={{ width: `${progress}%` }} />
            </div>
            <div className='text-[10px] text-gray-500 whitespace-nowrap tabular-nums'>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* 悬浮音量控制 */}
          <div 
            className='relative flex items-center'
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <button className='w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'>
              <i className={`fas ${volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'} text-xs`} />
            </button>
            {showVolume && (
              <div className='absolute bottom-full right-0 mb-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-600 z-50'>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.05'
                  value={volume}
                  onChange={handleVolumeChange}
                  className='w-20 h-1 accent-indigo-500 cursor-pointer'
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
