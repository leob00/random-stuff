'use client'
import { Box, Divider } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import { useRouter } from 'next/router'
import { allRouteMap } from 'components/Organizms/session/RouteTracker'
import LinkButton from '../Buttons/LinkButton'
import { useEffect, useState } from 'react'
import { take } from 'lodash'
import { sortArray } from 'lib/util/collections'
import { Navigation } from 'components/Organizms/session/useSessionSettings'

export const BasicBreadcrumbs = () => {
  const router = useRouter()
  const { lastRoute, allRoutes, addRoute } = useRouteTracker()
  const [routes, setRoutes] = useState<Navigation[]>([])
  const currentRoute = router.asPath
  const handleClick = (route: Navigation) => {
    addRoute(route.path)
    router.push(route.path)
  }
  useEffect(() => {
    const result = getRoutes(allRoutes)
    setRoutes(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastRoute])

  return (
    <Box display={'flex'} gap={2}>
      {routes.map((route, index) => (
        <Box key={route.path} display={'flex'} alignItems={'center'} gap={2}>
          <LinkButton
            disabled={route.path === currentRoute}
            onClick={() => {
              handleClick(route)
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
  const routes: Navigation[] = []
  nav.forEach((p) => {
    if (map.has(p.path)) {
      const r = map.get(p.path)!
      routes.push({ name: r.name, path: r.path, category: p.category, isProtected: p.isProtected })
    }
  })

  return routes
}

export default BasicBreadcrumbs
