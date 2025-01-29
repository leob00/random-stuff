'use client'
import { Box, Divider } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import { useRouter } from 'next/router'
import { allRouteMap } from 'components/Organizms/session/RouteTracker'
import { Path } from 'components/Organizms/navigation/siteMap'
import LinkButton from '../Buttons/LinkButton'
import { useEffect, useState } from 'react'
import { take } from 'lodash'
import { sortArray } from 'lib/util/collections'
import { Navigation } from 'components/Organizms/session/useSessionSettings'

export const BasicBreadcrumbs = () => {
  const router = useRouter()
  const { lastRoute, allRoutes } = useRouteTracker()
  const [routes, setRoutes] = useState<Path[]>([])
  const currentRoute = router.asPath

  useEffect(() => {
    const result = getRoutes(allRoutes)
    setRoutes(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastRoute])

  return (
    <Box display={'flex'} gap={2}>
      {routes.map((route, index) => (
        <Box key={route.route} display={'flex'} alignItems={'center'} gap={2}>
          <LinkButton
            disabled={route.route === currentRoute}
            onClick={() => {
              router.push(route.route)
            }}
          >
            {route.name}
          </LinkButton>
          {index < routes.length - 1 && <Divider orientation='vertical' sx={{ height: '10px' }} />}
        </Box>
      ))}
    </Box>
  )
}

function getRoutes(allRoutes: Navigation[]) {
  const nav = sortArray(take(allRoutes, 5), ['date'], ['asc'])
  const map = allRouteMap()
  const routes: Path[] = []
  nav.forEach((p) => {
    if (map.has(p.path)) {
      const r = map.get(p.path)!
      routes.push({ name: r.name, route: r.path })
    }
  })

  return routes
}

export default BasicBreadcrumbs
