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
        {/* 这里已经将心形改成了干杯图标，并去掉了跳动动画 */}
        <i className='mx-1 fas fa-glass-cheers' />
        <a
          href={siteConfig('LINK')}
          className='font-bold dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
          {siteConfig('AUTHOR')}
        </a>
        <BeiAnSite />
        <span className='hidden busuanzi_container_site_pv'>
          <i className='fas fa-eye' />
          <span className='px-1 busuanzi_value_site_pv'> </span>
        </span>
        <span className='pl-2 busuanzi_container_site_uv'>
          <i className='fas fa-users' />
          <span className='px-1 busuanzi_value_site_uv'> </span>
        </span>
      </span>
    </footer>
  )
}

export default Footer
