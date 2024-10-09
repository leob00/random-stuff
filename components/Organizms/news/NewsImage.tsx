import { NewsItem } from 'lib/backend/api/qln/qlnApi'
import { getThumbnailSize } from './NewsList'
import { Stack, Box } from '@mui/material'

const NewsImage = ({ item }: { item: NewsItem }) => {
  return (
    <>
      {item.TeaserImageUrl !== undefined && item.TeaserImageUrl.length > 0 && !item.Description!.includes('img') && (
        <Box>
          <Box pt={1} maxWidth={350} display={'flex'} sx={{ margin: 'auto' }}>
            <img src={item.TeaserImageUrl} title='' width={getThumbnailSize(item.Source)} style={{ borderRadius: '16px' }} alt={item.TeaserImageUrl} />
          </Box>
        </Box>
      )}
    </>
  )
}

export default NewsImage
