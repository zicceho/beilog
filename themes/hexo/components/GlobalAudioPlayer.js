import { useEffect, useRef, useState } from 'react'
import SmartLink from '@/components/SmartLink'

const formatTime = (s) => {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function GlobalAudioPlayer() {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const autoTimer = useRef(null)

  const [audioData, setAudioData] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [visible, setVisible] = useState(false)
  const [minimized, setMinimized] = useState(true)
  const [manuallyExpanded, setManuallyExpanded] = useState(false)

  // 监听播放/暂停/展开收起指令
  useEffect(() => {
    const onToggleAudio = (e) => {
      const { src, cover, title, href } = e.detail || {}
      if (!src) return
      const audio = audioRef.current
      if (!audio) return

      const isSame = audio.src === src || audio.src.endsWith(src)

      if (isSame) {
        if (audio.paused) {
          audio.play().catch(() => {})
        } else {
          audio.pause()
        }
        setVisible(true)
        setMinimized(false)
        setManuallyExpanded(true)
        return
      }

      audio.src = src
      audio.play().catch(() => {})
      setAudioData({ src, cover, title, href })
      setVisible(true)
      setMinimized(false)
      setManuallyExpanded(false)
    }

    const onToggleVisibility = () => {
      if (!audioData) return
      setVisible(true)
      if (minimized) {
        setMinimized(false)
        setManuallyExpanded(true)
      } else {
        setMinimized(true)
      }
    }

    window.addEventListener('toggle-global-audio', onToggleAudio)
    window.addEventListener('toggle-player-visibility', onToggleVisibility)
    return () => {
      window.removeEventListener('toggle-global-audio', onToggleAudio)
      window.removeEventListener('toggle-player-visibility', onToggleVisibility)
    }
  }, [audioData, minimized])

  // 音频事件绑定
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration || 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnd = () => {
      setPlaying(false)
      setCurrentTime(audio.duration || 0)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('playing', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnd)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('playing', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  // 广播状态给封面/文章页播放器
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('global-audio-state', {
        detail: {
          src: audioData?.src || null,
          playing,
          currentTime,
          duration
        }
      })
    )
  }, [playing, audioData?.src, currentTime, duration])

  // 9秒自动折叠
  useEffect(() => {
    if (autoTimer.current) clearTimeout(autoTimer.current)
    if (playing && !manuallyExpanded && !minimized && visible) {
      autoTimer.current = setTimeout(() => setMinimized(true), 9000)
    }
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current)
    }
  }, [playing, manuallyExpanded, minimized, visible])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  const skip = (s) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + s))
  }

  const seek = (e) => {
    const audio = audioRef.current
    const bar = progressRef.current
    if (!audio || !bar || !duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * duration
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div id='global-audio-player-root'>
      <audio ref={audioRef} preload='metadata' />

      {audioData && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-[9999] transition-all duration-500 ease-out transform ${
            visible && !minimized ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
          }`}>
          <div className='bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/30 dark:border-gray-700/50 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-4 py-3 flex items-center gap-4'>

            {/* 封面 */}
            <div className='relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm'>
              {audioData.cover ? (
                <img src={audioData.cover} alt='封面' className='w-full h-full object-cover' />
              ) : (
                <div className='w-full h-full bg-gradient-to-br from-[#5A6A9A] to-[#3A4A7A] flex items-center justify-center text-white'>
                  <i className='fa-solid fa-music text-lg' />
                </div>
              )}
              <button
                onClick={togglePlay}
                className='absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors'>
                <i className={`fa-solid ${playing ? 'fa-circle-pause' : 'fa-circle-play'} text-3xl text-white/80`} />
              </button>
            </div>

            {/* 标题 + 进度 */}
            <div className='flex-1 min-w-0 flex flex-col justify-center gap-1.5'>
              <div className='font-bold text-xs text-gray-800 dark:text-gray-100 truncate'>
                {audioData.href ? (
                  <SmartLink href={audioData.href} className='hover:text-[#3A4A7A] transition-colors'>
                    {audioData.title || '未知节目'}
                  </SmartLink>
                ) : (
                  audioData.title || '未知节目'
                )}
              </div>
              <div className='flex items-center gap-2'>
                <button onClick={() => skip(-5)} className='text-gray-500 hover:text-[#3A4A7A] transition-colors flex-shrink-0'>
                  <i className='fa-solid fa-rotate-left text-xs' />
                </button>
                <span className='text-[10px] text-gray-500 tabular-nums w-8 text-right'>{formatTime(currentTime)}</span>
                <div
                  ref={progressRef}
                  onPointerDown={(e) => { e.preventDefault(); seek(e) }}
                  className='flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group'>
                  <div
                    className='h-full rounded-full'
                    style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #5A6A9A 0%, #3A4A7A 100%)' }}
                  />
                </div>
                <span className='text-[10px] text-gray-500 tabular-nums w-8'>{formatTime(duration)}</span>
                <button onClick={() => skip(5)} className='text-gray-500 hover:text-[#3A4A7A] transition-colors flex-shrink-0'>
                  <i className='fa-solid fa-rotate-right text-xs' />
                </button>
              </div>
            </div>

            {/* 收起按钮 */}
            <button
              onClick={() => setMinimized(true)}
              className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#3A4A7A] transition-colors flex-shrink-0'>
              <i className='fa-solid fa-chevron-down text-xs' />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
