import NotionPage from '@/components/NotionPage'
import Comment from '@/components/Comment'
import FriendCard from './FriendCard'

const ROLE_ORDER = ['守夜人', '夜谈人', '酿酒人', '调酒人']

const FriendsPage = ({ post, friends = [] }) => {
  const groups = []
  const groupMap = {}
  ;(friends || []).forEach(f => {
    const role = f.role || '其他'
    if (!groupMap[role]) {
      groupMap[role] = { role, members: [] }
      groups.push(groupMap[role])
    }
    groupMap[role].members.push(f)
  })

  groups.sort((a, b) => {
    const ia = ROLE_ORDER.indexOf(a.role)
    const ib = ROLE_ORDER.indexOf(b.role)
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib)
  })

  return (
    <div className='w-full lg:hover:shadow lg:border rounded-t-xl lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray dark:border-black article'>
      <div className='w-full md:px-5 px-2'>
        {/* Notion 正文：页面里写的所有文字、图片、引用都会照常显示 */}
        {post && (
          <div className='friends-notion-content'>
            <NotionPage post={post} />
          </div>
        )}

        {/* 卡片分组 */}
        {groups.length > 0 && (
          <div className='mt-8'>
            {groups.map(group => (
              <section key={group.role} className='mb-10 last:mb-0'>
                <div className='mb-5'>
                  <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
                    {group.role}
                  </h2>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4'>
                  {group.members.map(member => (
                    <FriendCard key={member.id} member={member} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* 评论区 */}
        {post && (
          <div className='mt-10 duration-200 overflow-x-auto px-3'>
            <Comment frontMatter={post} />
          </div>
        )}

        {/* 只隐藏 Notion 原生数据库表格，其他内容一律不隐藏 */}
        <style jsx global>{`
          .friends-notion-content .notion-collection,
          .friends-notion-content .notion-collection-view,
          .friends-notion-content .notion-collection-view-tabs-content,
          .friends-notion-content .notion-table,
          .friends-notion-content .notion-board,
          .friends-notion-content .notion-gallery,
          .friends-notion-content [class*='notion-collection'],
          .friends-notion-content [class*='notion-table'],
          .friends-notion-content [class*='notion-board'],
          .friends-notion-content [class*='notion-gallery'] {
            display: none !important;
          }
        `}</style>
      </div>
    </div>
  )
}

export default FriendsPage
