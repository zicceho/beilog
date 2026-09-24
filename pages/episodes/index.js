import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { isBrowser } from '@/lib/utils'
import { DynamicLayout } from '@/themes/theme'
import { useEffect } from 'react'
import {
  EPISODES_PER_PAGE,
  sortEpisodes,
  groupEpisodesByMonth
} from '@/lib/utils/episodes'

/**
 * 节目首页 (第 1 页)
 * @param {*} props
 * @returns
 */
const EpisodesIndex = props => {
  // 注意：此处的 hash 滚动逻辑将在下一轮移动到 EpisodesPage.js 里，以实现分页页面共享。
  // 目前为了保证首页功能完整，暂时保留。
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

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutEpisodes' {...props} />
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'episodes-index', locale })

  // 严格过滤：只取已发布的 Post
  const allPosts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  ) || []

  // 排序并截取第一页 12 条
  const sortedPosts = sortEpisodes(allPosts)
  const pagePosts = sortedPosts.slice(0, EPISODES_PER_PAGE)

  props.posts = pagePosts
  props.page = 1
  props.episodesTotalPages = Math.ceil(sortedPosts.length / EPISODES_PER_PAGE)
  props.archivePosts = groupEpisodesByMonth(pagePosts)

  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default EpisodesIndex
