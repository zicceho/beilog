import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'
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
