import { useEffect, useRef, useState } from 'react'
import SmartLink from '@/components/SmartLink'

const formatTime = (s) => {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const SPEEDS = [1, 1.25, 1.5, 2, 0.75]
const TITLE_MAX_LENGTH = 18

export default function GlobalAudioPlayer() {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const autoTimer = useRef(null)
  const titleRef = useRef(null)

  const [audioData, setAudioData] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [minimized, setMinimized] = useState(true)
  const [manuallyExpanded, setManuallyExpanded] = useState(false)
  const [noAudioMessage, setNoAudioMessage] = useState('')
  const [titleOverflow, setTitleOverflow] = useState(false)

  // 检查标题是否超出，超出才滚动
  useEffect(() => {
    if (titleRef.current && audioData?.title) {
      setTitleOverflow(audioData.title.length > TITLE_MAX_LENGTH)
    } else {
      setTitleOverflow(false)
    }
  }, [audioData?.title, visible])

  // 音频事件绑定
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted

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
  }, [volume, muted])

  // 广播状态给封面和文章内播放器
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('global-audio-state', {
        detail: {
          src: audioData?.src || null,
          playing,
          currentTime,
          duration,
          hasAudio: !!audioData?.src
        }
      })
    )
  }, [playing, audioData?.src, currentTime, duration])

  // 监听指令
  useEffect(() => {
    const onToggle = (e) => {
      const { src, cover, title, href } = e.detail || {}
      if (!src) return
      const audio = audioRef.current
      if (!audio) return

      const isSame = audioData?.src === src
      if (isSame) {
        // 同一首：暂停/继续，保留进度
        if (audio.paused) audio.play().catch(() => {})
        else audio.pause()
      } else {
        // 新的一首：替换音源从头播放
        audio.src = src
        audio.currentTime = 0
        audio.play().catch(() => {})
        setAudioData({ src, cover, title, href })
        setCurrentTime(0)
        setDuration(0)
      }
      setNoAudioMessage('')
      setVisible(true)
      setMinimized(false)
      setManuallyExpanded(true)
    }

    const onToggleVisibility = () => {
      setVisible(true)
      if (minimized) {
        setMinimized(false)
        setManuallyExpanded(true)
      } else {
        setMinimized(true)
      }
    }

    const onShowNoAudio = (e) => {
      const msg =
        e.detail?.message || '本期暂无音频节目，请点击标题查看详情'
      setNoAudioMessage(msg)
      setAudioData(null)
      setVisible(true)
      setMinimized(false)
      setManuallyExpanded(false)
    }

    window.addEventListener('toggle-global-audio', onToggle)
    window.addEventListener('toggle-player-visibility', onToggleVisibility)
    window.addEventListener('show-no-audio-hint', onShowNoAudio)
    return () => {
      window.removeEventListener('toggle-global-audio', onToggle)
      window.removeEventListener('toggle-player-visibility', onToggleVisibility)
      window.removeEventListener('show-no-audio-hint', onShowNoAudio)
    }
  }, [audioData, minimized, visible])

  // 自动隐藏规则：首次播放 10 秒后自动折叠；手动展开后不自动折叠
  useEffect(() => {
    if (autoTimer.current) clearTimeout(autoTimer.current)
    if (visible && !minimized && !manuallyExpanded) {
      autoTimer.current = setTimeout(() => setMinimized(true), 10000)
    }
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current)
    }
  }, [visible, minimized, manuallyExpanded, playing])

  // 滚动页面时自动折叠
  useEffect(() => {
    if (!visible || minimized) return
    let lastY = window.pageYOffset
    const onScroll = () => {
      const y = window.pageYOffset
      if (Math.abs(y - lastY) > 50) {
        setMinimized(true)
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [visible, minimized])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !audio.src) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  const skip = (s) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration || 0, audio.currentTime + s)
    )
  }

  const cycleSpeed = () => {
    const next = (speedIndex + 1) % SPEEDS.length
    setSpeedIndex(next)
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next]
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    const nm = !audio.muted
    audio.muted = nm
    setMuted(nm)
  }

  const seekFromEvent = (e) => {
    const audio = audioRef.current
    const bar = progressRef.current
    if (!audio || !bar || !duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * duration
  }

  const progress = duration ? (currentTime / duration) * 100 : 0
  const hasAudio = !!audioData?.src
  const shouldRender = visible && !minimized

  return (
    <div id='global-audio-player-root'>
      <audio ref={audioRef} preload='metadata' />

      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-[9999] transition-all duration-500 ease-out transform ${
          shouldRender
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}>
        <div className='bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4 py-3 flex items-center gap-3'>

          {/* 封面 + 播放/暂停按钮（居中） */}
          <div className='relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm'>
            {audioData?.cover ? (
              <img
                src={audioData.cover}
                alt='封面'
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-[#5A6A9A] to-[#3A4A7A] flex items-center justify-center text-white'>
                <i className='fa-solid fa-music text-lg' />
              </div>
            )}
            {hasAudio && (
              <button
                onClick={togglePlay}
                className='absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors'>
                <i
                  className={`fa-solid ${
                    playing ? 'fa-circle-pause' : 'fa-circle-play'
                  } text-2xl text-white/90 drop-shadow`}
                />
              </button>
            )}
          </div>

          {/* 中间：标题 + 进度条 */}
          <div className='flex-1 min-w-0 flex flex-col justify-center gap-1.5'>
            <div className='font-bold text-xs text-gray-800 dark:text-gray-100 w-full overflow-hidden'>
              {noAudioMessage ? (
                <span className='truncate block text-gray-500 dark:text-gray-400'>
                  {noAudioMessage}
                </span>
              ) : audioData?.href ? (
                <SmartLink
                  href={audioData.href}
                  className='hover:text-[#3A4A7A] transition-colors block w-full overflow-hidden'>
                  <span
                    ref={titleRef}
                    className={titleOverflow ? 'animate-marquee' : 'truncate block'}>
                    {audioData.title || '未知节目'}
                  </span>
                </SmartLink>
              ) : (
                <div className='w-full overflow-hidden'>
                  <span
                    ref={titleRef}
                    className={titleOverflow ? 'animate-marquee' : 'truncate block'}>
                    {audioData?.title || '未知节目'}
                  </span>
                </div>
              )}
            </div>

            {hasAudio && (
              <div className='flex items-center gap-1.5'>
                <span className='text-[10px] text-gray-500 tabular-nums w-8 text-right'>
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressRef}
                  onPointerDown={(e) => {
                    e.preventDefault()
                    seekFromEvent(e)
                  }}
                  className='flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative group max-w-xs'>
                  <div
                    className='h-full rounded-full'
                    style={{
                      width: `${progress}%`,
                      background:
                        'linear-gradient(90deg, #7B8BC4 0%, #4A5A8A 50%, #3A4A7A 100%)'
                    }}
                  />
                </div>
                <span className='text-[10px] text-gray-500 tabular-nums w-8'>
                  {formatTime(duration)}
                </span>
                <button
                  onClick={() => skip(-5)}
                  className='text-gray-500 hover:text-[#3A4A7A] transition-colors'
                  title='后退5秒'>
                  <i className='fa-solid fa-rotate-left text-xs' />
                </button>
                <button
                  onClick={() => skip(5)}
                  className='text-gray-500 hover:text-[#3A4A7A] transition-colors'
                  title='前进5秒'>
                  <i className='fa-solid fa-rotate-right text-xs' />
                </button>
                <button
                  onClick={cycleSpeed}
                  className='w-9 h-5 rounded text-[10px] font-bold text-gray-500 hover:text-[#3A4A7A] border border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center'
                  title='切换倍速'>
                  {SPEEDS[speedIndex]}x
                </button>
              </div>
            )}
          </div>

          {/* 右侧：音量 + 折叠 */}
          <div className='flex items-center justify-end gap-1 flex-shrink-0'>
            {hasAudio && (
              <div
                className='relative flex items-center'
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}>
                <button
                  onClick={toggleMute}
                  className='w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#3A4A7A] transition-colors'>
                  <i
                    className={`fa-solid ${
                      muted ? 'fa-volume-xmark' : 'fa-volume-high'
                    } text-sm`}
                  />
                </button>
                {showVolume && (
                  <div className='absolute bottom-full left-1/2 -translate-x-1/2 pb-2'>
                    <div
                      className='p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-600 z-50 flex items-center justify-center'
                      style={{ width: '36px', height: '100px' }}>
                      <input
                        type='range'
                        min='0'
                        max='1'
                        step='0.05'
                        value={muted ? 0 : volume}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value)
                          setVolume(v)
                          setMuted(false)
                          if (audioRef.current) {
                            audioRef.current.volume = v
                            audioRef.current.muted = false
                          }
                        }}
                        className='w-20 h-1 cursor-pointer'
                        style={{
                          accentColor: '#3A4A7A',
                          transform: 'rotate(-90deg)',
                          transformOrigin: 'center'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setMinimized(true)}
              className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#3A4A7A] transition-colors flex-shrink-0'>
              <i className='fa-solid fa-chevron-down text-xs' />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </div>
  )
}
