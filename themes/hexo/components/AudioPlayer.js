import { useEffect, useRef, useState } from 'react'

const formatRemaining = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `-${mins}:${secs.toString().padStart(2, '0')}`
}

const PlayIcon = ({ size = 14 }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='currentColor' style={{ marginLeft: '1px' }}>
    <path d='M8 5v14l11-7z' />
  </svg>
)
const PauseIcon = ({ size = 14 }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='currentColor'>
    <rect x='6' y='5' width='4' height='14' rx='1' />
    <rect x='14' y='5' width='4' height='14' rx='1' />
  </svg>
)

export default function AudioPlayer({ src, title, cover, href }) {
  const [progress, setProgress] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [localDuration, setLocalDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCurrentSrc, setIsCurrentSrc] = useState(false)
  const localAudioRef = useRef(null)

  useEffect(() => {
    const onState = (e) => {
      const { src: currentSrc, playing, currentTime, duration, hasAudio } = e.detail
      if (hasAudio && currentSrc === src) {
        setIsCurrentSrc(true)
        setIsPlaying(playing)
        const dur = duration || localDuration
        if (dur > 0) {
          setProgress((currentTime / dur) * 100)
          setRemaining(Math.max(0, dur - currentTime))
        }
      } else {
        setIsCurrentSrc(false)
        setIsPlaying(false)
        setProgress(0)
        setRemaining(localDuration)
      }
    }
    window.addEventListener('global-audio-state', onState)
    return () => window.removeEventListener('global-audio-state', onState)
  }, [src, localDuration])

  const handleMetadata = (e) => {
    const dur = e.target.duration || 0
    setLocalDuration(dur)
    if (!isCurrentSrc) {
      setRemaining(dur)
    }
  }

  const handleButtonClick = (e) => {
    e.stopPropagation()
    window.dispatchEvent(
      new CustomEvent('toggle-global-audio', {
        detail: { src, title, cover, href }
      })
    )
  }

  const handleProgressClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.dispatchEvent(new CustomEvent('toggle-player-visibility'))
  }

  return (
    <div className='my-4 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700'>
      <audio
        ref={localAudioRef}
        src={src}
        preload='metadata'
        onLoadedMetadata={handleMetadata}
        style={{ display: 'none' }}
      />
      <button
        onClick={handleButtonClick}
        className='flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105 text-white'
        style={{ backgroundColor: '#3A4A7A' }}>
        {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
      </button>

      <div
        onClick={handleProgressClick}
        className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer'>
        <div
          className='h-full rounded-full transition-all duration-300'
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8B9BD4 0%, #4A5A8A 50%, #3A4A7A 100%)'
          }}
        />
      </div>

      <span className='text-xs text-gray-500 tabular-nums whitespace-nowrap'>
        {formatRemaining(remaining)}
      </span>
    </div>
  )
}
