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
  
  // 新增：控制音频图标显示状态
  const [hasAudio, setHasAudio] = useState(false)
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

  // 新增：监听全局音频状态
  useEffect(() => {
    const handleAudioState = (e) => {
      const { playing, currentSrc } = e.detail
      setHasAudio(!!currentSrc) // 如果有音频链接，就标记为 true
      setIsPlaying(playing)
    }
    window.addEventListener('audio-play-state-change', handleAudioState)
    return () =>
      window.removeEventListener('audio-play-state-change', handleAudioState)
  }, [])

  // 新增：点击耳机图标展开全局播放器
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
        
        {/* 这里是修改的核心：如果有音频，第三个位置就变成耳机图标；否则保持原来的随机逛逛 */}
        {hasAudio ? (
          <div
            onClick={handleExpandAudio}
            className='w-10 h-10 flex justify-center items-center hover:bg-indigo-600 transition-colors'
            title='展开播放器'>
            <i className={`fas fa-headphones-alt ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>
        ) : (
          floatSlot
        )}
        
        <ButtonJumpToTop />
      </div>
    </div>
  )
}
