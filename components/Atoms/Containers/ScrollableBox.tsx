import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { Box } from '@mui/material'
import { Scroller } from '../Boxes/useScrollTop'
import { ReactNode, useEffect, useRef } from 'react'

const ScrollableBox = ({ children, maxHeight = 640, scroller }: { children: ReactNode | ReactJSXElement; maxHeight?: number; scroller?: Scroller }) => {
  const boxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTo(0, 0)
    }
  }, [scroller?.id])

  return (
    <Box ref={boxRef} sx={{ my: 2, maxHeight: maxHeight, overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
      {children}
    </Box>
  )
}

export default ScrollableBox
