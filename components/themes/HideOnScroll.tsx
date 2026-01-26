'use client'

import { Slide, useScrollTrigger } from '@mui/material'
import { ReactElement } from 'react'

const HideOnScroll = ({ children }: { children: ReactElement<unknown, any> }) => {
  const trigger = useScrollTrigger({
    threshold: 85, // Optional: pixels before triggering
  })
  return (
    <Slide appear={false} direction='down' in={!trigger} timeout={600}>
      {children}
    </Slide>
  )
}

export default HideOnScroll
