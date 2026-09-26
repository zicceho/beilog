import { useGlobal } from '@/lib/global'
import { useEffect, useRef } from 'react'

export default function ArticleLock({ validPassword }) {
  const { locale } = useGlobal()
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submitPassword = () => {
    const value = inputRef.current?.value || ''
    if (!validPassword?.(value)) {
      const target = document.getElementById('nianan-lock-tip')
      if (target) target.textContent = locale?.COMMON?.PASSWORD_ERROR || '密码错误'
    }
  }

  return (
    <div className='nianan-lock'>
      <p>{locale?.COMMON?.ARTICLE_LOCK_TIPS || '这篇文章已加密，请输入密码继续。'}</p>
      <div className='nianan-lock-row'>
        <input
          ref={inputRef}
          type='password'
          placeholder='密码'
          onKeyDown={event => {
            if (event.key === 'Enter') submitPassword()
          }}
        />
        <button type='button' onClick={submitPassword}>解锁</button>
      </div>
      <div id='nianan-lock-tip' className='nianan-lock-tip' />
    </div>
  )
}
