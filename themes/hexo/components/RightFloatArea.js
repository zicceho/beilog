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
    const throttledScroll = () => window.requestAnimationFrame(() => scrollListener())
    window.addEventListener('scroll', throttledScroll, { passive: true })
    scrollListener()
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [scrollListener])

  useEffect(() => {
    const handleAudioState = (e) => setIsPlaying(e.detail.playing)
    window.addEventListener('audio-play-state-change', handleAudioState)
    return () => window.removeEventListener('audio-play-state-change', handleAudioState)
  }, [])

  return (
    <div
      className={
        (showFloatButton ? 'opacity-100 ' : 'invisible opacity-0') +
        ' duration-300 transition-all bottom-12 right-1 fixed z-20 text-white bg-[#3A4A7A] rounded-sm'
      }>
      <div className='flex flex-col items-center'>
        <div className='w-10 h-10 flex justify-center items-center'>
          <ButtonDarkModeFloat />
        </div>

        <div
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-global-audio'))}
          className='w-10 h-10 flex justify-center items-center hover:bg-black/20 transition-colors cursor-pointer'
          title='展开播放器'>
          <i className={`fa ${isPlaying ? 'fa-pause-circle-o' : 'fa-play-circle-o'} text-base`} />
        </div>

        {floatSlot}

        <div className='w-10 h-10 flex items-center justify-center'>
          <ButtonJumpToTop />
        </div>
      </div>
    </div>
  )
}
