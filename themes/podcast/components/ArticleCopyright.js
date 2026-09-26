import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

export default function ArticleCopyright({ post }) {
  const enabled = siteConfig('NIANAN_ARTICLE_COPYRIGHT', false, CONFIG)
  if (!enabled || !post) return null
  return (
    <section className='nianan-copyright'>
      <div>作者：{siteConfig('AUTHOR', '念安酒馆')}</div>
      <div>原文：{siteConfig('LINK', '')}{post.href || ''}</div>
    </section>
  )
}
