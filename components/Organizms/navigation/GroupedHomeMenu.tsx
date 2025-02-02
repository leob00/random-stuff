import { Box, Typography } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import { Paths, SiteCategories } from './siteMap'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { Navigation } from '../session/useSessionSettings'
import { useEffect, useState } from 'react'
import { useRouteTracker } from '../session/useRouteTracker'

const GroupedHomeMenu = ({ pathCategories, recentRoutes }: { pathCategories: Paths[]; recentRoutes?: Navigation[] }) => {
  const [paths, setPaths] = useState(pathCategories)

  useEffect(() => {
    if (recentRoutes && recentRoutes.length > 0) {
      const noneHome = recentRoutes.filter((m) => m.path !== '/')
      if (noneHome.length > 0) {
        const newPaths = new Map<SiteCategories, Paths>()
        noneHome.forEach((cat) => {
          const ex = pathCategories.find((m) => m.category === cat.category)
          if (ex) {
            newPaths.set(ex.category, ex)
          }
        })
        pathCategories.forEach((p) => {
          if (!newPaths.has(p.category)) {
            newPaths.set(p.category, p)
          }
        })

        setPaths(Array.from(newPaths.values()))
      }
    }
  }, [recentRoutes, pathCategories])

  return (
    <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} flexWrap={'wrap'} justifyContent={{ xs: 'center' }} gap={1} py={1}>
      {paths.map((category) => (
        <Box key={category.category} px={0.25} py={2} border={`solid 1px ${CasinoBlueTransparent}`} minWidth={250} borderRadius={1}>
          <Box pb={2}>
            <FadeIn>
              <Typography variant={'h5'} sx={{ textAlign: 'center' }} fontWeight={500}>
                {category.category}
              </Typography>
            </FadeIn>
          </Box>
          <Box>
            {category.paths.map((path, i) => (
              <Box key={path.path}>
                <Box display={'flex'} justifyContent={'center'} py={2}>
                  <FadeIn>
                    <NavigationButton path={path.path} name={path.name} category={path.category} variant={'h6'} />
                  </FadeIn>
                </Box>
                {i < category.paths.length - 1 && <HorizontalDivider />}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default GroupedHomeMenu
