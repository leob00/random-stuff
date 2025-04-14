import { Box, Card, CardHeader, Link, Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { NewsItem } from 'lib/backend/api/qln/qlnApi'

const NewsHeadline = ({ item }: { item: NewsItem }) => {
  return (
    <Box>
      {item.Headline && (
        <FadeIn>
          <Box textAlign={'left'} px={2}>
            <Link href={item.Link} target='_blank' sx={{ textDecoration: 'none' }}>
              <Typography variant='h4' dangerouslySetInnerHTML={{ __html: `${item.Headline.replace('Pluralistic: ', '')}` }}></Typography>
            </Link>
          </Box>
        </FadeIn>
      )}
    </Box>
  )
}

export default NewsHeadline
