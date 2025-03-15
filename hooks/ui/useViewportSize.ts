import { Breakpoint, useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'

export function useViewPortSize() {
  const [size, setSize] = useState<Breakpoint>('xl')
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))
  const isMedium = useMediaQuery(theme.breakpoints.down('lg'))
  const isLarge = useMediaQuery(theme.breakpoints.down('xl'))

  useEffect(() => {
    if (isXSmall) {
      setSize('xs')
    } else if (isSmall) {
      setSize('sm')
    } else if (isMedium) {
      setSize('md')
    } else if (isLarge) {
      setSize('lg')
    }
  }, [size, isXSmall, isSmall, isMedium, isLarge])

  return {
    viewPortSize: size,
  }
}
