import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'

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
        <div className='mt-10 w-full'>
          {/* 分类：去掉方框，改成「」括号 */}
          <div className='mb-3 flex justify-center'>
            {post.category && (
              <SmartLink
                href={`/category/${post.category}`}
                passHref
                legacyBehavior>
                <div className='cursor-pointer text-sm font-light text-white/80 hover:text-white transition-colors'>
                  「{post.category}」
                </div>
              </SmartLink>
            )}
          </div>

          {/* 文章标题：左右留白，避免贴边 */}
          <div className='leading-snug font-bold xs:text-4xl sm:text-4xl md:text-5xl md:leading-snug text-4xl shadow-text-md flex justify-center text-center text-white px-6 sm:px-8'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} className='text-4xl mx-1' />
            )}
            {post.title}
          </div>

          {/* 日期 + 嘉宾 同行 */}
          <section className='flex-wrap shadow-text-md flex text-sm justify-center items-center mt-4 text-white/70 font-light leading-8 gap-x-2 gap-y-1 px-6 sm:px-8'>
            {/* 日期 */}
            {post?.type !== 'Page' && (
              <SmartLink
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                passHref
                className='cursor-pointer hover:text-white transition-colors flex items-center'>
                <i className='far fa-calendar-alt mr-1' />
                {post?.publishDay || post.date}
              </SmartLink>
            )}

            {/* 日期和嘉宾之间的间隔（相当于两个空格） */}
            {post.tagItems && post.tagItems.length > 0 && (
              <span className='mx-1' />
            )}

            {/* 嘉宾：去掉色块，改成 @名字 */}
            {post.tagItems?.map(tag => (
              <span
                key={tag.name}
                className='text-white/80 text-sm whitespace-nowrap'>
                @{tag.name}
              </span>
            ))}
          </section>
        </div>
      </header>
    </div>
  )
}
