const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const {
    locale,
    NOTION_CONFIG
  } = useGlobal()

  return (
    // 1. 加上 px-4 md:px-0：手机端左右留出16px，电脑端归零，与搜索页对齐
    <div className='px-4 md:px-0'>
      {/* 2. 删掉 min-h-screen：卡片高度随内容自适应，解决底部巨大的空白 */}
      <Card className='w-full'>
        <div className='dark:text-gray-200 mb-5 mx-3'>
          <i className='mr-4 fa-solid fa-layer-group' />{' '}
          {locale.COMMON.CATEGORY}:
        </div>

        <div
          id='category-list'
          className='duration-200 flex flex-wrap mx-8'>
          {categoryOptions?.map(
            category => {
              return (
                <SmartLink
                  key={category.name}
                  href={getCategoryUrl(
                    category.name,
                    NOTION_CONFIG
                  )}
                  passHref
                  legacyBehavior>
                  <div
                    className={
                      ' duration-300 dark:hover:text-white px-5 cursor-pointer py-2 hover:text-indigo-400'
                    }>
                    <i className='mr-4 fas fa-folder' />{' '}
                    {
                      category.name
                    }
                    (
                    {
                      category.count
                    }
                    )
                  </div>
                </SmartLink>
              )
            }
          )}
        </div>
      </Card>
    </div>
  )
}

const LayoutTagIndex = props => {
  const {
    tagOptions
  } = props

  const { locale } =
    useGlobal()

  return (
    // 1. 加上 px-4 md:px-0：与分类页、搜索页的手机端留白完全一致
    <div className='px-4 md:px-0'>
      <Card className='w-full'>
        <div className='dark:text-gray-200 mb-5 ml-4'>
          <i className='mr-4 fas fa-users' />{' '}
          {locale.COMMON.TAGS}:
        </div>

        <div
          id='tags-list'
          className='duration-200 flex flex-wrap ml-8'>
          {tagOptions.map(tag => (
            <div
              key={tag.name}
              className='p-2'>
              <TagItemMini
                key={tag.name}
                tag={tag}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
