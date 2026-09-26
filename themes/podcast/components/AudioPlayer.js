import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const PlayIcon = ({ size = 14 }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='currentColor' aria-hidden='true' style={{ marginLeft: '1px' }}>
    <path d='M8 5v14l11-7z' />
  </svg>
)

const PauseIcon = ({ size = 14 }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='currentColor' aria-hidden='true'>
    <rect x='6' y='5' width='4' height='14' rx='1' />
    <rect x='14' y='5' width='4' height='14' rx='1' />
  </svg>
)

function parseExt(ext) {
  if (!ext) return null
  if (typeof ext === 'object') return ext
  if (typeof ext !== 'string') return null
  const value = ext.trim()
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return value.startsWith('http://') || value.startsWith('https://') ? { audio: value } : null
  }
}

export function getAudioUrl(post) {
  const ext = parseExt(post?.ext)
  return (
    post?.audioUrl ||
    post?.audio ||
    ext?.audioUrl ||
    ext?.audio ||
    null
  )
}

function formatTime(value) {
  if (!Number.isFinite(value) || value <= 0) return '00:00'
  const total = Math.floor(value)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function AudioPlayer({ post, src, title, cover, href, compact = false }) {
  const audioUrl = src || getAudioUrl(post)
  const enabled = siteConfig('NIANAN_AUDIO_ENABLE', true, CONFIG)
  const preload = siteConfig('NIANAN_AUDIO_PRELOAD', 'metadata', CONFIG)
  const engineRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [localDuration, setLocalDuration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')
  const autoplayTriggeredRef = useRef('')

  useEffect(() => {
    const engine = engineRef.current
    if (!engine || !audioUrl) return undefined
    const onMetadata = event => {
      const dur = event.currentTarget.duration || 0
      setLocalDuration(dur)
      if (currentSrc !== audioUrl) setRemaining(dur)
    }
    engine.addEventListener('loadedmetadata', onMetadata)
    return () => engine.removeEventListener('loadedmetadata', onMetadata)
  }, [audioUrl, currentSrc])

  useEffect(() => {
    if (typeof window === 'undefined' || !audioUrl) return undefined
    const autoplay = siteConfig('NIANAN_AUDIO_AUTOPLAY', false, CONFIG)
    if (!compact && autoplay && autoplayTriggeredRef.current !== audioUrl) {
      autoplayTriggeredRef.current = audioUrl
      window.dispatchEvent(new CustomEvent('toggle-global-audio', {
        detail: {
          src: audioUrl,
          cover: cover || post?.pageCoverThumbnail || post?.pageCover || '',
          title: title || post?.title || '念安酒馆',
          href: href || post?.href || ''
        }
      }))
    }
    const onState = event => {
      const detail = event?.detail || {}
      const same = detail.src === audioUrl
      setCurrentSrc(detail.src || '')
      if (same) {
        const duration = detail.duration || localDuration || 0
        const current = detail.currentTime || 0
        setProgress(duration > 0 ? Math.min(100, (current / duration) * 100) : 0)
        setRemaining(Math.max(0, duration - current))
        setPlaying(Boolean(detail.playing))
      } else {
        setProgress(0)
        setRemaining(localDuration)
        setPlaying(false)
      }
    }
    window.addEventListener('global-audio-state', onState)
    return () => window.removeEventListener('global-audio-state', onState)
  }, [audioUrl, localDuration, compact, cover, post?.pageCoverThumbnail, post?.pageCover, title, post?.title, href, post?.href])

  if (!enabled || !audioUrl) return null

  const handlePlay = () => {
    window.dispatchEvent(new CustomEvent('toggle-global-audio', {
      detail: {
        src: audioUrl,
        cover: cover || post?.pageCoverThumbnail || post?.pageCover || '',
        title: title || post?.title || '念安酒馆',
        href: href || post?.href || ''
      }
    }))
  }

  const handleProgressClick = () => {
    window.dispatchEvent(new CustomEvent('toggle-player-visibility'))
  }

  const displayDuration = currentSrc === audioUrl && localDuration ? localDuration : remaining || localDuration
  const shownTime = currentSrc === audioUrl && playing ? remaining : displayDuration

  return (
    <div className={`nianan-mini-audio ${compact ? 'nianan-mini-audio--compact' : ''}`}>
      <audio ref={engineRef} preload={compact ? 'none' : preload} src={audioUrl} aria-hidden='true' />
      <button type='button' className='nianan-mini-audio-play' onClick={handlePlay} aria-label={playing ? '暂停音频' : '播放音频'} title={playing ? '暂停' : '播放'}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button type='button' className='nianan-mini-audio-track' onClick={handleProgressClick} aria-label='显示播放器'>
        <span className='nianan-mini-audio-fill' style={{ width: `${progress}%` }} />
      </button>
      <span className='nianan-mini-audio-time'>{formatTime(shownTime)}</span>
    </div>
  )
}
