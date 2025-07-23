import { Box, useMediaQuery, useTheme } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { WidgetSize } from 'components/Organizms/dashboard/dashboardModel'
import FeaturedRecipesDisplay from 'components/Organizms/recipes/FeaturedRecipesDisplay'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { SiteStats } from 'lib/backend/api/aws/models/apiGatewayModels'
import { get } from 'lib/backend/api/fetchFunctions'
import { getDynamoItemData, putRecord } from 'lib/backend/csr/nextApiWrapper'
import { RecipeCollection } from 'lib/models/cms/contentful/recipe'
import { getUtcNow } from 'lib/util/dateUtil'
import { shuffle, take } from 'lodash'

const FeaturedRecipesWidget = ({ width, height, size }: { width: number; height: number; size: WidgetSize }) => {
  const mutateKey = 'featured-recipes'
  const theme = useTheme()
  const cmsRefreshIntervalSeconds = 21600 // 6 hours
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const siteStatsKey = 'site-stats'

  const dataFn = async () => {
    let resp = await getDynamoItemData<SiteStats | null>(siteStatsKey)
    if (!resp) {
      resp = {
        recipes: {
          featured: [],
          lastRefreshDate: getUtcNow().subtract(10, 'hour').format(),
        },
      }
    }

    const lastDt = dayjs(resp.recipes.lastRefreshDate)
    const now = getUtcNow()

    if (lastDt.add(cmsRefreshIntervalSeconds, 'second').isBefore(now)) {
      const allRecipesResp = (await get('/api/recipes')) as RecipeCollection
      const newRecipes = take(shuffle(allRecipesResp.items), 10)
      const newStiteStats = { ...resp, recipes: { lastRefreshDate: now.format(), featured: newRecipes } }
      putRecord(siteStatsKey, siteStatsKey, newStiteStats)

      return newRecipes
    }

    return resp.recipes.featured
  }
  const imageSize = {
    width: 220,
    height: 220,
  }
  if (isXSmall) {
    imageSize.width = 220
    imageSize.height = 220
  }

  const { data } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })
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
