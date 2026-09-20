// themes/hexo/components/AudioPlayer.js
import { useEffect, useRef, useState } from 'react'

const formatTime = seconds => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
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
    <div className='notion-audio-player-wrapper my-4 p-3 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800'>
      <audio ref={audioRef} src={src} preload='metadata' />
      <div className='flex items-center gap-3'>
        <button
          onClick={togglePlay}
          className='flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors'>
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
            className='h-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer relative'>
            <div
              className='h-full bg-indigo-500 rounded-full'
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className='flex justify-between text-xs text-gray-500 mt-1'>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
