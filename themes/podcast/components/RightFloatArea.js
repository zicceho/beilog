import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import { getAudioUrl } from './AudioPlayer'

export default function RightFloatArea({ post, posts = [] }) {
  const { isDarkMode, updateDarkMode, locale } = useGlobal()
  const [visible, setVisible] = useState(false)
  const [audioState, setAudioState] = useState({ hasAudio: false, visible: false, locked: false })

  useEffect(() => {
    const onScroll = () => setVisible((window.pageYOffset || document.documentElement.scrollTop || 0) > 220)
    const onAudioState = event => setAudioState(event?.detail || {})
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('global-audio-state', onAudioState)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('global-audio-state', onAudioState)
    }
  }, [])

  if (!siteConfig('NIANAN_FLOAT_ENABLE', true, CONFIG)) return null

  const toggleDark = () => {
    const next = !isDarkMode
    saveDarkModeToLocalStorage(next)
    updateDarkMode(next)
    const html = document.documentElement
    html.classList.remove(next ? 'light' : 'dark')
    html.classList.add(next ? 'dark' : 'light')
  }

  const jumpTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const jumpComment = () => {
    const el = document.getElementById('comment') || document.querySelector('[data-comment-root]')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleAudioPanel = () => {
    if (audioState.hasAudio) {
      window.dispatchEvent(new CustomEvent('toggle-player-visibility'))
      return
    }

    const sourceList = Array.isArray(posts) ? posts : []
    for (const item of sourceList) {
      const src = getAudioUrl(item)
      if (!src) continue
      window.dispatchEvent(new CustomEvent('toggle-global-audio', {
        detail: {
          src,
          cover: item?.pageCoverThumbnail || item?.pageCover || '',
          title: item?.title || '念安酒馆',
          href: item?.href || ''
        }
      }))
      return
    }

    window.dispatchEvent(new CustomEvent('show-no-audio-hint', {
      detail: { message: '当前暂无音频节目，请点击标题查看文稿。' }
    }))
  }

  return (
    <div className={`nianan-float ${visible ? 'nianan-float--visible' : ''}`}>
      <button type='button' title={isDarkMode ? '浅色模式' : '深色模式'} onClick={toggleDark}>
        <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'} aria-hidden='true' />
      </button>
      {post && (
        <button type='button' title={locale?.POST?.COMMENT || '查看评论'} onClick={jumpComment}>
          <i className='fas fa-comment' aria-hidden='true' />
        </button>
      )}
      {siteConfig('NIANAN_FLOAT_AUDIO_CONTROL', true, CONFIG) && !audioState.locked && (
        <button type='button' title={audioState.hasAudio ? '展开 / 收起播放器' : '播放最新节目'} onClick={toggleAudioPanel}>
          <i className={audioState.hasAudio && audioState.visible ? 'fas fa-chevron-down' : 'fas fa-headphones'} aria-hidden='true' />
        </button>
      )}
      <button type='button' title={locale?.POST?.TOP || '回到顶部'} onClick={jumpTop}>
        <i className='fas fa-arrow-up' aria-hidden='true' />
      </button>
    </div>
  )
}
