import { useEffect, useState } from 'react'

export const useScrollTop = (top: number, scrollOnRender?: boolean) => {
  const [id, setId] = useState<string | null>(null)
  const [scrollTop, setScrollTop] = useState(top)

  const scroll = (scrollTop?: number) => {
    if (scrollTop) {
      setScrollTop(scrollTop)
    }
    setId(crypto.randomUUID())
  }

  return {
    scrollTop,
    id,
    scroll,
  }
}

export type Scroller = ReturnType<typeof useScrollTop>
