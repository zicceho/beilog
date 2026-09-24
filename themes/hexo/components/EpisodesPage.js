import { useEffect } from 'react'
import { isBrowser } from '@/lib/utils'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Card from './Card'
import BlogPostCard from './BlogPostCard'
import PaginationNumber from './PaginationNumber'

const EpisodesPage = props => {
  const { archivePosts = {}, page = 1, episodesTotalPages = 1, siteInfo, posts = [] } = props
  const showSummary = siteConfig('HEXO_POST_LIST_SUMMARY', null, CONFIG)

  // 统一在这里处理 hash 滚动，/episodes 和 /episodes/page/N 都能生效
  useEffect(() => {
    if (isBrowser) {
      const anchor = window.location.hash
      if (anchor) {
        setTimeout(() => {
          const anchorElement = document.getElementById(anchor.substring(1))
          if (anchorElement) {
            anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' })
          }
        }, 300)
      }
    }
  }, [])

  return (
    <div>
      <Card className='w-full'>
        <div className='mb-10 pb-20 bg-white md:p-12 p-3 min-h-full dark:bg-hexo-black-gray'>
          {Object.keys(archivePosts).map(month => (
            <section key={month} id={month} className='mb-10'>
              <div className='text-xl font-bold mb-4 text-gray-700 dark:text-gray-300'>
                {month}
              </div>
              <div className='space-y-6'>
                {archivePosts[month].map(post => (
                  <div key={post.id} id={String(post.slug)} className='scroll-mt-24'>
                    <BlogPostCard
                      index={posts.indexOf(post) + 1}
                      post={post}
                      showSummary={showSummary}
                      siteInfo={siteInfo}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          <PaginationNumber page={page} totalPage={episodesTotalPages} />
        </div>
      </Card>
    </div>
  )
}

export default EpisodesPage
