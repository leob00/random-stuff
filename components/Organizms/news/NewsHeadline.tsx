import { Box, Link, Typography } from '@mui/material'
import { NewsItem } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const NewsHeadline = ({ item }: { item: NewsItem }) => {
  return (
    <>
      {item.Headline && (
        <Box textAlign={'center'} px={2}>
          <Link href={item.Link} target='_blank' sx={{ textDecoration: 'none' }}>
            <Typography variant='h4' dangerouslySetInnerHTML={{ __html: `${item.Headline.replace('Pluralistic: ', '')}` }}></Typography>
          </Link>
        </Box>
      )}
    </>
  )
}

export default NewsHeadline
