'use client'
import { Box, Divider, Typography, useTheme } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import LinkButton from '../Buttons/LinkButton'
import { sortArray } from 'lib/util/collections'
import { Navigation } from 'components/Organizms/session/useSessionSettings'
import { getMapFromArray } from 'lib/util/collectionsNative'
import { flatSiteMap } from 'components/Organizms/navigation/siteMap'
import FadeIn from '../Animations/FadeIn'
import { useEffect, useState } from 'react'
import { useViewPortSize } from 'hooks/ui/useViewportSize'
import { take } from 'lodash'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

export const BasicBreadcrumbs = () => {
  const router = useRouter()
  const theme = useTheme()
  const { allRoutes, addRoute } = useRouteTracker()
  const { viewPortSize } = useViewPortSize()
  let take = 8
  if (viewPortSize === 'xs') {
    take = 3
  }
  if (viewPortSize === 'sm') {
    take = 4
  }
  if (viewPortSize === 'md') {
    take = 6
  }

  const routes = getRoutes(allRoutes, take)
  const currentRoute = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleClick = (route: Navigation) => {
    router.push(route.path)
    addRoute(route.path)
  }

  return (
    <>
      {!isLoading && (
        <Box sx={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
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
                    <Typography>{route.breadcrumbName ?? route.name}</Typography>
                  </LinkButton>
                ) : (
                  <FadeIn>
                    <LinkButton
                      onClick={() => {
                        handleClick(route)
                      }}
                    >
                      <Typography>{route.breadcrumbName ?? route.name}</Typography>
                    </LinkButton>
                    {/* <NavigationButton category={route.category} name={route.name} path={route.path} /> */}
                  </FadeIn>
                )}

                {index < routes.length - 1 && (
                  <Box display='flex' justifyContent={'flex-start'}>
                    <Divider color={theme.palette.primary.main} orientation='vertical' sx={{ height: '10px' }} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  )
}

function getRoutes(allRoutes: Navigation[], takeTop = 8) {
  const nav = sortArray(take(allRoutes, takeTop), ['date'], ['asc'])
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
