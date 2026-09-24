const LayoutPostList = props => {
  const router = useRouter()
  const isHomePage = router.route === '/'
  const { posts = [], siteInfo } = props // <--- 恢复解构
  const showSummary = siteConfig('HEXO_POST_LIST_SUMMARY', null, CONFIG)
  const postsPerPage = siteConfig('POSTS_PER_PAGE', 6, CONFIG)

  if (isHomePage) {
    const homePosts = posts.slice(0, postsPerPage)
    return (
      <div>
        <SlotBar {...props} />
        <div className='space-y-6 px-2'>
          {homePosts.map(post => (
            <BlogPostCard
              key={post.id}
              post={post}
              showSummary={showSummary}
              siteInfo={siteInfo}
              // <--- 删除 episodeArchivePage 传参
            />
          ))}
        </div>
        <div className='mt-8 mb-4 text-center'>
          <SmartLink
            href='/episodes'
            className='inline-block px-6 py-2 text-sm font-semibold rounded-lg border-2 transition-colors border-[var(--theme-color)] text-[var(--theme-color)] hover:bg-[var(--theme-color)] hover:text-white'>
            查看更多节目 ···
          </SmartLink>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SlotBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </div>
  )
}
