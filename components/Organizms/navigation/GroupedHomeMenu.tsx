'use client'
import { Box, Typography, useTheme } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import { Paths } from './siteMap'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { CasinoBlueTransparent, DarkModeBlueTransparent } from 'components/themes/mainTheme'
import { Navigation } from '../session/useSessionSettings'
import { chunk } from 'lodash'
import SiteMapCategoryDisplay from './SiteMapCategoryDisplay'

const GroupedHomeMenu = ({ all, recentRoutes, isAdmin }: { all: Navigation[]; recentRoutes: Navigation[]; isAdmin?: boolean }) => {
  const reorderedPaths = getOrderedPaths(
    all.filter((m) => !m.hideFromHomeMenu),
    recentRoutes,
    isAdmin ?? false,
  )
  const pathCategories = getPathCategories(reorderedPaths)

  const theme = useTheme()

  return (
    <Box>
      <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} flexWrap={'wrap'} justifyContent={'center'} gap={1}>
        {pathCategories.map((category) => (
          <Box key={category.category}>
            <SiteMapCategoryDisplay item={category} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function getOrderedPaths(all: Navigation[], recentRoutes: Navigation[], isAdmin: boolean) {
  const reorderedMap = new Map<string, Navigation>()
  recentRoutes.forEach((route) => {
    const found = all.find((m) => m.path === route.path)
    if (found) {
      if (found.category === 'Admin' && isAdmin) {
        reorderedMap.set(found.path, found)
      } else if (found.category !== 'Admin') {
        reorderedMap.set(found.path, found)
      }
    }
  })
  all.forEach((route) => {
    if (!reorderedMap.has(route.path)) {
      if (route.category === 'Admin' && isAdmin) {
        reorderedMap.set(route.path, route)
      } else if (route.category !== 'Admin') {
        reorderedMap.set(route.path, route)
      }
    }
  })
  return Array.from(reorderedMap.values())
}

function getPathCategories(paths: Navigation[]) {
  const allCategories = new Set(paths.map((m) => m.category))
  const pathCategories: Paths[] = []
  allCategories.forEach((cat) => {
    pathCategories.push({
      category: cat,
      paths: paths.filter((m) => m.category === cat),
      chunkedPaths: chunk(
        paths.filter((m) => m.category === cat),
        2,
      ),
    })
  })
  return pathCategories
}

export default GroupedHomeMenu
