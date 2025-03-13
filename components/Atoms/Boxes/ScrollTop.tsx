import { useEffect, useRef } from 'react'
import { Scroller } from './useScrollTop'
import { Box, Typography } from '@mui/material'

const ScrollTop = ({ scroller, marginTop = 2 }: { scroller: Scroller; marginTop?: number }) => {
  const scrollTarget = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scroller.id) {
      if (scrollTarget.current) {
        scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
        // console.log('scrolling: ', scroller.scrollTop)
      }
    }
  }, [scroller.id])

  return (
    <Box pt={1} sx={{ position: 'absolute', mt: marginTop }}>
      <Box ref={scrollTarget}></Box>
    </Box>
  )
}

export default ScrollTop
