import SmartLink from '@/components/SmartLink'

export default function ArticleAdjacent({ prev, next }) {
  if (!prev && !next) return null
  return (
    <nav className='nianan-adjacent' aria-label='上一篇和下一篇'>
      {prev ? (
        <SmartLink href={prev.href || '#'} className='nianan-adjacent-item'>
          <span>上一篇</span>
          <strong>{prev.title}</strong>
        </SmartLink>
      ) : <span />}
      {next ? (
        <SmartLink href={next.href || '#'} className='nianan-adjacent-item nianan-adjacent-item--next'>
          <span>下一篇</span>
          <strong>{next.title}</strong>
        </SmartLink>
      ) : <span />}
    </nav>
  )
}
