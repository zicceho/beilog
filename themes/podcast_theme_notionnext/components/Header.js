import Link from 'next/link'
import CONFIG from '../config'
import { useRouter } from 'next/router'

/**
 * 头部导航组件
 */
export default function Header({ title = '念安酒馆' }) {
  const router = useRouter()
  const isActive = (path) => router.pathname === path || router.asPath === path

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="text-2xl font-bold text-black">{title}</div>
            </a>
          </Link>

          {/* 导航菜单 */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/">
              <a className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}>
                首页
              </a>
            </Link>

            <Link href="/episodes">
              <a className={`text-sm font-medium transition-colors ${
                isActive('/episodes') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}>
                节目
              </a>
            </Link>

            <Link href="/category">
              <a className={`text-sm font-medium transition-colors ${
                isActive('/category') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}>
                栏目
              </a>
            </Link>

            <Link href="/about">
              <a className={`text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}>
                关于
              </a>
            </Link>
          </nav>

          {/* 移动菜单按钮 */}
          <div className="md:hidden">
            <button className="p-2 text-gray-600 hover:text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
