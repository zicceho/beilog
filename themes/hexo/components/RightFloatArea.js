import { useCallback, useEffect, useState } from 'react'
import ButtonDarkModeFloat from './ButtonFloatDarkMode'
import ButtonJumpToTop from './ButtonJumpToTop'

/**
 * 悬浮在右下角的按钮，当页面向下滚动100px时会出现
 * 当页面回到顶部时会隐藏
 * @param {*} param0
 * @returns
 */
export default function RightFloatArea({ floatSlot }) {
  const [showFloatButton, switchShow] = useState(false)
  
  // 保留播放状态，让耳机图标有呼吸动画
  const [isPlaying, setIsPlaying] = useState(false)

  const scrollListener = useCallback(() => {
    const targetRef =
      document.getElementById('wrapper') || document.documentElement
    const clientHeight = targetRef?.clientHeight || 0
    const scrollY =
      window.pageYOffset || document.documentElement.scrollTop || 0
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0

    const fullHeight = Math.max(1, clientHeight - viewportHeight)

    let per = parseFloat(((scrollY / fullHeight) * 100).toFixed(0))

    // 完整的边界处理
    if (isNaN(per) || per < 0) per = 0
    if (per > 100) per = 100

    const shouldShow = scrollY > 100 && per > 0

    // 右下角显示悬浮按钮
    if (shouldShow !== showFloatButton) {
      switchShow(shouldShow)
    }
  }, [showFloatButton])

  useEffect(() => {
    const throttledScroll = () => {
      window.requestAnimationFrame(() => {
        scrollListener()
      })
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })

    // 初始调用一次检查初始状态
    scrollListener()

    return () => window.removeEventListener('scroll', throttledScroll)
  }, [scrollListener])

  // 监听全局音频状态，只保留播放状态（用于呼吸动画）
  useEffect(() => {
    const handleAudioState = (e) => {
      const { playing } = e.detail
      setIsPlaying(playing)
    }
    window.addEventListener('audio-play-state-change', handleAudioState)
    return () =>
      window.removeEventListener('audio-play-state-change', handleAudioState)
  }, [])

  // 点击耳机图标展开全局播放器
  const handleExpandAudio = () => {
    window.dispatchEvent(new CustomEvent('expand-global-audio'))
  }

  return (
    <div
      className={
        (showFloatButton ? 'opacity-100 ' : 'invisible opacity-0') +
        '  duration-300 transition-all bottom-12 right-1 fixed justify-end z-20  text-white bg-indigo-500 dark:bg-hexo-black-gray rounded-sm'
      }>
      <div
        className={'justify-center flex flex-col items-center cursor-pointer'}>
        <ButtonDarkModeFloat />
        
        {/* 核心改动：永远显示耳机图标，替换原来的随机逛逛 */}
        <div
          onClick={handleExpandAudio}
          className='w-10 h-10 flex justify-center items-center hover:bg-indigo-600 transition-colors'
          title='展开播放器'>
          <i className={`fas fa-headphones-alt text-lg ${isPlaying ? 'animate-pulse' : ''}`} />
        </div>

        <ButtonJumpToTop />
      </div>
    </div>
  )
}
