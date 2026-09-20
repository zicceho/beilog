import { useEffect, useRef, useState } from 'react'

const formatTime = seconds => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src, cover }) {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
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
    <div className='notion-audio-player-wrapper my-4 p-4 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex gap-4'>
      <audio ref={audioRef} src={src} preload='metadata' />
      {cover && (
        <div className='flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700'>
          <img src={cover} alt='封面' className='w-full h-full object-cover' />
        </div>
      )}
      <div className='flex-1 min-w-0 flex flex-col justify-between'>
        <div className='mb-2'>
          <div className='text-sm font-bold text-gray-800 dark:text-gray-200'>念安酒馆</div>
          <div className='text-xs text-gray-500 dark:text-gray-400'>本期节目</div>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={togglePlay}
            className='flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors'
            aria-label={playing ? '暂停' : '播放'}
          >
            {loading ? (
              <i className='fas fa-spinner fa-spin' />
            ) : playing ? (
              <i className='fas fa-pause' />
            ) : (
              <i className='fas fa-play' />
            )}
          </button>
          <div className='flex-1 min-w-0'>
            <div
              ref={progressRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className='h-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer relative'
            >
              <div className='h-full bg-indigo-500 rounded-full' style={{ width: `${progress}%` }} />
            </div>
            <div className='flex justify-between text-xs text-gray-500 mt-1 tabular-nums'>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <i className='fas fa-volume-up text-gray-400 text-sm' />
          <input
            type='range'
            min='0'
            max='1'
            step='0.05'
            value={volume}
            onChange={handleVolumeChange}
            className='w-24 h-1 accent-indigo-500'
            aria-label='音量调节'
          />
        </div>
      </div>
    </div>
  )
}
