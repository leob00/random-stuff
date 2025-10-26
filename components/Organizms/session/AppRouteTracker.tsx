'use client'
import { ReactNode, useEffect } from 'react'
import { useRouteTracker } from './useRouteTracker'
import { Box } from '@mui/material'
import { usePathname } from 'next/navigation'

const AppRouteTracker = ({ children }: { children: ReactNode }) => {
  const path = usePathname()

  const { addRoute } = useRouteTracker()

  useEffect(() => {
    if (path) {
      addRoute(path)
    }
  }, [path])

  return (
    <Box>
      <Box minHeight={250}>{children}</Box>
    </Box>
  )
}

export default AppRouteTracker
