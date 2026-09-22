import { useCallback, useEffect, useState } from 'react'
import ButtonDarkModeFloat from './ButtonFloatDarkMode'
import ButtonJumpToTop from './ButtonJumpToTop'

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

const parseExt = (ext) => {
  if (!ext) return null
  const raw = typeof ext === 'string' ? ext.trim() : ''
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.audio) return parsed.audio
  } catch (e) {}
  if (raw.startsWith('http')) return raw
  return null
}

export default function RightFloatArea({ floatSlot, posts }) {
  const [showFloatButton, switchShow] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasAudio, setHasAudio] = useState(false)
  const [locked, setLocked] = useState(false)

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
    const onState = (e) => {
      setIsPlaying(e.detail.playing)
      setHasAudio(!!e.detail.hasAudio)
      setLocked(!!e.detail.locked)
    }
    window.addEventListener('global-audio-state', onState)
    return () => window.removeEventListener('global-audio-state', onState)
  }, [])

  const handleClick = () => {
    if (hasAudio) {
      window.dispatchEvent(new CustomEvent('toggle-player-visibility'))
      return
    }
    const list = posts || []
    for (let i = 0; i < list.length; i++) {
      const p = list[i]
      const audioUrl = p?.audio || parseExt(p?.ext)
      if (audioUrl) {
        window.dispatchEvent(
          new CustomEvent('toggle-global-audio', {
            detail: {
              src: audioUrl,
              cover: p.pageCoverThumbnail || p.pageCover,
              title: p.title,
              href: p.href
            }
          })
        )
        return
      }
    }
    window.dispatchEvent(
      new CustomEvent('show-no-audio-hint', {
        detail: { message: '当前暂无音频节目，请点击节目页面或标题播放' }
      })
    )
  }

  return (
    <div
      className={
        (showFloatButton ? 'opacity-100 ' : 'invisible opacity-0') +
        ' duration-300 transition-all bottom-12 right-1 fixed z-20 text-white bg-[#3A4A7A] dark:bg-hexo-black-gray rounded-sm'
      }>
      <div className='justify-center flex flex-col items-center cursor-pointer'>
        {!locked && (
          <div
            onClick={handleClick}
            className='justify-center items-center w-7 h-7 text-center transform hover:scale-105 duration-200'
            title='展开/收起播放器'>
            {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
          </div>
        )}
        <ButtonDarkModeFloat />
        {floatSlot}
        <ButtonJumpToTop />
      </div>
    </div>
  )
}
