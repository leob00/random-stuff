import { Box, Typography } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import { Paths, SiteCategories } from './siteMap'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { Navigation } from '../session/useSessionSettings'
import { useEffect, useState } from 'react'

const GroupedHomeMenu = ({ pathCategories, recentRoutes }: { pathCategories: Paths[]; recentRoutes?: Navigation[] }) => {
  const [paths, setPaths] = useState(pathCategories)

  useEffect(() => {
    const newPathCats = new Map<SiteCategories, Paths>()
    const allRecentPaths = recentRoutes ? recentRoutes.filter((m) => m.path !== '/') : []
    allRecentPaths.forEach((path) => {
      const ex = pathCategories.find((m) => m.category === path.category)
      if (ex) {
        const n = ex.paths.filter((m) => m.path !== path.path)
        n.unshift(path)
        newPathCats.set(ex.category, { ...ex, paths: n })
      }
    })

    pathCategories.forEach((path) => {
      if (!newPathCats.has(path.category)) {
        newPathCats.set(path.category, path)
      }
    })
    console.log(Array.from(newPathCats.values()))
    setPaths(Array.from(newPathCats.values()))
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
