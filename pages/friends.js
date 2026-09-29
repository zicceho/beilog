import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'
import { Client } from '@notionhq/client'

const FRIENDS_DB_ID = '3e91137a265a80d19b7bca7ee29ae8a1'

const Friends = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutFriends' {...props} />
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'friends', locale })

  let friends = []
  const token = process.env.NOTION_API_TOKEN

  if (token) {
    try {
      const notion = new Client({ auth: token })
      const response = await notion.databases.query({
        database_id: FRIENDS_DB_ID,
        page_size: 100
      })

      friends = response.results.map(page => {
        const p = page.properties || {}

        const name = p['昵称']?.title?.[0]?.plain_text || ''

        let avatar = ''
        const filesArr = p['头像']?.files || []
        if (filesArr.length > 0) {
          const f = filesArr[0]
          avatar =
            f.type === 'external' ? f.external?.url : f.file?.url
        }

        const role = p['身份']?.select?.name || ''
        const title = p['头衔']?.select?.name || ''
        const status = p['状态']?.select?.name || ''

        let weibo = p['微博']?.url || ''
        if (weibo && !weibo.startsWith('http')) {
          weibo = 'https://' + weibo
        }

        const order = p['排序']?.number ?? 999

        return {
          id: page.id,
          name,
          avatar,
          role,
          title,
          status,
          weibo,
          order
        }
      })

      // 过滤掉隐藏的和没有昵称的
      friends = friends.filter(f => f.status !== '隐藏' && f.name)

      // 按排序字段升序
      friends.sort((a, b) => a.order - b.order)
    } catch (e) {
      console.error('[friends] 获取友链数据失败:', e)
    }
  }

  props.friends = friends
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

export default Friends
