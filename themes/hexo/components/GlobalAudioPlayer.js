import { useEffect, useRef, useState } from 'react'
import SmartLink from '@/components/SmartLink'

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const TITLE_MAX_LENGTH = 18

export default function GlobalAudioPlayer({ siteInfo }) {
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  const [audioData, setAudioData] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [visible, setVisible] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [hasManuallyExpanded, setHasManuallyExpanded] = useState(false)

  const defaultCover = siteInfo?.pageCover || siteInfo?.icon
  const shouldScroll = audioData?.title && audioData.title.length > TITLE_MAX_LENGTH

  useEffect(() => {
    const handleToggleGlobal = (e) => {
      const { src, cover, title, href } = e.detail

      if (!src) {
        alert('暂无音频节目，请点击标题查看文稿')
        return
      }

      if (audioData && audioData.src === src) {
        setVisible(true)
        setMinimized(false)
        setHasManuallyExpanded(true)
        if (audioRef.current) {
          if (audioRef.current.paused) {
            audioRef.current.play().catch(() => {})
          } else {
            audioRef.current.pause()
          }
        }
      } else {
        const newCover = cover || defaultCover
        setAudioData({ src, cover: newCover, title, href })
        setVisible(true)
        setMinimized(false)
        setHasManuallyExpanded(false)
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.src = src
            audioRef.current.volume = volume
            audioRef.current.muted = muted
            audioRef.current.play().catch(() => {})
          }
        }, 0)
      }
    }

    const handlePauseGlobal = () => {
      if (audioRef.current) {
        if (audioRef.current.paused) audioRef.current.play().catch(() => {})
        else audioRef.current.pause()
      }
    }

    const handleExpand = () => {
      setVisible(true)
      setMinimized(false)
      setHasManuallyExpanded(true)
    }

    const handleToggleVisibility = () => {
      if (!visible || minimized) {
        setVisible(true)
        setMinimized(false)
        setHasManuallyExpanded(true)
      } else {
        setMinimized(true)
      }
    }

    window.addEventListener('toggle-global-audio', handleToggleGlobal)
    window.addEventListener('pause-global-audio', handlePauseGlobal)
    window.addEventListener('expand-global-audio', handleExpand)
    window.addEventListener('toggle-player-visibility', handleToggleVisibility)
    return () => {
      window.removeEventListener('toggle-global-audio', handleToggleGlobal)
      window.removeEventListener('pause-global-audio', handlePauseGlobal)
      window.removeEventListener('expand-global-audio', handleExpand)
      window.removeEventListener('toggle-player-visibility', handleToggleVisibility)
    }
  }, [audioData, volume, muted, defaultCover, visible, minimized])

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('audio-play-state-change', {
        detail: { playing, currentSrc: audioData?.src, minimized }
      })
    )
  }, [playing, audioData?.src, minimized])

  useEffect(() => {
    if (duration > 0) {
      window.dispatchEvent(
        new CustomEvent('audio-time-update', {
          detail: { currentTime, duration, currentSrc: audioData?.src }
        })
      )
    }
  }, [currentTime, duration, audioData?.src])

  useEffect(() => {
    let autoCollapseTimer = null
    if (playing && !hasManuallyExpanded && !minimized) {
      autoCollapseTimer = setTimeout(() => setMinimized(true), 9000)
    }
    return () => clearTimeout(autoCollapseTimer)
  }, [playing, hasManuallyExpanded, minimized])

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
    <div id="global-audio-player-root">
      <audio ref={audioRef} />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 18s linear infinite;
        }
      `}</style>

      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-[9999] transition-all duration-500 ease-out transform ${visible && !minimized ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/30 dark:border-gray-700/50 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-4 py-3 flex items-center gap-4">

          <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
            {audioData?.cover ? (
              <img src={audioData.cover} alt='封面' className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#5A6A9A] to-[#3A4A7A] flex items-center justify-center text-white">
                <i className="fa-solid fa-music text-lg" />
              </div>
            )}
            {/* 磨砂玻璃质感按钮，不管什么封面都能看清 */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
            >
              <i className={`fa-solid ${playing ? 'fa-circle-pause' : 'fa-circle-play'} text-3xl text-white/90 drop-shadow-lg`} />
            </button>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 overflow-hidden">
            <div className="font-bold text-xs text-gray-800 dark:text-gray-100 w-full overflow-hidden">
              {audioData?.href ? (
                <SmartLink href={audioData.href} className="hover:text-[#3A4A7A] transition-colors block w-full overflow-hidden">
                  <span className={shouldScroll ? 'animate-marquee' : 'truncate'}>
                    {audioData.title || '暂无音频，请点击标题前往播放'}
                  </span>
                </SmartLink>
              ) : (
                <div className="w-full overflow-hidden">
                  <span className={shouldScroll ? 'animate-marquee' : 'truncate'}>
                    {audioData?.title || '暂无音频，请点击标题前往播放'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => skip(-5)} className="text-gray-500 hover:text-[#3A4A7A] transition-colors flex-shrink-0" title="后退5秒">
                <i className="fa-solid fa-rotate-left text-xs" />
              </button>
              <span className="text-[10px] text-gray-500 tabular-nums w-8 text-right">{formatTime(currentTime)}</span>
              <div
                ref={progressRef}
                onPointerDown={(e) => { e.preventDefault(); setDragging(true); seekFromClientX(e.clientX) }}
                onPointerMove={(e) => dragging && seekFromClientX(e.clientX)}
                onPointerUp={() => setDragging(false)}
                className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group max-w-md"
              >
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #5A6A9A 0%, #3A4A7A 100%)' }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-[#3A4A7A] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 4px)` }} />
              </div>
              <span className="text-[10px] text-gray-500 tabular-nums w-8">{formatTime(duration)}</span>
              <button onClick={() => skip(5)} className="text-gray-500 hover:text-[#3A4A7A] transition-colors flex-shrink-0" title="前进5秒">
                <i className="fa-solid fa-rotate-right text-xs" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-1 flex-shrink-0">
            <div className="relative flex items-center" onMouseEnter={() => setShowVolume(true)} onMouseLeave={() => setShowVolume(false)}>
              <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                <i className={`fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'} text-sm`} />
              </button>
              {showVolume && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-2">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-600 z-[99999] flex items-center justify-center" style={{ width: '36px', height: '100px' }}>
                    <input
                      type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume}
                      onChange={(e) => {
                        const vol = parseFloat(e.target.value)
                        setVolume(vol)
                        setMuted(false)
                        if (audioRef.current) { audioRef.current.volume = vol; audioRef.current.muted = false; }
                      }}
                      className="w-20 h-1 cursor-pointer"
                      style={{ accentColor: '#3A4A7A', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setMinimized(true)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#3A4A7A] transition-colors" title="折叠">
              <i className="fa-solid fa-chevron-down text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
