import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

export default function SearchBox({ keyword = '' }) {
  const inputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = event => {
    event.preventDefault()
    const value = inputRef.current?.value?.trim()
    if (!value) {
      router.push('/search')
      return
    }
    router.push(`/search/${encodeURIComponent(value)}`)
  }

  return (
    <form className='nianan-search-form' onSubmit={submit}>
      <input ref={inputRef} defaultValue={keyword} placeholder='搜索……' aria-label='搜索' />
      <button type='submit'>搜索</button>
    </form>
  )
}
