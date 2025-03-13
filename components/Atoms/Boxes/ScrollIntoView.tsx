import { Typography } from '@mui/material'
import { useEffect, useId, useRef, useState } from 'react'

const ScrollIntoView = ({ enabled = true, margin = -14 }: { enabled?: boolean; margin?: number }) => {
  const scrollTarget = useRef<HTMLSpanElement | null>(null)
  const [scrollIntoView, setScrollIntoView] = useState(enabled)
  const id = useId()
  useEffect(() => {
    if (scrollIntoView) {
      if (scrollTarget.current) {
        scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setScrollIntoView(false)
  }, [scrollIntoView])
  return <Typography id={id} ref={scrollTarget} sx={{ position: 'absolute', mt: margin }}></Typography>
}

export default ScrollIntoView
