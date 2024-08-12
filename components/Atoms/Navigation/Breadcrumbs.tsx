'use client'
import { Box, Divider } from '@mui/material'
import { Navigation, useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import { useRouter } from 'next/router'
import { allRouteMap } from 'components/Organizms/session/RouteTracker'
import { Path } from 'components/Organizms/navigation/siteMap'
import LinkButton from '../Buttons/LinkButton'
import { useEffect, useState } from 'react'
import { take } from 'lodash'
import { sortArray } from 'lib/util/collections'

export const BasicBreadcrumbs = () => {
  const router = useRouter()
  const { lastRoute, allRoutes } = useRouteTracker()
  const [routes, setRoutes] = useState<Path[]>([])

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
            disabled={index === routes.length - 1}
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
      routes.push({ name: r.name, route: r.route })
    }
  })

  return routes
}

export default BasicBreadcrumbs
