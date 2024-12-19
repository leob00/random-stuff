import { Box, useMediaQuery, useTheme } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { NewsItem, NewsTypeIds } from 'lib/backend/api/qln/qlnApi'
import NewsListItem from './NewsListItem'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import { profile } from 'console'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'

dayjs.extend(relativeTime)

export const getThumbnailSize = (source?: string) => {
  if (!source) {
    return 300
  }
  const s = source as NewsTypeIds
  switch (s) {
    case 'CBSWorld':
      return 80
    case 'SkyNews':
      return 120
    default:
      return 300
  }
}

const NewsList = ({
  newsItems,
  userProfile,
  hideSaveButton = false,
  showPublishDate = false,
}: {
  newsItems: NewsItem[]
  userProfile: UserProfile | null
  hideSaveButton?: boolean
  showPublishDate?: boolean
}) => {
  const theme = useTheme()
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      {newsItems.length > 0 ? (
        newsItems.map((item, i) => (
          <Box key={`${item.Headline}${item.PublishDate}`} pb={2}>
            <NewsListItem
              userProfile={userProfile}
              item={item}
              hideSaveButton={hideSaveButton}
              showPublishDate={showPublishDate}
              isSmallDevice={isSmallDevice}
            />
            <HorizontalDivider />
          </Box>
        ))
      ) : (
        <NoDataFound />
      )}
    </>
  )
}

export default NewsList
