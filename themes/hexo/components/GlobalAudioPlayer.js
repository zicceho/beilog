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
  const [muted, setMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [visible, setVisible] = useState(false)
  const [minimized, setMinimized] = useState(true)

  // 初始化：从 localStorage 读取，或者接收首页发送的最新节目数据
  useEffect(() => {
    const saved = localStorage.getItem('global_audio_data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setAudioData(data)
        setVisible(true)
        setMinimized(true)
      } catch (e) {}
    }

    const handleSetLatest = (e) => {
      const { src, cover, title, href } = e.detail
      if (!src) return
      // 如果当前没有音频数据，就用最新一期作为默认数据
      setAudioData((prev) => {
        if (prev) return prev
        const newData = { src, cover, title, href }
        localStorage.setItem('global_audio_data', JSON.stringify(newData))
        return newData
      })
      setVisible(true)
    }

    window.addEventListener('set-latest-audio', handleSetLatest)
    return () => window.removeEventListener('set-latest-audio', handleSetLatest)
  }, [])

  // 监听文章内触发播放 / 暂停
  useEffect(() => {
    const handlePlayGlobal = (e) => {
      const { src, cover, title, href } = e.detail
      const newData = { src, cover, title, href }
      setAudioData(newData)
      localStorage.setItem('global_audio_data', JSON.stringify(newData))
      setVisible(true)
      setMinimized(false)
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = src
          audioRef.current.volume = volume
          audioRef.current.muted = muted
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
  }, [volume, muted])

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('audio-play-state-change', {
        detail: { playing, currentSrc: audioData?.src }
      })
    )
  }, [playing, audioData?.src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted

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
  }, [audioData, volume, muted])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      // 如果之前没有挂载 src，这里补上
      if (!audioRef.current.src && audioData?.src) {
        audioRef.current.src = audioData.src
      }
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

  if (!visible || !audioData) return null

  return (
    <div id="global-audio-player-root">
      {/* 核心修复： audio 标签永远不被销毁 */}
      <audio ref={audioRef} />

      {minimized ? (
        /* ===== 左下角悬浮球 ===== */
        <div className="fixed bottom-6 left-6 z-[9999] transition-all duration-300 animate__animated animate__fadeIn">
          <button
            onClick={() => setMinimized(false)}
            className="relative w-14 h-14 rounded-full overflow-hidden shadow-2xl border-2 border-white/40 hover:scale-110 transition-transform group"
          >
            {audioData.cover ? (
              <img src={audioData.cover} alt='封面' className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white">
                <i className="fas fa-music text-lg" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <i className={`fas ${playing ? 'fa-pause' : 'fa-play'} text-white text-sm ${!playing ? 'translate-x-[1px]' : ''}`} />
            </div>
            {playing && (
              <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-40" />
            )}
          </button>
        </div>
      ) : (
        /* ===== 底部轻度圆角播放条 ===== */
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-[9999] transition-all duration-300 transform animate__animated animate__slideInUp">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/30 dark:border-gray-700/50 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-4 py-2.5 flex items-center gap-3">
            
            {/* 左侧：封面 + 标题 */}
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
                  <SmartLink href={audioData.href} className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate hover:text-indigo-500 transition-colors block">
                    {audioData.title || '未知节目'}
                  </SmartLink>
                ) : (
                  <div className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">{audioData.title || '未知节目'}</div>
                )}
              </div>
            </div>

            {/* 中间：控制区（去除了上一期/下一期，保留快退/快进） */}
            <div className="flex-1 flex items-center justify-center gap-2">
              <button onClick={() => skip(-15)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors" title="后退15秒">
                <i className="fas fa-undo-alt text-xs" />
              </button>

              <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-transform hover:scale-105 shadow-md">
                <i className={`fas ${playing ? 'fa-pause' : 'fa-play'} text-sm ${!playing ? 'translate-x-[1px]' : ''}`} />
              </button>

              <button onClick={() => skip(15)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-indigo-500 transition-colors" title="前进15秒">
                <i className="fas fa-redo-alt text-xs" />
              </button>

              {/* 进度条 */}
              <div className="flex-1 flex items-center gap-2 max-w-lg ml-2">
                <span className="text-[10px] text-gray-500 tabular-nums w-8 text-right">{formatTime(currentTime)}</span>
                <div
                  ref={progressRef}
                  onPointerDown={(e) => { e.preventDefault(); setDragging(true); seekFromClientX(e.clientX) }}
                  onPointerMove={(e) => dragging && seekFromClientX(e.clientX)}
                  onPointerUp={() => setDragging(false)}
                  className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group"
                >
                  <div className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors" style={{ width: `${progress}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 6px)` }} />
                </div>
                <span className="text-[10px] text-gray-500 tabular-nums w-8">{formatTime(duration)}</span>
              </div>

              {/* 倍速 */}
              <button onClick={cycleSpeed} className="w-10 h-7 rounded text-[10px] font-bold text-gray-500 hover:text-indigo-500 border border-gray-300 dark:border-gray-600 hover:border-indigo-400 transition-colors flex items-center justify-center ml-1" title="切换倍速">
                {SPEEDS[speedIndex]}x
              </button>
            </div>

            {/* 右侧：音量 + 折叠 */}
            <div className="flex items-center justify-end gap-1 w-1/4">
              {/* 音量（悬浮滑块） */}
              <div className="relative flex items-center" onMouseEnter={() => setShowVolume(true)} onMouseLeave={() => setShowVolume(false)}>
                <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                  <i className={`fas ${muted ? 'fa-volume-mute' : volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'} text-sm`} />
                </button>
                {showVolume && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-600 z-[99999]">
                    <input
                      type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume}
                      onChange={(e) => {
                        const vol = parseFloat(e.target.value)
                        setVolume(vol)
                        setMuted(false)
                        if (audioRef.current) { audioRef.current.volume = vol; audioRef.current.muted = false; }
                      }}
                      className="w-24 h-1 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* 折叠按钮（去掉关闭按钮） */}
              <button onClick={() => setMinimized(true)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-colors" title="折叠到左下角">
                <i className="fas fa-chevron-down text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
