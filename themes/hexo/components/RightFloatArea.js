import { useCallback, useEffect, useState } from 'react'
import ButtonDarkModeFloat from './ButtonFloatDarkMode'
import ButtonJumpToTop from './ButtonJumpToTop'

export default function RightFloatArea({ floatSlot, posts }) {
  const [showFloatButton, switchShow] = useState(false)
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

    if (isNaN(per) || per < 0) per = 0
    if (per > 100) per = 100

    const shouldShow = scrollY > 100 && per > 0

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
    scrollListener()

    return () => window.removeEventListener('scroll', throttledScroll)
  }, [scrollListener])

  useEffect(() => {
    const handleAudioState = (e) => {
      setIsPlaying(e.detail.playing)
    }
    window.addEventListener('audio-play-state-change', handleAudioState)
    return () =>
      window.removeEventListener('audio-play-state-change', handleAudioState)
  }, [])

  const handleToggleAudio = () => {
    // 如果还没有任何音频数据，尝试播放最新一篇文章
    const audioData = window.__globalAudioData
    if (!audioData && posts && posts.length > 0) {
      const latestPost = posts[0]
      if (latestPost.audio) {
        window.dispatchEvent(
          new CustomEvent('play-global-audio', {
            detail: {
              src: latestPost.audio,
              cover: latestPost.pageCoverThumbnail || latestPost.pageCover,
              title: latestPost.title,
              href: latestPost.href,
              category: latestPost.category
            }
          })
        )
        return
      }
    }
    // 如果已经播放过，切换显示/隐藏
    window.dispatchEvent(new CustomEvent('toggle-global-audio'))
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
        
        {/* 右下角播客图标，点击切换播放器 */}
        <div
          onClick={handleToggleAudio}
          className='w-10 h-10 flex justify-center items-center hover:bg-indigo-600 transition-colors'
          title='展开播放器'>
          <i className={`fas fa-play-circle text-base ${isPlaying ? 'animate-pulse' : ''}`} />
        </div>

        {floatSlot}

        <ButtonJumpToTop />
      </div>
    </div>
  )
}
