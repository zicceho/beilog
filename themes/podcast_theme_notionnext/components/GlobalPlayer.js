import { useState, useEffect, useRef } from 'react'
import CONFIG from '../config'

/**
 * 全局播放器组件
 * 固定在页面底部，支持播放队列、前后切换等功能
 */
export default function GlobalPlayer({ 
  playlist = [],
  currentIndex = 0,
  onIndexChange = () => {}
}) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(CONFIG.PLAYER.defaultVolume || 0.7)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const currentEpisode = playlist[currentIndex] || {}

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentEpisode.audioUrl) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      // 播放下一集
      if (currentIndex < playlist.length - 1) {
        onIndexChange(currentIndex + 1)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentIndex, playlist, onIndexChange])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }

  const handleProgressChange = (e) => {
    const time = (e.target.value / 100) * duration
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
    setCurrentTime(time)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      onIndexChange(currentIndex + 1)
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  // 如果没有播放列表或当前选集信息不完整，不显示播放器
  if (!currentEpisode.audioUrl) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <audio 
        ref={audioRef} 
        src={currentEpisode.audioUrl} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* 进度条 */}
      <div className="w-full h-1 bg-gray-200 cursor-pointer group">
        <input
          type="range"
          min="0"
          max="100"
          value={progressPercent}
          onChange={handleProgressChange}
          className="w-full h-1 opacity-0 cursor-pointer absolute"
          style={{ zIndex: 10 }}
        />
        <div
          className="h-1 bg-black transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* 左侧：节目信息 */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {currentEpisode.title || '未知节目'}
            </h4>
            <p className="text-xs text-gray-500">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          {/* 中间：播放控制 */}
          <div className="flex items-center gap-2">
            {/* 上一集按钮 */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="上一集"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.707 9.293a1 1 0 010 1.414L5.414 13H18a1 1 0 110 2H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
              </svg>
            </button>

            {/* 播放/暂停按钮 */}
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.75 1.5A.75.75 0 015 2.25v15.5a.75.75 0 001.5 0V2.25A.75.75 0 015.75 1.5zm8.5 0A.75.75 0 0113 2.25v15.5a.75.75 0 001.5 0V2.25a.75.75 0 00-1.5 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              )}
            </button>

            {/* 下一集按钮 */}
            <button
              onClick={handleNext}
              disabled={currentIndex === playlist.length - 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="下一集"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H2a1 1 0 110-2h12.586l-2.293-2.293a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>

          {/* 右侧：音量和播放列表 */}
          <div className="flex items-center gap-2">
            {/* 音量控制 */}
            <div className="flex items-center gap-1 hidden sm:flex">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    if (isMuted) {
                      audioRef.current.volume = volume
                      setIsMuted(false)
                    } else {
                      audioRef.current.volume = 0
                      setIsMuted(true)
                    }
                  }
                }}
                className="p-1 text-gray-600 hover:text-black"
              >
                {isMuted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.383 3.076A1 1 0 0110 2h2a1 1 0 011 1v4h2a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H6a1 1 0 01-.82-1.573l7-10a1 1 0 01.383-.427z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  </svg>
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value)
                  setVolume(newVolume)
                  if (audioRef.current) {
                    audioRef.current.volume = newVolume
                  }
                }}
                className="w-16 h-1 accent-black"
              />
            </div>

            {/* 播放列表按钮 */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              title="播放列表"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {playlist.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 播放列表面板 */}
      {showPlaylist && (
        <div className="bg-gray-50 border-t border-gray-200 max-h-96 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-2">
            {playlist.map((episode, index) => (
              <button
                key={index}
                onClick={() => {
                  onIndexChange(index)
                  setShowPlaylist(false)
                }}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  index === currentIndex
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-200 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate font-medium">{episode.title}</p>
                    {episode.duration && (
                      <p className="text-xs opacity-75">{episode.duration}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
