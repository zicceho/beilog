import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import AudioPlayer, { getAudioUrl } from './AudioPlayer'

export default function EpisodeCard({ post, featured = false }) {
  const { locale } = useGlobal()
  const audioUrl = getAudioUrl(post)
  const ext = post?.ext && typeof post.ext === 'object' ? post.ext : null
  const hosts = Array.isArray(ext?.hosts) ? ext.hosts : Array.isArray(ext?.authors) ? ext.authors : []
  return (
    <article className={`nianan-entry ${featured ? 'nianan-entry--featured' : ''}`}>
      {post?.category && (
        <SmartLink href={`/category/${encodeURIComponent(post.category)}`} className='nianan-entry-category'>
          {post.category}
        </SmartLink>
      )}
      <h2 className='nianan-entry-title'>
        <SmartLink href={post?.href || '#'}>{post?.title}</SmartLink>
      </h2>
      <div className='nianan-entry-meta'>
        {post?.publishDay && <span>{post.publishDay}</span>}
        {hosts.length > 0 && <span>{hosts.join(', ')}</span>}
        {post?.tagItems?.length > 0 && (
          <span>{post.tagItems.map(tag => `#${tag.name}`).join(' ')}</span>
        )}
      </div>
      {audioUrl && <AudioPlayer post={post} compact={!featured} />}
      {post?.summary && (
        <p className='nianan-entry-summary'>{post.summary}</p>
      )}
      <SmartLink href={post?.href || '#'} className='nianan-entry-more'>
        {locale?.COMMON?.MORE || '阅读全文'}
      </SmartLink>
    </article>
  )
}
