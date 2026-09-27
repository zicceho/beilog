import { useState, useEffect, useRef } from 'react'
import CONFIG from '../config'

/**
 * 音频播放器组件
 * 支持播放、暂停、进度条、音量控制、播放速度等功能
 */
export default function AudioPlayer({ 
  src = '', 
  title = '未知节目',
  poster = '',
  onPlay = () => {},
  onPause = () => {},
  className = ''
}) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(CONFIG.PLAYER.defaultVolume || 0.7)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => {
      setIsPlaying(true)
      onPlay()
    }

    const handlePause = () => {
      setIsPlaying(false)
      onPause()
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [onPlay, onPause])

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

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />

      {/* 播放器头部 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">音频播放器</p>
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progressPercent}
          onChange={handleProgressChange}
          className="w-full h-1 bg-gray-300 rounded-lg cursor-pointer accent-black"
        />
        <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 播放/暂停按钮 */}
          <button
            onClick={togglePlay}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900"
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.75 1.5A.75.75 0 015 2.25v15.5a.75.75 0 001.5 0V2.25A.75.75 0 015.75 1.5zm8.5 0A.75.75 0 0113 2.25v15.5a.75.75 0 001.5 0V2.25a.75.75 0 00-1.5 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            )}
          </button>

          {/* 静音按钮 */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900"
            title={isMuted ? '取消静音' : '静音'}
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 2h2a1 1 0 011 1v4h2a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H6a1 1 0 01-.82-1.573l7-10a1 1 0 01.383-.427z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.383 3.076A1 1 0 0110 2h2a1 1 0 011 1v4h2a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H6a1 1 0 01-.82-1.573l7-10a1 1 0 01.383-.427z" />
              </svg>
            )}
          </button>
        </div>

        {/* 音量控制 */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-300 rounded-lg cursor-pointer accent-black"
          />
        </div>

        {/* 播放速度 */}
        {CONFIG.PLAYER.enablePlaybackRate && (
          <div className="flex items-center gap-2">
            <select
              value={playbackRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value)
                setPlaybackRate(rate)
                if (audioRef.current) {
                  audioRef.current.playbackRate = rate
                }
              }}
              className="text-sm border border-gray-300 rounded px-2 py-1 cursor-pointer"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        )}
      </div>

      {/* 下载和分享按钮 */}
      {(CONFIG.PLAYER.enableDownload || CONFIG.PLAYER.enableShare) && (
        <div className="flex gap-2 mt-4 border-t border-gray-200 pt-4">
          {CONFIG.PLAYER.enableDownload && src && (
            <a
              href={src}
              download
              className="flex-1 text-center px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              下载
            </a>
          )}
          {CONFIG.PLAYER.enableShare && (
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: title,
                    text: `听一听：${title}`,
                    url: window.location.href,
                  })
                }
              }}
              className="flex-1 text-center px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              分享
            </button>
          )}
        </div>
      )}
    </div>
  )
}
