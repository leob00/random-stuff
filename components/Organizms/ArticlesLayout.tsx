import { Box, Stack } from '@mui/material'
import BackToHomeButton from 'components/Atoms/Buttons/BackToHomeButton'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import Pager from 'components/Atoms/Pager'
import RemoteImage from 'components/Atoms/RemoteImage'
import React from 'react'
import { BasicArticle } from 'lib/backend/api/aws/models/apiGatewayModels'
import { useClientPager } from 'hooks/useClientPager'

const ArticlesLayout = ({ articles }: { articles: BasicArticle[] }) => {
  const handleImageLoaded = () => {}

  const { pagerModel, getPagedItems, setPage } = useClientPager(articles, 1)
  const displayItems = getPagedItems(articles)

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
            pageCount={pagerModel.totalNumberOfPages}
            itemCount={displayItems.length}
            itemsPerPage={1}
            onPaged={(pageNum: number) => handlePaged(pageNum)}
            defaultPageIndex={pagerModel.page}
            totalItemCount={pagerModel.totalNumberOfItems}
          ></Pager>
        </>
      )}
    </>
  )
}

export default ArticlesLayout
