import { Box, Typography, Container, Link, Divider } from '@mui/material'
import { NewsItem } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import NLink from 'next/link'
import { CasinoBlackTransparent, CasinoGrayTransparent } from './themes/mainTheme'

const NewsFeedLayout = ({ articles }: { articles: NewsItem[] }) => {
  return (
    <>
      <Container>
        <Divider />
        {articles.map((item) => (
          <Box key={item.HeadlineRecordHash} sx={{ my: 4, pl: 4 }}>
            <Box>
              <Typography variant={'h6'}>
                <NLink passHref href={item.Link!}>
                  <Link sx={{ textDecoration: 'none', color: CasinoBlackTransparent }} target={'_blanks'}>
                    {item.Headline}
                  </Link>
                </NLink>
              </Typography>
              {/* <Typography variant='body2'>{item.Source}</Typography> */}
            </Box>
          </Box>
        ))}
      </Container>
    </>
  )
}

export default NewsFeedLayout
