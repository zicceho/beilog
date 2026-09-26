import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

export default function Pagination({ page = 1, totalPage = 1 }) {
  const router = useRouter()
  if (totalPage <= 1) return null

  const rawPath = String(router.asPath || '').split('?')[0]
  const pagePrefix = rawPath
    .replace(/\/page\/[1-9]\d*\/?$/, '')
    .replace(/\/$/, '')
  const base = pagePrefix || ''
  const hrefFor = target => target === 1 ? `${base}/` : `${base}/page/${target}`

  return (
    <nav className='nianan-pagination' aria-label='分页'>
      {page > 1 ? <SmartLink href={hrefFor(page - 1)}>← 上一页</SmartLink> : <span />}
      <span>{page} / {totalPage}</span>
      {page < totalPage ? <SmartLink href={hrefFor(page + 1)}>下一页 →</SmartLink> : <span />}
    </nav>
  )
}
