import { useEffect, useRef, useState } from 'react'

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const SPEEDS = [1, 1.25, 1.5, 2, 0.75]

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
    audio.playbackRate = SPEEDS[speedIndex]

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration || 0)
    const onPlaying = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); audio.currentTime = 0 }

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
  }, [volume, muted, speedIndex])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) audioRef.current.play().catch(() => {})
    else audioRef.current.pause()
  }

  const skip = (seconds) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
  }

  const cycleSpeed = () => {
    const next = (speedIndex + 1) % SPEEDS.length
    setSpeedIndex(next)
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next]
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    const newMuted = !audioRef.current.muted
    audioRef.current.muted = newMuted
    setMuted(newMuted)
  }

  const seekFromClientX = (clientX) => {
    const audio = audioRef.current
    const bar = progressRef.current
    if (!audio || !bar || !duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const next = ratio * duration
    audio.currentTime = next
    setCurrentTime(next)
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className='relative my-4 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gray-50 dark:bg-white/5'>
      <audio ref={audioRef} src={src} preload='metadata' />

      {/* 播放/暂停：加 leading-none 和 ml-[2px] 保证三角绝对居中 */}
      <button
        onClick={togglePlay}
        className='flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center leading-none transition-transform hover:scale-105'
        style={{ backgroundColor: '#3A4A7A' }}>
        <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm text-white ${!isPlaying ? 'ml-[2px]' : ''}`} />
      </button>

      {/* 进度条 + 时间 */}
      <div className='flex-1 flex items-center gap-2 min-w-0'>
        <span className='text-[10px] text-gray-500 tabular-nums w-9 text-right'>{formatTime(currentTime)}</span>
        <div
          ref={progressRef}
          onPointerDown={(e) => { e.preventDefault(); setDragging(true); seekFromClientX(e.clientX) }}
          onPointerMove={(e) => dragging && seekFromClientX(e.clientX)}
          onPointerUp={() => setDragging(false)}
          className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group'
        >
          <div
            className='h-full rounded-full transition-all duration-300'
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #5A6A9A 0%, #3A4A7A 100%)' }}
          />
          <div
            className='absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#3A4A7A] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity'
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
        <span className='text-[10px] text-gray-500 tabular-nums w-9'>{formatTime(duration)}</span>
      </div>

      {/* 快退5秒 */}
      <button onClick={() => skip(-5)} className='text-gray-500 hover:text-[#3A4A7A] transition-colors flex-shrink-0' title='后退5秒'>
        <i className='fa-solid fa-rotate-left text-sm' />
      </button>

      {/* 快进5秒 */}
      <button onClick={() => skip(5)} className='text-gray-500 hover:text-[#3A4A7A] transition-colors flex-shrink-0' title='前进5秒'>
        <i className='fa-solid fa-rotate-right text-sm' />
      </button>

      {/* 倍速 */}
      <button
        onClick={cycleSpeed}
        className='flex-shrink-0 w-10 h-6 rounded text-[10px] font-bold text-gray-500 hover:text-[#3A4A7A] border border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center'
        title='切换倍速'>
        {SPEEDS[speedIndex]}x
      </button>

      {/* 音量控制：浮层改为朝下弹出，不再超出容器 */}
      <div
        className='relative flex items-center flex-shrink-0'
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
      >
        <button
          onClick={toggleMute}
          className='w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors'>
          <i className={`fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'} text-sm`} />
        </button>
        {showVolume && (
          <div className='absolute top-full right-0 mt-2 z-50'>
            <div className='p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-600 flex items-center justify-center' style={{ width: '36px', height: '100px' }}>
              <input
                type='range'
                min='0'
                max='1'
                step='0.05'
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const vol = parseFloat(e.target.value)
                  setVolume(vol)
                  setMuted(false)
                  if (audioRef.current) { audioRef.current.volume = vol; audioRef.current.muted = false }
                }}
                className='w-20 h-1 cursor-pointer'
                style={{ accentColor: '#3A4A7A', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
