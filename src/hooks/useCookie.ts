import { useState, useCallback } from 'react'

export function useCookie(key: string, defaultValue: string): [string, (value: string) => void] {
  const [value, setValue] = useState<string>(() => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : defaultValue
  })

  const updateCookie = useCallback(
    (newValue: string) => {
      const encoded = encodeURIComponent(newValue)
      document.cookie = `${key}=${encoded}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
      setValue(newValue)
    },
    [key],
  )

  return [value, updateCookie]
}
