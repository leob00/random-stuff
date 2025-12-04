'use client'
import { Box, Typography, useTheme } from '@mui/material'
import { Paths, SiteCategories } from './siteMap'
import { CasinoBlueTransparent, DarkModeBlueTransparent } from 'components/themes/mainTheme'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'

const SiteMapCategoryDisplay = ({ item }: { item: Paths }) => {
  const theme = useTheme()
  return (
    <Box minWidth={{ xs: 350, sm: 250 }}>
      <Box
        sx={{ backgroundColor: DarkModeBlueTransparent }}
        borderRadius={'6px 6px 0 0'}
        display={'flex'}
        justifyContent={'center'}
        py={1}
        borderLeft={`solid 1px ${CasinoBlueTransparent}`}
        borderRight={`solid 1px ${CasinoBlueTransparent}`}
      >
        <FadeIn>
          <Typography variant={'h5'} sx={{ textAlign: 'center' }} fontWeight={500} color={theme.palette.primary.contrastText}>
            {item.category}
          </Typography>
        </FadeIn>
      </Box>
      <Box
        minHeight={{ sm: 190 }}
        pb={2}
        borderLeft={`solid 1px ${CasinoBlueTransparent}`}
        borderRight={`solid 1px ${CasinoBlueTransparent}`}
        borderBottom={`solid 1px ${CasinoBlueTransparent}`}
        borderRadius={'0 0 6px 6px'}
      >
        <Box pt={2}>
          {item.chunkedPaths.map((chunk, i) => (
            <Box key={i} display={'flex'} flexDirection={item.paths.length > 1 ? 'row' : 'column'} justifyContent={'space-between'} gap={{ sm: 1 }}>
              {chunk.map((path, i) => (
                <Box key={path.path}>
                  <Box display={'flex'} py={{ xs: 0.8 }} px={{ xs: 1, sm: 2 }}>
                    <FadeIn>
                      <NavigationButton path={path.path} name={path.name} category={path.category} variant={'h6'} />
                    </FadeIn>
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default SiteMapCategoryDisplay
