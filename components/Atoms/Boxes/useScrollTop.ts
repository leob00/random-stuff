import { useState } from 'react'

export const useScrollTop = (top: number) => {
  const [id, setId] = useState<string | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (scrollTop?: number) => {
    setId(crypto.randomUUID())
  }

  const onScrolled = (top: number) => {
    setScrollPosition(top)
  }

  return {
    scrollPosition,
    id,
    scroll,
    onScrolled,
  }
}

export type Scroller = ReturnType<typeof useScrollTop>
