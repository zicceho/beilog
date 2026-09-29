import SmartLink from '@/components/SmartLink'

const FriendCard = ({ member }) => {
  const isOnline = member.status === '在馆'

  return (
    <div className='flex flex-col items-center p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[var(--hexo-color-card)] transition-all duration-200 hover:shadow-md'>
      {/* 头像 + 状态点 */}
      <div className='relative mb-3'>
        {member.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatar}
            alt={member.name}
            className='w-20 h-20 rounded-full object-cover'
          />
        ) : (
          <div className='w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-[#7B8BC4] to-[#3A4A7A]'>
            {member.name.charAt(0)}
          </div>
        )}
        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[var(--hexo-color-card)] ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>

      {/* 昵称 */}
      <SmartLink
        href={`/tag/${encodeURIComponent(member.name)}`}
        className='text-base font-bold text-gray-800 dark:text-gray-100 hover:text-[var(--theme-color)] transition-colors mb-1'>
        {member.name}
      </SmartLink>

      {/* 头衔 */}
      {member.title && (
        <div className='text-xs text-gray-500 dark:text-gray-400 mb-3'>
          {member.title}
        </div>
      )}

      {/* 关注按钮 */}
      {member.weibo && (
        <a
          href={member.weibo}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-auto px-4 py-1 text-xs rounded-full border border-[var(--theme-color)] text-[var(--theme-color)] hover:bg-[var(--theme-color)] hover:text-white transition-colors'>
          +关注
        </a>
      )}
    </div>
  )
}

export default FriendCard
