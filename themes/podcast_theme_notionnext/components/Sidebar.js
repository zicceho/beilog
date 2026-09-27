import Link from 'next/link'

/**
 * 侧边栏组件
 */
export default function Sidebar({ 
  categories = [],
  tags = [],
  stats = {}
}) {
  return (
    <aside className="space-y-6">
      {/* 统计信息 */}
      {Object.keys(stats).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">统计</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {stats.episodes && (
              <div>
                <p className="text-2xl font-bold text-black">{stats.episodes}</p>
                <p className="text-xs text-gray-600 mt-1">节目</p>
              </div>
            )}
            {stats.categories && (
              <div>
                <p className="text-2xl font-bold text-black">{stats.categories}</p>
                <p className="text-xs text-gray-600 mt-1">栏目</p>
              </div>
            )}
            {stats.tags && (
              <div>
                <p className="text-2xl font-bold text-black">{stats.tags}</p>
                <p className="text-xs text-gray-600 mt-1">标签</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 分类 */}
      {categories && categories.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">栏目</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.name}>
                <Link href={`/category/${category.slug || category.name}`}>
                  <a className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {category.count || 0}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 标签云 */}
      {tags && tags.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">标签</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag.name} href={`/tag/${tag.slug || tag.name}`}>
                <a className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  {tag.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 订阅提示 */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-lg p-4">
        <h3 className="font-semibold mb-3">订阅播客</h3>
        <p className="text-sm mb-4 leading-relaxed">
          订阅我们的播客，不要错过任何新节目。
        </p>
        <div className="space-y-2">
          <a
            href="/subscribe"
            className="block w-full text-center px-3 py-2 bg-white text-black rounded font-medium hover:bg-gray-100 transition-colors text-sm"
          >
            订阅播客
          </a>
        </div>
      </div>

      {/* 关于 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">关于本站</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          念安酒馆是一档关于自我探索的谈话节目，希望透过对他者的关怀和对世界的探索。
        </p>
        <Link href="/about">
          <a className="inline-block mt-3 text-sm text-black font-medium hover:underline">
            了解更多 →
          </a>
        </Link>
      </div>
    </aside>
  )
}
