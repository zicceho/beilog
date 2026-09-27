import Link from 'next/link'

/**
 * 页脚组件
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 关于 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">关于</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about">
                  <a className="hover:text-gray-900 transition-colors">关于我们</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="hover:text-gray-900 transition-colors">常见问题</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-gray-900 transition-colors">联系我们</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* 栏目 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">栏目</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/category">
                  <a className="hover:text-gray-900 transition-colors">全部栏目</a>
                </Link>
              </li>
              <li>
                <Link href="/episodes">
                  <a className="hover:text-gray-900 transition-colors">全部节目</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* 订阅 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">订阅</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="https://podcasts.apple.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  Apple 播客
                </a>
              </li>
              <li>
                <a href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  Spotify
                </a>
              </li>
              <li>
                <a href="/feed.xml" className="hover:text-gray-900 transition-colors">
                  RSS 订阅
                </a>
              </li>
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">关注我们</h3>
            <div className="flex gap-4">
              <a href="https://weibo.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.69 16.04c2.35 1.63 5.59 2.62 9.12 2.62 4.92 0 9.23-2.97 9.98-7.05-.83.08-1.68.13-2.55.13-4.53 0-8.68-1.66-11.77-4.41.69.09 1.4.15 2.13.15 2.62 0 5.08-.71 7.2-1.96-2.46.39-4.57 2.07-5.71 4.39-.5.98-.78 2.07-.78 3.21 0 1.04.16 2.04.47 3.01.2.61.43 1.2.7 1.76zm9.49-12.5C14.5 2.5 11.1 0 7.13 0 3.6 0 .63 2.05.1 4.72c-.04.25-.08.5-.08.76 0 .84.14 1.65.41 2.43 1.41-1.48 3.39-2.41 5.63-2.41 1.17 0 2.28.23 3.3.64 1.78-1.34 4.01-2.14 6.42-2.14.88 0 1.74.1 2.57.3.05-.39.08-.78.08-1.19 0-2.1-.82-4-2.16-5.4z" />
                </svg>
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 8-7.75 8-7.75z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center text-sm text-gray-600">
            <p>© {currentYear} 念安酒馆 · 听有你的故事，等有故事的你</p>
            <p className="mt-2">
              <a href="/privacy" className="hover:text-gray-900 transition-colors">隐私政策</a>
              {' · '}
              <a href="/terms" className="hover:text-gray-900 transition-colors">使用条款</a>
              {' · '}
              <a href="mailto:hello@example.com" className="hover:text-gray-900 transition-colors">联系方式</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
