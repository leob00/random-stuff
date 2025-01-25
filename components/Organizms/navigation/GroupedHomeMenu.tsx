import { Box, Typography, useTheme } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import { Paths } from './siteMap'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'

const GroupedHomeMenu = ({ pathCategories }: { pathCategories: Paths[] }) => {
  const theme = useTheme()
  return (
    <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} flexWrap={'wrap'} justifyContent={{ xs: 'center' }} gap={1} py={1}>
      {pathCategories.map((category) => (
        <Box key={category.category} px={0.25} py={2} border={`solid 1px ${CasinoBlueTransparent}`} minWidth={250} borderRadius={1}>
          {/* <Card sx={{ minHeight: { xs: 'unset', md: 450 } }}>
            <CardContent> */}
          <Box pb={2}>
            <FadeIn>
              <Typography variant={'h5'} sx={{ textAlign: 'center' }} fontWeight={500}>
                {category.category}
              </Typography>
            </FadeIn>
          </Box>
          <Box>
            {category.paths.map((path, i) => (
              <Box key={path.route}>
                <Box display={'flex'} justifyContent={'center'} py={2}>
                  <FadeIn>
                    <NavigationButton route={path.route} text={path.name} variant={'h6'} />
                  </FadeIn>
                </Box>
                {i < category.paths.length - 1 && <HorizontalDivider />}
              </Box>
            ))}
          </Box>
          {/* </CardContent>
          </Card> */}
        </Box>
      ))}
    </Box>
  )
}

export default GroupedHomeMenu
