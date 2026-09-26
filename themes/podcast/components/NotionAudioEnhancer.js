import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import AudioPlayer from './AudioPlayer'

export default function NotionAudioEnhancer({ post }) {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const root = document.getElementById('notion-article')
    if (!root) return undefined

    let disposed = false
    const created = []

    const scan = () => {
      if (disposed) return
      const next = []
      root.querySelectorAll('.notion-audio').forEach((container, index) => {
        if (container.dataset.niananEnhanced === 'true') return
        const nativeAudio = container.querySelector('audio')
        const src = nativeAudio?.currentSrc || nativeAudio?.getAttribute('src') || ''
        if (!src) return

        const originalDisplay = nativeAudio.style.display
        nativeAudio.style.display = 'none'
        const mount = document.createElement('div')
        mount.className = 'nianan-notion-audio-mount'
        mount.dataset.niananAudioIndex = String(index)
        container.appendChild(mount)
        container.dataset.niananEnhanced = 'true'
        created.push({ container, nativeAudio, originalDisplay, mount })
        next.push({ mount, src, key: `${post?.id || 'post'}-${index}-${src}` })
      })

      if (next.length) {
        setPlayers(existing => [...existing, ...next])
      }
    }

    scan()
    const timer = window.setTimeout(scan, 800)
    const observer = new MutationObserver(scan)
    observer.observe(root, { childList: true, subtree: true })

    return () => {
      disposed = true
      window.clearTimeout(timer)
      observer.disconnect()
      created.forEach(({ container, nativeAudio, originalDisplay, mount }) => {
        nativeAudio.style.display = originalDisplay
        container.dataset.niananEnhanced = 'false'
        mount.remove()
      })
      setPlayers([])
    }
  }, [post?.id])

  if (!players.length) return null

  return (
    <>
      {players.map(player => createPortal(
        <AudioPlayer
          key={player.key}
          src={player.src}
          title={post?.title}
          cover={post?.pageCoverThumbnail || post?.pageCover}
          href={post?.href}
          compact
        />,
        player.mount,
        player.key
      ))}
    </>
  )
}
