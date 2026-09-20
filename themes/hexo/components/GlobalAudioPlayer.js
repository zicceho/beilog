import { useEffect, useRef, useState } from 'react'
import SmartLink from '@/components/SmartLink'

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const SPEEDS = [1, 1.25, 1.5, 2, 0.75]

export default function GlobalAudioPlayer() {
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  const [audioData, setAudioData] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showVolume, setShowVolume] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [visible, setVisible] = useState(false)
  const [minimized, setMinimized] = useState(false)

  // ========== 监听文章内播放事件 ==========
  useEffect(() => {
    const handlePlayGlobal = (e) => {
      const { src, cover, title, href } = e.detail
      setAudioData({ src, cover, title, href })
      setVisible(true)
      setMinimized(false)
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = src
          audioRef.current.volume = volume
          audioRef.current.play().catch(() => {})
        }
      }, 0)
    }

    const handlePauseGlobal = () => {
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play().catch(() => {})
        } else {
          audioRef.current.pause()
        }
      }
    }

    window.addEventListener('play-global-audio', handlePlayGlobal)
    window.addEventListener('pause-global-audio', handlePauseGlobal)
    return () => {
      window.removeEventListener('play-global-audio', handlePlayGlobal)
      window.removeEventListener('pause-global-audio', handlePauseGlobal)
    }
  }, [volume])

  // ========== 广播播放状态给文章内组件 ==========
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('audio-play-state-change', {
        detail: { playing, currentSrc: audioData?.src }
      })
    )
  }, [playing, audioData?.src])

  // ========== 音频事件监听 ==========
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration || 0)
    const onPlaying = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
      audio.currentTime = 0
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
  }, [audioData])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }

  const skip = (seconds) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(duration, audioRef.current.currentTime + seconds)
    )
  }

  const cycleSpeed = () => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length
    setSpeedIndex(nextIndex)
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEEDS[nextIndex]
    }
  }

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    setVisible(false)
    setPlaying(false)
    setMinimized(false)
    setAudioData(null)
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

  if (!visible || !audioData) return null

  // ========== 折叠状态：左下角悬浮球 ==========
  if (minimized) {
    return (
      <div className="fixed bottom-6 left-6 z-[9999] animate__animated animate__fadeIn">
        <button
          onClick={() => setMinimized(false)}
          className="relative w-14 h-14 rounded-full overflow-hidden shadow-2xl border-2 border-white/30 hover:scale-110 transition-transform"
        >
          {audioData.cover ? (
            <img src={audioData.cover} alt='封面' className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white">
              <i className="fas fa-music text-lg" />
            </div>
          )}
          {/* 播放状态指示环 */}
          {playing && (
            <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-40" />
          )}
        </button>
      </div>
    )
  }

  // ========== 展开状态：底部毛玻璃播放条 ==========
  return (
    <div className="fixed bottom-0 left-0 w-full z-[9999] animate__animated animate__slideInUp">
      <audio ref={audioRef} />

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t dark:border-gray-700 shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-4">

          {/* ===== 左侧：封面 + 标题 ===== */}
          <div className="flex items-center gap-3 min-w-0 w-1/4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
              {audioData.cover ? (
                <img src={audioData.cover} alt='封面' className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white">
                  <i className="fas fa-music text-sm" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              {audioData.href ? (
                <SmartLink
                  href={audioData.href}
                  className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate hover:text-indigo-500 transition-colors block"
                >
                  {audioData.title || '未知节目'}
                </SmartLink>
              ) : (
                <div className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">
                  {audioData.title || '未知节目'}
                </div>
              )}
            </div>
          </div>

          {/* ===== 中间：控制区 ===== */}
          <div className="flex-1 flex items-center justify-center gap-3">
            {/* 后退15秒 */}
            <button
              onClick={() => skip(-15)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors"
              title="后退15秒"
            >
              <i className="fas fa-undo-alt text-sm" />
            </button>

            {/* 播放/暂停 */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-all hover:scale-105 shadow-md"
            >
              {playing ? (
                <i className="fas fa-pause text-sm" />
              ) : (
                <i className="fas fa-play text-sm ml-0.5" />
              )}
            </button>

            {/* 前进15秒 */}
            <button
              onClick={() => skip(15)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors"
              title="前进15秒"
            >
              <i className="fas fa-redo-alt text-sm" />
            </button>

            {/* 进度条 + 时间 */}
            <div className="flex-1 flex items-center gap-2 max-w-lg">
              <span className="text-[10px] text-gray-500 tabular-nums w-8 text-right">
                {formatTime(currentTime)}
              </span>
              <div
                ref={progressRef}
                onPointerDown={(e) => {
                  e.preventDefault()
                  setDragging(true)
                  seekFromClientX(e.clientX)
                }}
                onPointerMove={(e) => dragging && seekFromClientX(e.clientX)}
                onPointerUp={() => setDragging(false)}
                className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group"
              >
                <div
                  className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>
              <span className="text-[10px] text-gray-500 tabular-nums w-8">
                {formatTime(duration)}
              </span>
            </div>

            {/* 倍速 */}
            <button
              onClick={cycleSpeed}
              className="w-10 h-7 rounded text-[10px] font-bold text-gray-500 hover:text-indigo-500 border border-gray-300 dark:border-gray-600 hover:border-indigo-400 transition-colors flex items-center justify-center"
              title="切换倍速"
            >
              {SPEEDS[speedIndex]}x
            </button>
          </div>

          {/* ===== 右侧：音量 + 折叠 + 关闭 ===== */}
          <div className="flex items-center justify-end gap-1 w-1/4">
            {/* 音量（悬浮弹出） */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                <i
                  className={`fas ${
                    volume === 0
                      ? 'fa-volume-mute'
                      : volume < 0.5
                      ? 'fa-volume-down'
                      : 'fa-volume-up'
                  } text-sm`}
                />
              </button>
              {showVolume && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-600">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => {
                      const vol = parseFloat(e.target.value)
                      setVolume(vol)
                      if (audioRef.current) audioRef.current.volume = vol
                    }}
                    className="w-24 h-1 accent-indigo-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 折叠按钮 */}
            <button
              onClick={() => setMinimized(true)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-colors"
              title="折叠到左下角"
            >
              <i className="fas fa-chevron-down text-xs" />
            </button>

            {/* 关闭按钮 */}
            <button
              onClick={closePlayer}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
              title="关闭播放器"
            >
              <i className="fas fa-times text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
