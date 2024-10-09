import { Box } from '@mui/material'
import React from 'react'
import NewsDescription from './NewsDescription'
import NewsHeadline from './NewsHeadline'
import NewsImage from './NewsImage'
import { NewsItem } from 'lib/backend/api/qln/qlnApi'

const NewsListItemMobile = ({ item }: { item: NewsItem }) => {
  return (
    <Box>
      <Box display={'flex'} flexDirection={'column'}>
        <Box py={2}>
          <NewsHeadline item={item} />
        </Box>
        <NewsImage item={item} />
      </Box>
      <NewsDescription item={item} />
    </Box>
  )
}

export default NewsListItemMobile
