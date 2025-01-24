import { Box, Card, CardContent } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import { Paths } from './siteMap'
import FadeIn from 'components/Atoms/Animations/FadeIn'

const GroupedHomeMenu = ({ pathCategories }: { pathCategories: Paths[] }) => {
  return (
    <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} flexWrap={'wrap'} justifyContent={{ xs: 'center' }} gap={1}>
      {pathCategories.map((category) => (
        <Box key={category.category} pb={2} display={'flext'}>
          <Card sx={{ minHeight: { xs: 'unset', md: 450 } }}>
            <CardContent>
              <FadeIn>
                <CenteredTitle title={category.category} variant='h4' />
              </FadeIn>
              <Box display={'flex'} justifyContent={'center'}>
                <Box>
                  {category.paths.map((path) => (
                    <Box key={path.route} display={'flex'} justifyContent={'center'}>
                      <FadeIn>
                        <NavigationButton route={path.route} text={path.name} variant={'body1'} />
                      </FadeIn>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  )
}

export default GroupedHomeMenu
