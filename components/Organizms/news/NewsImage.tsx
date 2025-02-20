import { NewsItem } from 'lib/backend/api/qln/qlnApi'
import { getThumbnailSize } from './NewsList'
import { Stack, Box } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'

const NewsImage = ({ item }: { item: NewsItem }) => {
  return (
    <>
      {item.TeaserImageUrl !== undefined && item.TeaserImageUrl.length > 0 && !item.Description!.includes('img') && (
        <FadeIn>
          <Box>
            <Box pt={1} maxWidth={350} display={'flex'} px={2}>
              <img src={item.TeaserImageUrl} title='' width={getThumbnailSize(item.Source)} style={{ borderRadius: '16px' }} alt={item.TeaserImageUrl} />
            </Box>
          </Box>
        </FadeIn>
      )}
    </>
  )
}

export default NewsImage
