'use client'
import { Box } from '@mui/material'
import SiteLink from './app/server/Atoms/Links/SiteLink'
import { useRouteTracker } from './Organizms/session/useRouteTracker'
import { useEffect, useState } from 'react'

const HeaderLinks = () => {
  const { lastRoute, previousRoute } = useRouteTracker()
  const [isLoading, setIsLoading] = useState(true)
  const [prevRoute, setPrevRoute] = useState(previousRoute)

  useEffect(() => {
    setPrevRoute(previousRoute)
    setIsLoading(false)
  }, [lastRoute])

  return (
    <Box display='flex' gap={{ xs: 1, sm: 2 }} alignItems={'center'}>
      {!isLoading && (
        <Box sx={{ display: { sm: 'none' } }}>
          <SiteLink href={prevRoute.path} text={prevRoute.name} />
        </Box>
      )}
    </Box>
  )
}

export default HeaderLinks
