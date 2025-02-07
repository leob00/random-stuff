import { Box, Typography } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import { Paths, flatSiteMap } from './siteMap'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { Navigation } from '../session/useSessionSettings'

const GroupedHomeMenu = ({ recentRoutes, isAdmin }: { recentRoutes: Navigation[]; isAdmin?: boolean }) => {
  const all = flatSiteMap.filter((m) => m.category !== 'Home')
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
  const reorderedPaths = Array.from(reorderedMap.values())

  const allCategories = new Set(reorderedPaths.map((m) => m.category))
  const pathCategories: Paths[] = []
  allCategories.forEach((cat) => {
    pathCategories.push({
      category: cat,
      paths: reorderedPaths.filter((m) => m.category === cat),
    })
  })

  return (
    <Box>
      <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} flexWrap={'wrap'} justifyContent={{ xs: 'center' }} gap={1} py={1}>
        {pathCategories.map((category) => (
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
    </Box>
  )
}

export default GroupedHomeMenu
