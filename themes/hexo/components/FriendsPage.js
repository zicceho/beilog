import FriendCard from './FriendCard'

const FriendsPage = ({ friends = [] }) => {
  if (!friends || friends.length === 0) {
    return (
      <div className='w-full text-center py-20 text-gray-500'>
        暂无成员
      </div>
    )
  }

  // 按身份分组（保留数据里的先后顺序）
  const groups = []
  const groupMap = {}
  friends.forEach(f => {
    const role = f.role || '其他'
    if (!groupMap[role]) {
      groupMap[role] = []
      groups.push({ role, members: [] })
    }
    groupMap[role].push(f)
  })

  return (
    <div className='w-full'>
      {groups.map(group => (
        <section key={group.role} className='mb-12'>
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
  )
}

export default FriendsPage
