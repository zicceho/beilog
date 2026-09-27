import { useRouter } from 'next/router'
import Header from './Header'
import Footer from './Footer'
import GlobalPlayer from './GlobalPlayer'

/**
 * 基础布局组件
 * 所有页面的基础容器
 */
export default function LayoutBase({ 
  children, 
  title,
  playlist = [],
  currentEpisodeIndex = 0,
  onEpisodeChange = () => {}
}) {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 头部 */}
      <Header title={title} />

      {/* 主容容 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 页脚 */}
      <Footer />

      {/* 全局播放器 */}
      {playlist && playlist.length > 0 && (
        <GlobalPlayer 
          playlist={playlist}
          currentIndex={currentEpisodeIndex}
          onIndexChange={onEpisodeChange}
        />
      )}
    </div>
  )
}
