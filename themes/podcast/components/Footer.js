import { useRef } from 'react'
import { siteConfig } from '@/lib/config'
import { handleEmailClick, resolveContactEmail } from '@/lib/plugins/mailEncrypt'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

export default function Footer({ siteInfo }) {
  const since = siteConfig('SINCE', '')
  const currentYear = new Date().getFullYear()
  const copyright = since && String(since) !== String(currentYear) ? `${since}-${currentYear}` : currentYear
  const author = siteConfig('AUTHOR', siteInfo?.title || '念安酒馆')
  const link = siteConfig('LINK', '/')
  const powered = siteConfig('NIANAN_FOOTER_SHOW_POWERED_BY', true, CONFIG)
  const rawEmail = siteConfig('CONTACT_EMAIL', siteConfig('NIANAN_CONTACT_EMAIL', '', CONFIG))
  const emailRef = useRef(null)
  const emailDisplay = resolveContactEmail(rawEmail)

  return (
    <footer className='nianan-footer'>
      <div className='nianan-footer-inner'>
        <div>© {copyright} <SmartLink href={link}>{author}</SmartLink></div>
        <div className='nianan-footer-note'>听有你的故事，等有故事的你。</div>
        {emailDisplay && (
          <a
            ref={emailRef}
            href=''
            onClick={event => handleEmailClick(event, emailRef, rawEmail)}
            className='nianan-footer-contact'>
            {emailDisplay}
          </a>
        )}
        {powered && <div className='nianan-footer-powered'>Powered by NotionNext · Theme: Podcast</div>}
      </div>
    </footer>
  )
}
