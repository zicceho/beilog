const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000

  useEffect(() => {
    // 检测 URL 是否带有 autoplay=true 参数，并且文章有音频
    if (post && router.query.autoplay === 'true' && (post.audio || post.Audio)) {
      const audioSrc = post.audio || post.Audio
      // 触发全局播放器
      window.dispatchEvent(
        new CustomEvent('play-global-audio', {
          detail: {
            src: audioSrc,
            cover: post.pageCoverThumbnail || post.pageCover,
            title: post.title,
            href: post.href,
            category: post.category
          }
        })
      )
      // 用 replace 悄悄去掉 URL 里的参数，防止刷新或切换路由时重复播放
      router.replace(post.href, undefined, { shallow: true })
    }
  }, [post, router])

  useEffect(() => {
    if (!post) {
      setTimeout(
        () => {
          if (isBrowser) {
            const article = document.querySelector('#article-wrapper #notion-article')
            if (!article) {
              router.push('/404').then(() => {
                console.warn('找不到页面', router.asPath)
              })
            }
          }
        },
        waiting404
      )
    }
  }, [post])

  return (
    // ... 这里保留你原有的 return 代码，一字不动 ...
