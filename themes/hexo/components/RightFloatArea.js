import { useCallback, useEffect, useState } from 'react'
import ButtonDarkModeFloat from './ButtonFloatDarkMode'
import ButtonJumpToTop from './ButtonJumpToTop'

export default function RightFloatArea({ floatSlot }) {
  const [showFloatButton, switchShow] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const scrollListener = useCallback(() => {
    const targetRef = document.getElementById('wrapper') || document.documentElement
    const clientHeight = targetRef?.clientHeight || 0
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0
    const fullHeight = Math.max(1, clientHeight - viewportHeight)
    let per = parseFloat(((scrollY / fullHeight) * 100).toFixed(0))
    if (isNaN(per) || per < 0) per = 0
    if (per > 100) per = 100
    const shouldShow = scrollY > 100 && per > 0
    if (shouldShow !== showFloatButton) switchShow(shouldShow)
  }, [showFloatButton])

  useEffect(() => {
    const throttledScroll = () => {
      window.requestAnimationFrame(() => scrollListener())
    }
    window.addEventListener('scroll', throttledScroll, { passive: true })
    scrollListener()
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [scrollListener])

  useEffect(() => {
    const handleAudioState = (e) => {
      setIsPlaying(e.detail.playing)
    }
    window.addEventListener('audio-play-state-change', handleAudioState)
    return () => window.removeEventListener('audio-play-state-change', handleAudioState)
  }, [])

  return (
    <div
      className={
        (showFloatButton ? 'opacity-100 ' : 'invisible opacity-0') +
        '  duration-300 transition-all bottom-12 right-1 fixed justify-end z-20  text-white bg-indigo-500 dark:bg-hexo-black-gray rounded-sm'
      }>
      <div className={'justify-center flex flex-col items-center cursor-pointer'}>
        <ButtonDarkModeFloat />
        
        {/* 保持原来的图标（fa-random），点击触发播放器展开 */}
        <div
          onClick={() => window.dispatchEvent(new CustomEvent('expand-global-audio'))}
          className='w-10 h-10 flex justify-center items-center hover:bg-indigo-600 transition-colors'
          title='展开播放器'>
          <i className={`fas fa-random text-base ${isPlaying ? 'animate-pulse' : ''}`} />
        </div>

        {/* 保留原有的评论等按钮 */}
        {floatSlot}

        <ButtonJumpToTop />
      </div>
    </div>
  )
}
