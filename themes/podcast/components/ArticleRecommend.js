import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

export default function ArticleRecommend({ recommendPosts = [] }) {
  if (!siteConfig('NIANAN_ARTICLE_RECOMMEND', false, CONFIG) || recommendPosts.length === 0) return null
  return (
    <section className='nianan-recommend'>
      <h2>你可能也会喜欢</h2>
      {recommendPosts.slice(0, 4).map(post => (
        <SmartLink key={post.id} href={post.href || '#'}>{post.title}</SmartLink>
      ))}
    </section>
  )
}
