import { Box, Card, CardHeader, Link, Typography } from '@mui/material'
import GradientContainer from 'components/Atoms/Boxes/GradientContainer'
import { NewsItem } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const NewsHeadline = ({ item }: { item: NewsItem }) => {
  return (
    <Box width={'99%'}>
      {item.Headline && (
        <Card>
          <CardHeader
            title={
              <Box textAlign={'center'} px={2}>
                <Link href={item.Link} target='_blank' sx={{ textDecoration: 'none' }}>
                  <Typography variant='h4' dangerouslySetInnerHTML={{ __html: `${item.Headline.replace('Pluralistic: ', '')}` }}></Typography>
                </Link>
              </Box>
            }
          ></CardHeader>
        </Card>
      )}
    </Box>
  )
}

export default NewsHeadline
