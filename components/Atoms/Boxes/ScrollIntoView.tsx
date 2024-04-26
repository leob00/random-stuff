import { Typography } from '@mui/material'
import React from 'react'

const ScrollIntoView = ({ enabled = true, margin = -14 }: { enabled?: boolean; margin?: number }) => {
  const scrollTarget = React.useRef<HTMLSpanElement | null>(null)
  const [scrollIntoView, setScrollIntoView] = React.useState(enabled)
  const id = React.useId()
  React.useEffect(() => {
    if (scrollIntoView) {
      if (scrollTarget.current) {
        scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
        //scroll(0, scrollTarget.current.offsetTop ?? 0)
      }
    }
    setScrollIntoView(false)
  }, [scrollIntoView])
  return <Typography id={id} ref={scrollTarget} sx={{ position: 'absolute', mt: margin }}></Typography>
}

export default ScrollIntoView
