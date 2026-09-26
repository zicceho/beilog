import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import SearchBox from './SearchBox'

function externalLinkItems() {
  return [
    ['iTunes', siteConfig('NIANAN_SUBSCRIBE_ITUNES', '', CONFIG)],
    ['小宇宙', siteConfig('NIANAN_SUBSCRIBE_XIAOYUZHOU', '', CONFIG)],
    ['Spotify', siteConfig('NIANAN_SUBSCRIBE_SPOTIFY', '', CONFIG)],
    ['网易云音乐', siteConfig('NIANAN_SUBSCRIBE_NETEASE', '', CONFIG)],
    ['喜马拉雅', siteConfig('NIANAN_SUBSCRIBE_XIMALAYA', '', CONFIG)],
    ['RSS', siteConfig('NIANAN_SUBSCRIBE_RSS', '', CONFIG)]
  ].filter(([, href]) => href)
}

export default function Sidebar({ categoryOptions = [], tagOptions = [] }) {
  const links = externalLinkItems()
  const email = siteConfig('NIANAN_CONTACT_EMAIL', '', CONFIG)
  const socials = [
    ['微博', siteConfig('NIANAN_SOCIAL_WEIBO', '', CONFIG)],
    ['Twitter', siteConfig('NIANAN_SOCIAL_TWITTER', '', CONFIG)],
    ['微信订阅', siteConfig('NIANAN_SOCIAL_WECHAT', '', CONFIG)],
    ['Facebook', siteConfig('NIANAN_SOCIAL_FACEBOOK', '', CONFIG)],
    ['GitHub', siteConfig('NIANAN_SOCIAL_GITHUB', '', CONFIG)]
  ].filter(([, href]) => href)

  return (
    <aside className='nianan-sidebar'>
      {siteConfig('NIANAN_SIDEBAR_SEARCH', true, CONFIG) && (
        <section className='nianan-sidebar-section'>
          <h3>搜索</h3>
          <SearchBox />
        </section>
      )}

      {siteConfig('NIANAN_SIDEBAR_CATEGORIES', true, CONFIG) && categoryOptions?.length > 0 && (
        <section className='nianan-sidebar-section'>
          <h3>栏目</h3>
          <ul className='nianan-sidebar-list'>
            {categoryOptions.map(category => (
              <li key={category.name}>
                <SmartLink href={category.href || `/category/${encodeURIComponent(category.name)}`}>
                  {category.name} <span>({category.count})</span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      {siteConfig('NIANAN_SIDEBAR_TAGS', false, CONFIG) && tagOptions?.length > 0 && (
        <section className='nianan-sidebar-section'>
          <h3>标签</h3>
          <div className='nianan-sidebar-tags'>
            {tagOptions.slice(0, 18).map(tag => (
              <SmartLink key={tag.name} href={tag.href || `/tag/${encodeURIComponent(tag.name)}`}>
                {tag.name}
              </SmartLink>
            ))}
          </div>
        </section>
      )}

      {siteConfig('NIANAN_SIDEBAR_SUBSCRIBE', true, CONFIG) && (
        <section className='nianan-sidebar-section'>
          <h3>订阅</h3>
          <div className='nianan-sidebar-links'>
            {links.map(([label, href]) => (
              <a key={label} href={href} target='_blank' rel='noreferrer'>
                {label}
              </a>
            ))}
          </div>
        </section>
      )}

      {siteConfig('NIANAN_SIDEBAR_SOCIAL', true, CONFIG) && (socials.length > 0 || email) && (
        <section className='nianan-sidebar-section'>
          <h3>联系</h3>
          <div className='nianan-sidebar-links'>
            {socials.map(([label, href]) => (
              <a key={label} href={href} target='_blank' rel='noreferrer'>
                {label}
              </a>
            ))}
            {email && <a href={`mailto:${email}`}>{email}</a>}
          </div>
        </section>
      )}
    </aside>
  )
}
