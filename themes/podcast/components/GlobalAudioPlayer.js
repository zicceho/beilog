import { useEffect, useMemo, useRef, useState } from 'react'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { getAudioUrl } from './AudioPlayer'

const PlayIcon = ({ size = 17 }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='currentColor' aria-hidden='true' style={{ marginLeft: '1px' }}>
    <path d='M8 5v14l11-7z' />
  </svg>
)

const PauseIcon = ({ size = 17 }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='currentColor' aria-hidden='true'>
    <rect x='6' y='5' width='4' height='14' rx='1' />
    <rect x='14' y='5' width='4' height='14' rx='1' />
  </svg>
)

const ChevronIcon = ({ size = 13 }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
    <path d='m7 10 5 5 5-5' />
  </svg>
)

const LockIcon = ({ size = 14, locked = false }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
    {locked ? <path d='M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z' /> : <path d='M8 11V8a4 4 0 0 1 7.7-1.4M6 11h12v9H6z' />}
  </svg>
)

const SkipIcon = ({ forward = false, size = 14 }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    {forward ? <>
      <path d='M5 12h8' /><path d='m10 7 5 5-5 5' /><path d='M19 7v10' />
    </> : <>
      <path d='M19 12h-8' /><path d='m14 7-5 5 5 5' /><path d='M5 7v10' />
    </>}
  </svg>
)

function formatTime(value) {
  if (!Number.isFinite(value) || value <= 0) return '00:00'
  const total = Math.floor(value)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getCover(audioData) {
  return audioData?.cover || audioData?.pageCover || siteConfig('HOME_BANNER_IMAGE', '', CONFIG) || ''
}

export default function GlobalAudioPlayer({ posts = [], siteInfo }) {
  const enabled = siteConfig('NIANAN_AUDIO_ENABLE', true, CONFIG)
  const mobileMore = siteConfig('NIANAN_AUDIO_MOBILE_MORE', true, CONFIG)
  const hideOnScroll = siteConfig('NIANAN_AUDIO_HIDE_ON_SCROLL', true, CONFIG)
  const defaultRate = Number(siteConfig('NIANAN_AUDIO_DEFAULT_RATE', 1, CONFIG)) || 1
  const defaultVolume = Math.min(1, Math.max(0, Number(siteConfig('NIANAN_AUDIO_DEFAULT_VOLUME', 1, CONFIG))))

  const audioRef = useRef(null)
  const latestPostsRef = useRef(posts)
  const lastScrollY = useRef(0)
  const scrollDistance = useRef(0)
  const [audioData, setAudioData] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [locked, setLocked] = useState(false)
  const [visible, setVisible] = useState(false)
  const [autoHidden, setAutoHidden] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(defaultRate)
  const [volume, setVolume] = useState(defaultVolume)
  const [error, setError] = useState('')

  useEffect(() => {
    latestPostsRef.current = posts
  }, [posts])

  const broadcast = (extra = {}) => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('global-audio-state', {
      detail: {
        src: audioData?.src || '',
        playing,
        currentTime,
        duration,
        hasAudio: Boolean(audioData?.src),
        locked,
        visible: visible && !autoHidden,
        ...extra
      }
    }))
  }

  const setVisibleState = value => {
    setVisible(value)
    setAutoHidden(false)
  }

  const safePlay = async audio => {
    try {
      await audio.play()
      setError('')
      setPlaying(true)
    } catch (playError) {
      setPlaying(false)
      setError('浏览器阻止了自动播放，请点击播放按钮继续。')
      return playError
    }
    return null
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !enabled) return undefined

    audio.volume = defaultVolume
    audio.playbackRate = defaultRate
    lastScrollY.current = typeof window !== 'undefined' ? window.scrollY : 0

    const handlePlay = () => setPlaying(true)
    const handlePause = () => setPlaying(false)
    const handleTime = () => {
      setCurrentTime(audio.currentTime || 0)
    }
    const handleMetadata = () => {
      const nextDuration = Number.isFinite(audio.duration) ? audio.duration : 0
      setDuration(nextDuration)
    }
    const handleEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
    }
    const handleError = () => {
      setPlaying(false)
      setError('音频加载失败，请检查音频链接或稍后重试。')
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('timeupdate', handleTime)
    audio.addEventListener('loadedmetadata', handleMetadata)
    audio.addEventListener('durationchange', handleMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('timeupdate', handleTime)
      audio.removeEventListener('loadedmetadata', handleMetadata)
      audio.removeEventListener('durationchange', handleMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [enabled, defaultRate, defaultVolume])

  useEffect(() => {
    if (!enabled) return undefined

    const onToggle = async event => {
      const detail = event?.detail || {}
      const src = typeof detail.src === 'string' ? detail.src.trim() : ''
      if (!src) return

      const audio = audioRef.current
      if (!audio) return

      const isSame = audioData?.src === src
      setVisibleState(true)
      setError('')

      if (isSame) {
        if (audio.paused) {
          await safePlay(audio)
        } else {
          audio.pause()
        }
        return
      }

      try {
        audio.pause()
        audio.src = src
        audio.load()
        audio.currentTime = 0
        setCurrentTime(0)
        setDuration(0)
        setAudioData({
          src,
          cover: detail.cover || '',
          title: detail.title || '念安酒馆',
          href: detail.href || '',
          pageCover: detail.pageCover || ''
        })
        await safePlay(audio)
      } catch {
        setPlaying(false)
        setError('音频加载失败，请检查音频链接。')
      }
    }

    const onVisibility = () => {
      setVisibleState(true)
    }

    const onNoAudio = event => {
      const message = event?.detail?.message || '暂无音频节目，请点击标题查看文稿。'
      setError(message)
      setVisibleState(true)
      window.setTimeout(() => setError(''), 2600)
    }

    window.addEventListener('toggle-global-audio', onToggle)
    window.addEventListener('toggle-player-visibility', onVisibility)
    window.addEventListener('show-no-audio-hint', onNoAudio)
    return () => {
      window.removeEventListener('toggle-global-audio', onToggle)
      window.removeEventListener('toggle-player-visibility', onVisibility)
      window.removeEventListener('show-no-audio-hint', onNoAudio)
    }
  }, [audioData?.src, enabled])

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled || !hideOnScroll) return undefined

    const onScroll = () => {
      if (locked) return
      const y = window.scrollY || 0
      const delta = y - lastScrollY.current
      lastScrollY.current = y
      if (delta > 0) {
        scrollDistance.current += delta
        if (scrollDistance.current > 50) setAutoHidden(true)
      } else if (delta < 0) {
        scrollDistance.current = 0
        setAutoHidden(false)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled, hideOnScroll, locked])

  useEffect(() => {
    broadcast()
  }, [audioData?.src, playing, currentTime, duration, locked, visible, autoHidden])

  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0
  const currentTitle = audioData?.title || siteInfo?.title || '念安酒馆'
  const coverUrl = getCover(audioData)
  const titleOverflow = currentTitle.length > 18
  const moreRates = useMemo(() => [1, 1.25, 1.5, 1.75, 2], [])

  const chooseRate = rate => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = rate
    setPlaybackRate(rate)
    setShowMore(false)
  }

  const chooseVolume = value => {
    const next = Math.min(1, Math.max(0, Number(value)))
    const audio = audioRef.current
    if (audio) audio.volume = next
    setVolume(next)
  }

  const skip = seconds => {
    const audio = audioRef.current
    if (!audio || !audioData?.src) return
    audio.currentTime = Math.max(0, Math.min(audio.duration || duration || Infinity, audio.currentTime + seconds))
  }

  const toggleLocked = () => {
    setLocked(value => {
      const next = !value
      if (next) setAutoHidden(false)
      return next
    })
  }

  const playLatest = async () => {
    const list = Array.isArray(latestPostsRef.current) ? latestPostsRef.current : []
    for (const post of list) {
      const src = getAudioUrl(post)
      if (!src) continue
      window.dispatchEvent(new CustomEvent('toggle-global-audio', {
        detail: {
          src,
          cover: post?.pageCoverThumbnail || post?.pageCover || '',
          title: post?.title || '念安酒馆',
          href: post?.href || ''
        }
      }))
      return
    }
    window.dispatchEvent(new CustomEvent('show-no-audio-hint', {
      detail: { message: '当前暂无音频节目，请点击节目标题查看文稿。' }
    }))
  }

  const clickProgress = event => {
    if (!duration || !audioRef.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = ratio * duration
  }

  if (!enabled || !audioData?.src) return <audio ref={audioRef} preload='metadata' aria-hidden='true' className='nianan-audio-engine' />

  const hidden = (!visible || autoHidden) && !locked

  return (
    <>
      <audio ref={audioRef} preload='metadata' className='nianan-audio-engine' />
      <div className={`nianan-global-player ${hidden ? 'nianan-global-player--hidden' : ''} ${locked ? 'nianan-global-player--locked' : ''}`}>
        <div className='nianan-global-player-inner'>
          <div className='nianan-global-cover' aria-hidden='true'>
            {coverUrl ? <img src={coverUrl} alt='' /> : <span>念安</span>}
          </div>

          <button
            type='button'
            className='nianan-global-control nianan-global-main-control'
            onClick={() => (audioRef.current?.paused ? safePlay(audioRef.current) : audioRef.current?.pause())}
            aria-label={playing ? '暂停' : '播放'}
            title={playing ? '暂停' : '播放'}>
            {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
          </button>

          <div className='nianan-global-main'>
            <div className={`nianan-global-title ${titleOverflow ? 'nianan-global-title--scroll' : ''}`}>
              <span>{currentTitle}</span>
            </div>
            <div className='nianan-global-progress-row'>
              <span>{formatTime(currentTime)}</span>
              <div className='nianan-global-progress' onClick={clickProgress} role='slider' aria-label='播放进度' aria-valuemin='0' aria-valuemax={duration || 0} aria-valuenow={currentTime}>
                <div className='nianan-global-progress-fill' style={{ width: `${progress}%` }} />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
            {error && <div className='nianan-global-error' role='status'>{error}</div>}
          </div>

          <div className='nianan-global-desktop-controls'>
            <button type='button' className='nianan-global-control' onClick={() => skip(-15)} title='后退 15 秒' aria-label='后退 15 秒'><SkipIcon /></button>
            <button type='button' className='nianan-global-control' onClick={() => skip(15)} title='前进 15 秒' aria-label='前进 15 秒'><SkipIcon forward /></button>
            <button type='button' className='nianan-global-rate' onClick={() => chooseRate(moreRates[(moreRates.indexOf(playbackRate) + 1) % moreRates.length])} title='切换倍速'>{playbackRate}×</button>
            <label className='nianan-global-volume' title={`音量 ${Math.round(volume * 100)}%`}>
              <span aria-hidden='true'>🔊</span>
              <input type='range' min='0' max='1' step='0.01' value={volume} onChange={event => chooseVolume(event.target.value)} aria-label='音量' />
            </label>
          </div>

          {mobileMore && (
            <div className='nianan-global-more-wrap'>
              <button type='button' className='nianan-global-control' onClick={() => setShowMore(value => !value)} title='更多播放控制' aria-expanded={showMore}>
                <ChevronIcon />
              </button>
              {showMore && (
                <div className='nianan-global-more-menu'>
                  <button type='button' onClick={() => skip(-15)}>后退 15 秒</button>
                  <button type='button' onClick={() => skip(15)}>前进 15 秒</button>
                  <button type='button' onClick={() => chooseRate(moreRates[(moreRates.indexOf(playbackRate) + 1) % moreRates.length])}>倍速 {playbackRate}×</button>
                  <label>音量 <input type='range' min='0' max='1' step='0.01' value={volume} onChange={event => chooseVolume(event.target.value)} /></label>
                </div>
              )}
            </div>
          )}

          {!locked && (
            <button type='button' className='nianan-global-control' onClick={() => setVisibleState(!visible)} title={visible ? '收起播放器' : '展开播放器'} aria-label={visible ? '收起播放器' : '展开播放器'}>
              <i className={visible ? 'fas fa-chevron-down' : 'fas fa-chevron-up'} aria-hidden='true' />
            </button>
          )}

          <button type='button' className={`nianan-global-control ${locked ? 'is-active' : ''}`} onClick={toggleLocked} title={locked ? '解锁播放器' : '锁定播放器'} aria-label={locked ? '解锁播放器' : '锁定播放器'}>
            <LockIcon locked={locked} />
          </button>
        </div>
      </div>
    </>
  )
}
