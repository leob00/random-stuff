import { Box, Stack } from '@mui/material'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import Pager from 'components/Atoms/Pager'
import RemoteImage from 'components/Atoms/RemoteImage'
import { getPagedItems } from 'lib/util/collections'
import { cloneDeep, findLast } from 'lodash'
import React, { useState } from 'react'
import { BasicArticle } from 'lib/backend/api/aws/models/apiGatewayModels'
import { usePager } from 'hooks/usePager'

const ArticlesLayout = ({ articles }: { articles: BasicArticle[] }) => {
  const shuffled = cloneDeep(articles)
  // const itemsPerPage = 1
  // const paged = getPagedItems<BasicArticle>(shuffled, itemsPerPage)

  // const [currentPageIndex, setCurrentPageIndex] = useState(1)
  // const [displayedItems, setDisplayedItems] = useState<BasicArticle[]>(paged.pages[0].items as BasicArticle[])

  // const handlePaged = (pageNum: number) => {
  //   setCurrentPageIndex(pageNum)
  //   let page = findLast(paged.pages, (p) => {
  //     return p.index === pageNum
  //   })
  //   if (page) {
  //     setDisplayedItems(page.items as BasicArticle[])
  //   }
  // }
  const handleImageLoaded = () => {}

  const { displayItems: items, allItems, pageCount, page, setPage } = usePager(articles, 1)
  const displayItems = items as BasicArticle[]

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
  }

  return (
    <>
      {articles && (
        <>
          <Box>
            <BackToHomeButton />
            <CenteredTitle title={articles[0].title} />
            <HorizontalDivider />
          </Box>
          {displayItems.length > 0 && (
            <Stack direction='row' justifyContent='center' my={2}>
              <RemoteImage url={displayItems[0].imagePath} title={displayItems[0].title} onLoaded={handleImageLoaded} />
            </Stack>
          )}
          <Pager
            pageCount={pageCount}
            itemCount={displayItems.length}
            itemsPerPage={1}
            onPaged={(pageNum: number) => handlePaged(pageNum)}
            defaultPageIndex={page}
            totalItemCount={allItems.length}
          ></Pager>
        </>
      )}
    </>
  )
}

export default ArticlesLayout
