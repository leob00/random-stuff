import { Breakpoint, useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

export function useViewPortSize() {
  //const [size, setSize] = useState<Breakpoint>('xl')
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const isSmall = useMediaQuery(theme.breakpoints.down('md')) && !isXSmall
  const isMedium = useMediaQuery(theme.breakpoints.down('lg')) && !isXSmall && !isSmall
  const isLarge = useMediaQuery(theme.breakpoints.down('xl')) && !isXSmall && !isSmall && !isMedium
  const isXLarge = useMediaQuery(theme.breakpoints.up('lg')) && !isXSmall && !isSmall && !isMedium && !isLarge
  let windowWidth = 500
  let windowHeight = 500
  if (typeof window !== 'undefined') {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight
  }

  const size = useMemo(() => {
    let result: Breakpoint = 'md'
    if (isXSmall) {
      result = 'xs'
    }
    if (isSmall) {
      result = 'sm'
    }
    if (isMedium) {
      result = 'md'
    }
    if (isLarge) {
      result = 'lg'
    }
    if (isXLarge) {
      result = 'xl'
    }

    return result
  }, [isXSmall, isSmall, isMedium, isLarge])

  return {
    viewPortSize: size,
    windowWidth,
    windowHeight,
  }
}
