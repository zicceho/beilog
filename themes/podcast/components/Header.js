import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useState } from 'react'
import CONFIG from '../config'

function getDefaultLinks(locale) {
  return [
    {
      id: 'home', icon: 'fa-solid fa-house', name: locale?.NAV?.INDEX || '首页', href: '/',
      show: siteConfig('NIANAN_MENU_HOME', true, CONFIG)
    },
    {
      id: 'episodes', icon: 'fas fa-microphone', name: siteConfig('NIANAN_MENU_EPISODES_NAME', '节目', CONFIG),
      href: siteConfig('NIANAN_EPISODES_PATH', '/archive', CONFIG),
      show: siteConfig('NIANAN_MENU_EPISODES', true, CONFIG)
    },
    {
      id: 'notes', icon: 'fas fa-file-alt', name: siteConfig('NIANAN_MENU_NOTES_NAME', '笔记', CONFIG),
      href: siteConfig('NIANAN_NOTES_PATH', '/category/笔记', CONFIG),
      show: siteConfig('NIANAN_MENU_NOTES', true, CONFIG)
    },
    {
      id: 'about', icon: 'fas fa-user-friends', name: siteConfig('NIANAN_MENU_ABOUT_NAME', '我们', CONFIG),
      href: siteConfig('NIANAN_ABOUT_PATH', '/about', CONFIG),
      show: siteConfig('NIANAN_MENU_ABOUT', true, CONFIG)
    }
  ].filter(item => item.show)
}

function normalizeMenu(props) {
  const customNav = Array.isArray(props.customNav) ? props.customNav : []
  const customMenu = Array.isArray(props.customMenu) ? props.customMenu : []
  if (siteConfig('CUSTOM_MENU', false, CONFIG)) return customMenu
  return [...getDefaultLinks(props?.locale || {}), ...customNav].filter(item => item && item.show !== false)
}

function NavItem({ item }) {
  const [open, setOpen] = useState(false)
  const children = Array.isArray(item?.subMenus) ? item.subMenus : Array.isArray(item?.children) ? item.children : []
  if (!children.length) {
    return (
      <SmartLink href={item?.href || '#'} target={item?.target} className='nianan-nav-link'>
        {item?.icon && <i className={item.icon} aria-hidden='true' />} {item?.name || item?.title}
      </SmartLink>
    )
  }
  return (
    <div className='nianan-nav-dropdown' onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type='button' className='nianan-nav-link nianan-nav-dropdown-trigger' onClick={() => setOpen(value => !value)}>
        {item?.icon && <i className={item.icon} aria-hidden='true' />} {item?.name || item?.title} <i className='fas fa-angle-down nianan-nav-chevron' aria-hidden='true' />
      </button>
      {open && (
        <div className='nianan-nav-dropdown-menu'>
          {children.map((sub, index) => (
            <SmartLink key={`${sub?.href || sub?.title || sub?.name}-${index}`} href={sub?.href || '#'} target={sub?.target || item?.target} className='nianan-nav-dropdown-item'>
              {sub?.icon && <i className={sub.icon} aria-hidden='true' />} {sub?.title || sub?.name}
            </SmartLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header(props) {
  const { siteInfo, locale } = props
  const global = useGlobal()
  const [open, setOpen] = useState(false)
  const menu = normalizeMenu({ ...props, locale: global.locale || locale })
  const showSearch = siteConfig('NIANAN_MENU_SEARCH', true, CONFIG)
  const logoUrl = siteConfig('NIANAN_LOGO_URL', '', CONFIG)
  const title = siteInfo?.title || siteConfig('TITLE', '念安酒馆')

  return (
    <header className='nianan-site-header'>
      <div className='nianan-header-inner'>
        <SmartLink href='/' className='nianan-logo' aria-label={title}>
          {logoUrl ? <img src={logoUrl} alt={siteConfig('NIANAN_LOGO_ALT', title, CONFIG)} /> : <span>{title}</span>}
        </SmartLink>

        <nav className='nianan-desktop-nav' aria-label='主导航'>
          {menu.map((item, index) => <NavItem key={`${item?.href || item?.name || item?.title}-${index}`} item={item} />)}
          {showSearch && (
            <SmartLink href='/search' className='nianan-nav-search' title={global.locale?.NAV?.SEARCH || '搜索'}>
              <i className='fas fa-search' aria-hidden='true' />
            </SmartLink>
          )}
        </nav>

        <button
          type='button'
          className='nianan-mobile-toggle'
          aria-expanded={open}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          onClick={() => setOpen(value => !value)}>
          <i className={open ? 'fas fa-times' : 'fas fa-bars'} aria-hidden='true' />
        </button>
      </div>

      {open && (
        <nav className='nianan-mobile-nav' aria-label='移动端导航'>
          {menu.map((item, index) => (
            <SmartLink key={`${item?.href || item?.name}-${index}`} href={item?.href || '#'} target={item?.target} className='nianan-mobile-link' onClick={() => setOpen(false)}>
              {item?.name || item?.title}
            </SmartLink>
          ))}
          {showSearch && <SmartLink href='/search' className='nianan-mobile-link' onClick={() => setOpen(false)}>搜索</SmartLink>}
        </nav>
      )}
    </header>
  )
}
