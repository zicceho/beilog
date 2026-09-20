import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import AudioPlayer from './AudioPlayer'
import { siteConfig } from '@/lib/config'

const enhanceAudio = () => {
  const containers = document.querySelectorAll('#notion-article .notion-audio')
  const players = []
  containers.forEach(container => {
    const nativeAudio = container.querySelector('audio')
    const src = nativeAudio?.getAttribute('src')
    if (!src) return
    const originalDisplay = nativeAudio.style.display
    nativeAudio.style.display = 'none'
    const mount = document.createElement('div')
    container.appendChild(mount)
    players.push({ mount, nativeAudio, originalDisplay, src })
  })
  return players
}

export default function NotionAudioEnhancer({ post }) {
  const [players, setPlayers] = useState([])

  // 封面图优先级：文章缩略图 > 文章大图 > 站点默认背景图
  const cover = post?.pageCoverThumbnail || post?.pageCover || siteConfig('HEXO_POST_LIST_COVER_DEFAULT')
  const title = post?.title
  const href = post?.href

  useEffect(() => {
    if (typeof window === 'undefined') return
    const enhanced = enhanceAudio()
    setPlayers(enhanced)

    return () =>
      enhanced.forEach(({ mount, nativeAudio, originalDisplay }) => {
        mount.remove()
        nativeAudio.style.display = originalDisplay
      })
  }, [post?.id])

  return (
    <>
      {players.map(({ mount, src }) => (
        createPortal(<AudioPlayer src={src} cover={cover} title={title} href={href} />, mount)
      ))}
    </>
  )
}
