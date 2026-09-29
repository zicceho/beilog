import SmartLink from '@/components/SmartLink'

const FriendCard = ({ member }) => {
  const isOnline = member.status === '在馆'

  return (
    <div className='flex flex-col items-center p-4 rounded-xl bg-[var(--hexo-color-card)] transition-all duration-200 hover:shadow-md'>
      {/* 头像 + 状态点 */}
      <div className='relative mb-3'>
        {member.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatar}
            alt={member.name}
            className='w-16 h-16 rounded-full object-cover'
          />
        ) : (
          <div className='w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-[#7B8BC4] to-[#3A4A7A]'>
            {member.name.charAt(0)}
          </div>
        )}
        <span
          className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-[var(--hexo-color-card)] ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>

      {/* 昵称 */}
      <SmartLink
        href={`/tag/${encodeURIComponent(member.name)}`}
        className='text-sm font-bold text-gray-800 dark:text-gray-100 hover:text-[var(--theme-color)] transition-colors truncate max-w-full text-center mb-1'>
        {member.name}
      </SmartLink>

      {/* 头衔 */}
      {member.title && (
        <div className='text-xs text-gray-500 dark:text-gray-400 text-center mb-3'>
          {member.title}
        </div>
      )}

      {/* 关注按钮 */}
      {member.weibo && (
        <a
          href={member.weibo}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-auto px-3 py-0.5 text-xs rounded-full border border-[var(--theme-color)] text-[var(--theme-color)] hover:bg-[var(--theme-color)] hover:text-white transition-colors'>
          +关注
        </a>
      )}
    </div>
  )
}

export default FriendCard
