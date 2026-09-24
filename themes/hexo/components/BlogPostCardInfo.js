import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { getCategoryUrl } from '@/lib/utils/category'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'

export const BlogPostCardInfo = ({
  post,
  showPreview,
  showPageCover,
  showSummary
}) => {
  const { NOTION_CONFIG } = useGlobal()

  // 嘉宾（标签）最多显示 3 个，超出用 +N
  const guests = post?.tagItems || []
  const visibleGuests = guests.slice(0, 3)
  const extraCount = guests.length - 3

  return (
    <article
      className={`flex flex-col justify-between lg:p-6 p-4 lg:px-8 px-6 ${showPageCover && !showPreview ? 'md:w-[62%] w-full md:max-h-60' : 'w-full'}`}>
      <div>
        <header>
          <h2>
            <SmartLink
              href={post?.href}
              passHref
              className={`line-clamp-2 replace cursor-pointer text-2xl ${
                showPreview ? 'text-center' : ''
              } leading-tight font-bold text-gray-600 dark:text-gray-100 hover:text-indigo-700 dark:hover:text-indigo-400`}>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon icon={post.pageIcon} />
              )}
              <span className='menu-link '>{post.title}</span>
            </SmartLink>
          </h2>

          {/* 元信息行：栏目 / 日期 / 嘉宾 */}
          <div
            className={`flex mt-2 items-center ${
              showPreview ? 'justify-center' : 'justify-start'
            } flex-wrap text-sm dark:text-gray-500 text-gray-400`}>
            {post?.category && (
              <>
                <SmartLink
                  href={getCategoryUrl(post.category, NOTION_CONFIG)}
                  passHref
                  className='cursor-pointer font-bold menu-link hover:text-indigo-700 dark:hover:text-indigo-400 transform'>
                  {post.category}
                </SmartLink>
                <span className='mx-1.5 text-gray-300 dark:text-gray-700'>
                  /
                </span>
              </>
            )}

            <SmartLink
              href={`/episodes#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
              passHref
              className='font-light menu-link cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-400 transform'>
              {post?.publishDay || post.date}
            </SmartLink>

            {visibleGuests.length > 0 && (
              <>
                <span className='mx-1.5 text-gray-300 dark:text-gray-700'>
                  /
                </span>
                <span className='font-light'>
                  {visibleGuests.map(t => t.name).join('、')}
                  {extraCount > 0 ? ` +${extraCount}` : ''}
                </span>
              </>
            )}

            <TwikooCommentCount
              className='ml-2 hover:text-indigo-700 dark:hover:text-indigo-400'
              post={post}
            />
          </div>
        </header>

        {(!showPreview || showSummary) && !post.results && (
          <main className='line-clamp-2 replace my-3 text-gray-700  dark:text-gray-300 text-md font-normal'>
            {post.summary}
          </main>
        )}

        {post.results && (
          <p className='line-clamp-2 mt-4 text-gray-700 dark:text-gray-300 text-sm font-light'>
            {post.results.map((r, index) => (
              <span key={index}>{r}</span>
            ))}
          </p>
        )}

        {showPreview && (
          <div className='overflow-ellipsis truncate'>
            <NotionPage post={post} />
          </div>
        )}
      </div>
    </article>
  )
}
