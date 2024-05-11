import React, { useEffect } from 'react'
import { Scroller } from './useScrollTop'
import { Box, Typography } from '@mui/material'

const ScrollTop = ({ scroller }: { scroller: Scroller }) => {
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (scroller.id) {
      if (scrollTarget.current) {
        scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
        // console.log('scrolling: ', scroller.scrollTop)
      }
    }
  }, [scroller.id])

  return <Typography ref={scrollTarget} mt={-2}></Typography>
}

export default ScrollTop
