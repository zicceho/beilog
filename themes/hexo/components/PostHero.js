import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'

const PlayIcon = ({ size = 12 }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='currentColor' style={{ marginLeft: '1px' }}>
    <path d='M8 5v14l11-7z' />
  </svg>
)
const PauseIcon = ({ size = 12 }) => (
  <svg viewBox='0 0 24 24' width={size} height={size} fill='currentColor'>
    <rect x='6' y='5' width='4' height='14' rx='1' />
    <rect x='14' y='5' width='4' height='14' rx='1' />
  </svg>
)

const parseExt = (ext) => {
  if (!ext) return null
  const raw = typeof ext === 'string' ? ext.trim() : ''
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.audio) return parsed.audio
  } catch (e) {}
  if (raw.startsWith('http')) return raw
  return null
}

const Waveform = ({ playing }) => {
  const bars = [3, 8, 14, 20, 12, 6, 16, 22, 10, 4, 18, 14, 8, 12, 6]
  return (
    <div className='flex items-center gap-[2px] h-4'>
      {bars.map((h, i) => (
        <span
          key={i}
          className={`w-[2px] rounded-full bg-white/70 ${playing ? 'wave-bar' : ''}`}
          style={{
            height: `${h}px`,
            animationDelay: `${i * 0.08}s`
          }}
        />
      ))}
    </div>
  )
}

export default function PostHero({ post, siteInfo }) {
  const { locale, fullWidth } = useGlobal()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCurrentSrc, setIsCurrentSrc] = useState(false)

  let audioUrl = post?.audio || null
  if (!audioUrl && post?.ext) {
    audioUrl = parseExt(post.ext)
  }

  useEffect(() => {
    const onState = (e) => {
      const { src, playing } = e.detail
      if (audioUrl && src === audioUrl) {
        setIsCurrentSrc(true)
        setIsPlaying(playing)
      } else {
        setIsCurrentSrc(false)
        setIsPlaying(false)
      }
    }
    window.addEventListener('global-audio-state', onState)
    return () => window.removeEventListener('global-audio-state', onState)
  }, [audioUrl])

  if (!post) {
    return <></>
  }

  if (fullWidth) {
    return <div className='my-8' />
  }

  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover
  const coverUrl = post?.pageCoverThumbnail || post?.pageCover

  const handlePlayClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!audioUrl) return
    window.dispatchEvent(
      new CustomEvent('toggle-global-audio', {
        detail: {
          src: audioUrl,
          cover: coverUrl,
          title: post.title,
          href: post.href
        }
      })
    )
  }

  return (
    <div id='header' className='w-full h-96 md:h-[75vh] relative md:flex-shrink-0 z-10'>
      <LazyImage
        priority={true}
        src={headerImage}
        className='w-full h-full object-cover object-center absolute top-0'
      />

      <header
        id='article-header-cover'
        className='bg-black bg-opacity-70 absolute top-0 w-full h-full flex items-center'>
        <div className='w-full max-w-4xl mx-auto px-6 sm:px-8'>
          {/* 第一行：分类 + 嘉宾 */}
          <div className='flex flex-wrap items-center gap-x-4 gap-y-1 mb-3'>
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
            {post.tagItems?.map(tag => (
              <SmartLink
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                passHref
                legacyBehavior>
                <div className='cursor-pointer text-sm font-light text-white/70 hover:text-white transition-colors whitespace-nowrap'>
                  @{tag.name}
                </div>
              </SmartLink>
            ))}
          </div>

          {/* 第二行：标题 */}
          <div className='leading-snug font-bold text-3xl sm:text-4xl md:leading-snug shadow-text-md text-white mb-6'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon
                icon={post.pageIcon}
                className='text-3xl sm:text-4xl mr-1 inline-block'
              />
            )}
            {post.title}
          </div>

          {/* 第三行：日期胶囊 + 播放器胶囊 */}
          <div className='flex flex-wrap items-center gap-3'>
            {post?.type !== 'Page' && (
              <SmartLink
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                passHref>
                <div className='cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-sm hover:bg-white/20 transition-colors'>
                  <i className='fa-solid fa-calendar-days text-xs' />
                  <span>{post?.publishDay || post.date}</span>
                </div>
              </SmartLink>
            )}

            {audioUrl && (
              <div
                onClick={handlePlayClick}
                className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm cursor-pointer hover:bg-white/20 transition-colors'>
                <Waveform playing={isCurrentSrc && isPlaying} />
                <span className='flex items-center justify-center w-4 h-4 text-white/90'>
                  {isCurrentSrc && isPlaying ? (
                    <PauseIcon size={12} />
                  ) : (
                    <PlayIcon size={12} />
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1);
          }
        }
        .wave-bar {
          animation: wave 1s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  )
}
