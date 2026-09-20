import BeiAnSite from '@/components/BeiAnSite'
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='relative z-10 flex-shrink-0 justify-center text-center m-auto w-full leading-6 text-gray-600 dark:text-gray-100 text-sm pt-6 pb-6'>
      <i className='fas fa-copyright' /> {`${copyrightDate}`}
      <span>
        {/* 干杯图标 */}
        <i className='mx-1 fas fa-glass-cheers' />
        <a
          href={siteConfig('LINK')}
          className='font-bold dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
          {siteConfig('AUTHOR')}
        </a>
        <BeiAnSite />
        {/* ⚠️ 删除的就是下面这两块统计代码 */}
      </span>
    </footer>
  )
}

export default Footer
