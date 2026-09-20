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

  useEffect(() => {
    const handlePlayGlobal = (e) => {
      const { src, cover, title, href, category } = e.detail
      setAudioData({ src, cover, title, href, category })
      setVisible(true)
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
        if (audioRef.current.paused) audioRef.current.play().catch(() => {})
        else audioRef.current.pause()
      }
    }

    const handleExpand = () => {
      if (!audioData?.src) {
        alert('请先点击文章内的播放按钮开始收听')
        return
      }
      setVisible(true)
    }

    window.addEventListener('play-global-audio', handlePlayGlobal)
    window.addEventListener('pause-global-audio', handlePauseGlobal)
    window.addEventListener('expand-global-audio', handleExpand)
    return () => {
      window.removeEventListener('play-global-audio', handlePlayGlobal)
      window.removeEventListener('pause-global-audio', handlePauseGlobal)
      window.removeEventListener('expand-global-audio', handleExpand)
    }
  }, [volume, muted, audioData?.src])

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
    const onEnded = () => { setPlaying(false); setCurrentTime(0); audio.currentTime = 0 }

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
      if (!audioRef.current.src && audioData?.src) audioRef.current.src = audioData.src
      audioRef.current.play().catch(() => {})
    } else audioRef.current.pause()
  }

  const skip = (seconds) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
  }

  const cycleSpeed = () => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length
    setSpeedIndex(nextIndex)
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[nextIndex]
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

  if (!visible || !audioData?.src) return null

  return (
    <div id="global-audio-player-root">
      <audio ref={audioRef} />
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl z-[9999] transition-all duration-500 ease-out transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/30 dark:border-gray-700/50 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-4 py-3 flex items-center gap-4">
          <div className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm cursor-pointer group" onClick={togglePlay}>
            {audioData.cover ? (
              <img src={audioData.cover} alt='封面' className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white">
                <i className="fas fa-music text-xl" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
              <div className="w-8 h-8 rounded-full border border-white/70 bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md">
                <i className={`fas ${playing ? 'fa-pause' : 'fa-play'} text-sm text-white ${!playing ? 'translate-x-[1px]' : ''}`} />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
            <div className="font-extrabold text-sm text-gray-800 dark:text-gray-100 truncate">
              {audioData.href ? (
                <SmartLink href={audioData.href} className="hover:text-indigo-500 transition-colors">
                  {audioData.title || '未知节目'}
                </SmartLink>
              ) : (
                audioData.title || '未知节目'
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => skip(-15)} className="text-gray-500 hover:text-indigo-500 transition-colors flex-shrink-0" title="后退15秒">
                <i className="fas fa-undo-alt text-xs" />
              </button>
              <div className="flex-1 flex items-center gap-2">
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
              <button onClick={() => skip(15)} className="text-gray-500 hover:text-indigo-500 transition-colors flex-shrink-0" title="前进15秒">
                <i className="fas fa-redo-alt text-xs" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button onClick={cycleSpeed} className="w-10 h-6 rounded text-[10px] font-bold text-gray-500 hover:text-indigo-500 border border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center" title="切换倍速">
              {SPEEDS[speedIndex]}x
            </button>
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
                    className="w-20 h-1 accent-indigo-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
            <button onClick={() => setVisible(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-colors" title="收起播放器">
              <i className="fas fa-chevron-down text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
