'use client'
import { Box, Divider } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import { useRouter } from 'next/router'
import LinkButton from '../Buttons/LinkButton'
import { take } from 'lodash'
import { sortArray } from 'lib/util/collections'
import { Navigation } from 'components/Organizms/session/useSessionSettings'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { flatSiteMap } from 'components/Organizms/navigation/siteMap'
import FadeIn from '../Animations/FadeIn'
import { useEffect, useState } from 'react'

export const BasicBreadcrumbs = () => {
  const router = useRouter()
  const { allRoutes, addRoute } = useRouteTracker()
  const routes = getRoutes(allRoutes)
  const currentRoute = router.asPath
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleClick = (route: Navigation) => {
    addRoute(route.path)
    router.push(route.path)
  }

  return (
    <>
      {!isLoading && (
        <Box display={'flex'} gap={2}>
          {routes.map((route, index) => (
            <Box key={route.path} display={'flex'} alignItems={'center'} gap={2}>
              {route.path === currentRoute ? (
                <LinkButton
                  disabled
                  onClick={() => {
                    handleClick(route)
                  }}
                >
                  {route.name}
                </LinkButton>
              ) : (
                <FadeIn>
                  <LinkButton
                    onClick={() => {
                      handleClick(route)
                    }}
                  >
                    {route.name}
                  </LinkButton>
                </FadeIn>
              )}

              {index < routes.length - 1 && <Divider orientation='vertical' sx={{ height: '10px' }} />}
            </Box>
          ))}
        </Box>
      )}
    </>
  )
}

function getRoutes(allRoutes: Navigation[]) {
  const nav = sortArray(take(allRoutes, 5), ['date'], ['asc'])
  const map = getMapFromArray(flatSiteMap, 'path')
  const routes: Navigation[] = []
  nav.forEach((p) => {
    if (map.has(p.path)) {
      const r = map.get(p.path)!
      routes.push(r)
    }
  })

  return routes
}

export default BasicBreadcrumbs
