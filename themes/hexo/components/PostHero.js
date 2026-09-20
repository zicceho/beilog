import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import TagItemMini from './TagItemMini'

/**
 * 文章详情页的Hero块
 */
export default function PostHero({ post, siteInfo }) {
  const { locale, fullWidth } = useGlobal()

  if (!post) {
    return <></>
  }

  // 文章全屏隐藏标头
  if (fullWidth) {
    return <div className='my-8' />
  }

  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover

  return (
    <div id='header' className='w-full h-96 relative md:flex-shrink-0 z-10'>
      <LazyImage
        priority={true}
        src={headerImage}
        className='w-full h-full object-cover object-center absolute top-0'
      />

      <header
        id='article-header-cover'
        className='bg-black bg-opacity-70 absolute top-0 w-full h-96 py-10 flex justify-center items-center '>
        <div className='mt-10'>
          <div className='mb-3 flex justify-center'>
            {post.category && (
              <>
                <SmartLink
                  href={`/category/${post.category}`}
                  passHref
                  legacyBehavior>
                  <div className='cursor-pointer px-2 py-1 mb-2 border rounded-sm dark:border-white text-sm font-medium hover:underline duration-200 shadow-text-md text-white'>
                    {post.category}
                  </div>
                </SmartLink>
              </>
            )}
          </div>

          {/* 文章Title */}
          <div className='leading-snug font-bold xs:text-4xl sm:text-4xl md:text-5xl md:leading-snug text-4xl shadow-text-md flex justify-center text-center text-white'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} className='text-4xl mx-1' />
            )}
            {post.title}
          </div>

          {/* ⚠️ 改动位置：时间和标签同行的容器 */}
          <section className='flex-wrap shadow-text-md flex text-sm justify-center items-center mt-4 text-white dark:text-gray-400 font-light leading-8 gap-x-6'>
            {/* 1. 时间显示（日历图标 + 日期） */}
            <div className='flex justify-center items-center dark:text-gray-200 text-opacity-70'>
              {post?.type !== 'Page' && (
                <SmartLink
                  href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                  passHref
                  className='pl-1 cursor-pointer hover:underline flex items-center'>
                  <i className='far fa-calendar-alt mr-1' />
                  {post?.publishDay || post.date}
                </SmartLink>
              )}
            </div>

            {/* 2. 浏览量（如果有） */}
            {JSON.parse(siteConfig('ANALYTICS_BUSUANZI_ENABLE')) && (
              <div className='busuanzi_container_page_pv font-light'>
                <span className='mr-2 busuanzi_value_page_pv' />
                {locale.COMMON.VIEWS}
              </div>
            )}

            {/* 3. 标签（搬进了同一个容器内，保证同行显示） */}
            {post.tagItems && (
              <div className='flex items-center justify-center flex-wrap gap-1'>
                {post.tagItems.map(tag => (
                  <TagItemMini key={tag.name} tag={tag} />
                ))}
              </div>
            )}
          </section>

        </div>
      </header>
    </div>
  )
}
