import { Box, useMediaQuery, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { WidgetSize } from 'components/Organizms/dashboard/dashboardModel'
import FeaturedRecipesDisplay from 'components/Organizms/recipes/FeaturedRecipesDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { SiteStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getRecord } from 'lib/backend/csr/nextApiWrapper'

const FeaturedRecipesWidget = ({ width, height, size }: { width: number; height: number; size: WidgetSize }) => {
  const mutateKey = 'featured-recipes'
  const theme = useTheme()

  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))

  const dataFn = async () => {
    const resp = await getRecord<SiteStats>('site-stats')
    return resp.recipes.featured
  }
  const imageSize = {
    width: isXSmall ? 100 : 190,
    height: 240,
  }
  if (isXSmall) {
    imageSize.width = 100
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
  return (
    <>
      <Box minHeight={height} width={width}>
        {data && (
          <FadeIn>
            <Box>
              <FeaturedRecipesDisplay featured={data} imageWidth={imageSize.width} imageHeight={imageSize.height} />
            </Box>
          </FadeIn>
        )}
      </Box>
    </>
  )
}

export default FeaturedRecipesWidget
