'use client'
import { Box, Typography, useTheme } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import { Paths } from './siteMap'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { CasinoBlueTransparent, DarkModeBlueTransparent } from 'components/themes/mainTheme'
import { Navigation } from '../session/useSessionSettings'
import { chunk } from 'lodash'

const GroupedHomeMenu = ({ all, recentRoutes, isAdmin }: { all: Navigation[]; recentRoutes: Navigation[]; isAdmin?: boolean }) => {
  const reorderedPaths = getOrderedPaths(all, recentRoutes, isAdmin ?? false)
  const pathCategories = getPathCategories(reorderedPaths)

  const theme = useTheme()

  return (
    <Box>
      <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} flexWrap={'wrap'} justifyContent={{ xs: 'center' }} gap={1} py={1}>
        {pathCategories.map((category) => (
          <Box key={category.category} minWidth={250}>
            <Box
              pb={2}
              sx={{ backgroundColor: DarkModeBlueTransparent }}
              borderRadius={'6px 6px 0 0'}
              display={'flex'}
              justifyContent={'center'}
              pt={2}
              borderLeft={`solid 1px ${CasinoBlueTransparent}`}
              borderRight={`solid 1px ${CasinoBlueTransparent}`}
              //borderBottom={`solid 1px ${CasinoBlueTransparent}`}
            >
              <FadeIn>
                <Typography variant={'h5'} sx={{ textAlign: 'center' }} fontWeight={500} color={theme.palette.primary.contrastText}>
                  {category.category}
                </Typography>
              </FadeIn>
            </Box>
            <Box
              mt={-0.3}
              pb={2}
              borderLeft={`solid 1px ${CasinoBlueTransparent}`}
              borderRight={`solid 1px ${CasinoBlueTransparent}`}
              borderBottom={`solid 1px ${CasinoBlueTransparent}`}
              borderRadius={'0 0 6px 6px'}
            >
              <Box pt={2} px={1}>
                {category.chunkedPaths.map((chunk, i) => (
                  <Box key={i} display={'flex'} flexDirection={category.paths.length > 2 ? 'row' : 'column'} justifyContent={'space-evenly'}>
                    {chunk.map((path, i) => (
                      <Box key={path.path}>
                        <Box display={'flex'} justifyContent={'center'}>
                          <FadeIn>
                            <NavigationButton path={path.path} name={path.name} category={path.category} variant={'h6'} />
                          </FadeIn>
                        </Box>
                        {/* {i < category.paths.length - 1 && <HorizontalDivider />} */}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
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
