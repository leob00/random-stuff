import { Box } from '@mui/material'
import NewsImage from './NewsImage'
import { NewsItem } from 'lib/backend/api/qln/qlnApi'
import NewsDescription from './NewsDescription'
import NewsHeadline from './NewsHeadline'

const NewListItemDesktop = ({ item }: { item: NewsItem }) => {
  return (
    <Box>
      <Box display={'flex'} justifyContent={'flex-start'}>
        <NewsImage item={item} />
        <Box py={1}>
          <NewsHeadline item={item} />
        </Box>
      </Box>
      <NewsDescription item={item} />
    </Box>
  )
}

export default NewListItemDesktop
