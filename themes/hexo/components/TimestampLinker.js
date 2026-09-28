// themes/hexo/components/TimestampLinker.js

import { useEffect } from 'react'
import { getAudioUrl } from './AudioPlayer'

// 把 01:47 或 1:02:33 解析成秒数；不符合就返回 null
function parseTimestamp(text) {
  const match = text.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (!match) return null
  const a = parseInt(match[1], 10)
  const b = parseInt(match[2], 10)
  const c = match[3] ? parseInt(match[3], 10) : null
  if (c !== null) return a * 3600 + b * 60 + c
  return a * 60 + b
}

export default function TimestampLinker({ post }) {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const root = document.getElementById('notion-article')
    if (!root) return undefined

    const audioUrl = getAudioUrl(post)
    const audioTitle = post?.title || '念安酒馆'
    const audioCover = post?.pageCoverThumbnail || post?.pageCover || ''
    const audioHref = post?.href || ''
    const hasAudio = Boolean(audioUrl)

    let disposed = false
    const created = []

    const scan = () => {
      if (disposed) return

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
      const textNodes = []
      let node
      while ((node = walker.nextNode())) {
        const text = node.nodeValue?.trim()
        if (!text) continue
        if (parseTimestamp(text) !== null) textNodes.push(node)
      }

      textNodes.forEach(textNode => {
        const parent = textNode.parentNode
        if (!parent || parent.dataset?.hexoTs === 'true') return

        const raw = textNode.nodeValue.trim()
        const seconds = parseTimestamp(raw)
        if (seconds === null) return

        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'hexo-timestamp-btn'
        btn.dataset.seconds = String(seconds)
        btn.textContent = raw
        btn.setAttribute('aria-label', hasAudio ? `跳转到 ${raw}` : `${raw}（本文暂无音频）`)

        btn.addEventListener('click', () => {
          if (!hasAudio) {
            // 让全局播放器在自己的标题位置显示提示
            window.dispatchEvent(new CustomEvent('show-no-audio-hint', {
              detail: { message: '这篇文章没有对应的音频节目' }
            }))
            return
          }
          window.dispatchEvent(new CustomEvent('seek-global-audio', {
            detail: {
              seconds,
              src: audioUrl,
              title: audioTitle,
              cover: audioCover,
              href: audioHref
            }
          }))
        })

        parent.replaceChild(btn, textNode)
        parent.dataset.hexoTs = 'true'
        created.push({ parent, btn, originalText: textNode.nodeValue })
      })
    }

    scan()
    const timer = window.setTimeout(scan, 1200)
    const observer = new MutationObserver(scan)
    observer.observe(root, { childList: true, subtree: true })

    return () => {
      disposed = true
      window.clearTimeout(timer)
      observer.disconnect()
      created.forEach(({ parent, btn, originalText }) => {
        if (parent && btn && btn.parentNode === parent) {
          parent.replaceChild(document.createTextNode(originalText), btn)
          delete parent.dataset.hexoTs
        }
      })
    }
  }, [post?.id])

  return null
}
