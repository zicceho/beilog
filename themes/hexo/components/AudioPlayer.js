import { useEffect, useState } from 'react'

export default function AudioPlayer({ src, cover, title, href }) {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const handleStateChange = (e) => {
      const { playing, currentSrc } = e.detail
      if (currentSrc === src) {
        setIsPlaying(playing)
      } else {
        setIsPlaying(false)
      }
    }
    window.addEventListener('audio-play-state-change', handleStateChange)
    return () =>
      window.removeEventListener('audio-play-state-change', handleStateChange)
  }, [src])

  const handleClick = () => {
    if (isPlaying) {
      window.dispatchEvent(new CustomEvent('pause-global-audio'))
    } else {
      window.dispatchEvent(
        new CustomEvent('play-global-audio', {
          detail: { src, cover, title, href }
        })
      )
    }
  }

  return (
    <div className='notion-audio-player-wrapper my-4 p-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md'>
      <div className='relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group cursor-pointer' onClick={handleClick}>
        {cover ? (
          <img src={cover} alt='封面' className='w-full h-full object-cover' />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white'>
            <i className='fas fa-music text-2xl' />
          </div>
        )}
        <div className='absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors'>
          <div className='w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg'>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xl text-indigo-600 ${!isPlaying ? 'translate-x-[2px]' : ''}`} />
          </div>
        </div>
      </div>

      <div className='min-w-0 flex-1'>
        <div className='font-bold text-base text-gray-800 dark:text-gray-100 truncate'>
          {title || '本期节目'}
        </div>
        <div className='text-xs text-gray-500 mt-1.5'>念安酒馆 · 点击封面开始收听</div>
      </div>
    </div>
  )
}
