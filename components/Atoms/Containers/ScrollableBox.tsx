import { Box } from '@mui/material'
import { Scroller } from '../Boxes/useScrollTop'
import { ReactElement, ReactNode, useEffect, useRef } from 'react'

const ScrollableBox = ({ children, maxHeight, scroller }: { children: ReactNode | ReactElement[]; maxHeight?: number; scroller?: Scroller }) => {
  const boxRef = useRef<HTMLDivElement | null>(null)

  const detectScroll = (scrollTop: number) => {
    if (scroller) {
      scroller?.onScrolled(scrollTop)
    }
  }

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.onscroll = () => {
        detectScroll(boxRef.current!.scrollTop)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }, [scroller?.id])

  return (
    <Box ref={boxRef} sx={{ my: 2, maxHeight: maxHeight ?? { xs: 350, sm: 480, md: 526 }, overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
      {children}
    </Box>
  )
}

export default ScrollableBox
