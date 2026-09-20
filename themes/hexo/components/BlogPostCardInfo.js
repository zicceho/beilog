<h2 className='flex items-start gap-2'>
  {post?.audio && (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        window.dispatchEvent(new CustomEvent('play-global-audio', {
          detail: {
            src: post.audio,
            cover: post.pageCoverThumbnail || post.pageCover,
            title: post.title,
            href: post.href,
            category: post.category
          }
        }))
      }}
      className='flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-900/50 text-indigo-500 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition-colors shadow-sm'
      title='播放本期音频'
    >
      <i className='fas fa-play text-xs ml-0.5' />
    </button>
  )}
  <SmartLink ...>
    ...
  </SmartLink>
</h2>
