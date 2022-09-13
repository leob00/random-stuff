import { Box, Typography, Container, Link, Divider } from '@mui/material'
import { NewsItem } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import NLink from 'next/link'
import { CasinoBlackTransparent, CasinoGrayTransparent } from './themes/mainTheme'
import { getPagedItems } from 'lib/util/collections'
import { findLast } from 'lodash'
import Pager from './Atoms/Pager'
import CenterStack from './Atoms/CenterStack'

const NewsFeedLayout = ({ articles }: { articles: NewsItem[] }) => {
  const itemsPerPage = 1
  const paged = getPagedItems<NewsItem>(articles, itemsPerPage)

  const [currentPageIndex, setCurrentPageIndex] = React.useState(1)
  const [displayedItems, setDisplayedItems] = React.useState<NewsItem[]>(paged.pages[0].items as NewsItem[])

  const handlePaged = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    let page = findLast(paged.pages, (p) => {
      return p.index === pageNum
    })
    if (page) {
      setDisplayedItems(page.items as NewsItem[])
    }
  }
  return (
    <>
      <Container>
        <Divider />
        {displayedItems.length > 0 &&
          displayedItems.map((item) => (
            <Box key={item.HeadlineRecordHash} sx={{ my: 4, minHeight: 120 }}>
              <Typography variant={'h6'} sx={{ textAlign: 'center' }}>
                <NLink passHref href={item.Link!}>
                  <Link sx={{ textDecoration: 'none', color: CasinoBlackTransparent }} target={'_blanks'}>
                    {item.Headline}
                  </Link>
                </NLink>
              </Typography>
              {/* <Typography variant='body2'>{item.Source}</Typography> */}
            </Box>
          ))}
        <Pager pageCount={paged.pages.length} itemCount={articles.length} itemsPerPage={itemsPerPage} onPaged={(pageNum: number) => handlePaged(pageNum)} defaultPageIndex={currentPageIndex}></Pager>
      </Container>
    </>
  )
}

export default NewsFeedLayout
