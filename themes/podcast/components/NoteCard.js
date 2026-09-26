import SmartLink from '@/components/SmartLink'

export default function NoteCard({ post }) {
  return (
    <article className='nianan-note'>
      {post?.category && (
        <SmartLink href={`/category/${encodeURIComponent(post.category)}`} className='nianan-note-category'>
          {post.category}
        </SmartLink>
      )}
      <h3 className='nianan-note-title'>
        <SmartLink href={post?.href || '#'}>{post?.title}</SmartLink>
      </h3>
      <div className='nianan-note-meta'>{post?.publishDay}</div>
      {post?.summary && <p className='nianan-note-summary'>{post.summary}</p>}
      <SmartLink href={post?.href || '#'} className='nianan-note-more'>
        阅读全文
      </SmartLink>
    </article>
  )
}
