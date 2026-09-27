import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

/**
 * 节目卡片组件
 * 用于展示单个节目信息
 */
export default function EpisodeCard({ 
  episode = {},
  size = 'medium', // 'small' | 'medium' | 'large'
  showPlayButton = true,
  onPlay = () => {}
}) {
  const {
    id = '',
    slug = '',
    title = '未知节目',
    summary = '',
    cover = '',
    duration = '00:00',
    date = new Date(),
    category = '',
    tags = [],
    audioUrl = '',
    author = '',
  } = episode

  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
    } catch {
      return '未知日期'
    }
  }

  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  }

  const thumbnailSizes = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  }

  const linkHref = `/[prefix]/[slug]`
  const linkAs = `/${slug || id}`

  return (
    <Link href={linkHref} as={linkAs}>
      <a className="block group">
        <div
          className={`bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer ${sizeClasses[size]}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={size === 'small' ? 'flex gap-3' : 'block'}>
            {/* 封面图片 */}
            <div className={`relative ${thumbnailSizes[size]} flex-shrink-0 bg-gray-100 rounded overflow-hidden`}>
              {cover ? (
                <Image
                  src={cover}
                  alt={title}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                </div>
              )}

              {/* 播放按钮 */}
              {showPlayButton && isHovered && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onPlay(episode)
                    }}
                    className="p-3 bg-white rounded-full hover:bg-gray-200 transition-colors"
                    title="播放"
                  >
                    <svg className="w-6 h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* 内容部分 */}
            <div className={`${size === 'small' ? 'flex-1 min-w-0' : 'mt-3'}`}>
              {/* 分类标签 */}
              {category && size !== 'small' && (
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {category}
                  </span>
                </div>
              )}

              {/* 标题 */}
              <h3 className={`font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-2 ${
                size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'
              }`}>
                {title}
              </h3>

              {/* 摘要（大卡片显示） */}
              {size === 'large' && summary && (
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {summary}
                </p>
              )}

              {/* 元信息 */}
              <div className={`text-gray-500 flex items-center gap-3 mt-2 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
                {author && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    {author}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                  </svg>
                  {duration}
                </span>
                <span>{formatDate(date)}</span>
              </div>

              {/* 标签 */}
              {tags && tags.length > 0 && size === 'large' && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}
