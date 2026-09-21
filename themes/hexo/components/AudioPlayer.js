import { useEffect, useState } from 'react'

const formatRemaining = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `-${mins}:${secs.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src }) {
  const [progress, setProgress] = useState(0)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    const onState = (e) => {
      const { src: currentSrc, playing, currentTime, duration } = e.detail
      if (currentSrc === src && duration > 0) {
        setProgress((currentTime / duration) * 100)
        setRemaining(Math.max(0, duration - currentTime))
      }
    }
    window.addEventListener('global-audio-state', onState)
    return () => window.removeEventListener('global-audio-state', onState)
  }, [src])

  const handleProgressClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.dispatchEvent(new CustomEvent('toggle-player-visibility'))
  }

  return (
    <div className='my-4 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700'>
      <button
        onClick={() =>
          window.dispatchEvent(new CustomEvent('toggle-global-audio', { detail: { src } }))
        }
        className='flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105'
        style={{ backgroundColor: '#3A4A7A' }}>
        <i className='fa-solid fa-circle-play text-sm text-white' />
      </button>

      <div
        onClick={handleProgressClick}
        className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer'>
        <div
          className='h-full rounded-full transition-all duration-300'
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #5A6A9A 0%, #3A4A7A 100%)' }}
        />
      </div>

      <span className='text-xs text-gray-500 tabular-nums whitespace-nowrap'>
        {formatRemaining(remaining)}
      </span>
    </div>
  )
}
