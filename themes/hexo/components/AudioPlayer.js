import { useEffect, useState } from 'react'

export default function AudioPlayer({ src, cover, title, href }) {
  const [isPlaying, setIsPlaying] = useState(false)

  // 监听全局播放状态变化，更新自己的图标
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
    // 如果已经在播放这首歌，就暂停；否则播放
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
    <div className='notion-audio-player-wrapper my-4 p-3 border dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center gap-4'>
      {/* 方形封面 + 大播放按钮 */}
      <div className='relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group cursor-pointer' onClick={handleClick}>
        {cover ? (
          <img src={cover} alt='封面' className='w-full h-full object-cover' />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white'>
            <i className='fas fa-music text-2xl' />
          </div>
        )}
        {/* 半透明遮罩 + 播放按钮 */}
        <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
          <div className='w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg'>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xl text-indigo-600 ml-0.5`} />
          </div>
        </div>
        {/* 默认显示的播放图标（不 hover 时也可见） */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-lg group-hover:opacity-0 transition-opacity'>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xl text-indigo-600 ml-0.5`} />
          </div>
        </div>
      </div>

      {/* 文字信息 */}
      <div className='min-w-0 flex-1'>
        <div className='font-bold text-sm text-gray-700 dark:text-gray-200 truncate'>
          {title || '本期节目'}
        </div>
        <div className='text-xs text-gray-500 mt-1'>念安酒馆 · 点击封面开始收听</div>
      </div>
    </div>
  )
}
