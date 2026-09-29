import NotionPage from '@/components/NotionPage'
import FriendCard from './FriendCard'
import Card from './Card'

const FriendsPage = ({ post, friends = [] }) => {
  // 按身份分组
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

  return (
    <Card className='w-full'>
      <div className='w-full md:p-8 p-4'>
        {/* Notion 正文 */}
        {post && (
          <div className='friends-notion-content'>
            <NotionPage post={post} />
          </div>
        )}

        {/* 卡片分组 */}
        {groups.length > 0 && (
          <div className='mt-8'>
            {groups.map(group => (
              <section key={group.role} className='mb-12 last:mb-0'>
                <div className='mb-6'>
                  <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
                    {group.role}
                  </h2>
                  <div className='mt-3 border-b border-dotted border-gray-300 dark:border-gray-600' />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {group.members.map(member => (
                    <FriendCard key={member.id} member={member} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* 隐藏 Notion 原生数据库表格 */}
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
    </Card>
  )
}

export default FriendsPage
