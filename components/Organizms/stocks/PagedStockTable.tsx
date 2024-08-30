import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { useClientPager } from 'hooks/useClientPager'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import StockTable from './StockTable'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'

const PagedStockTable = ({
  data,
  showGroupName = false,
  pageSize = 5,
  sort,
  featuredField,
}: {
  data: StockQuote[]
  showGroupName?: boolean
  pageSize?: number
  sort?: Sort[]
  featuredField?: keyof StockQuote
}) => {
  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(data, pageSize)
  const items = getPagedItems(data)
  const scroller = useScrollTop(0)
  const handlePaged = (pageNum: number) => {
    scroller.scroll()
    setPage(pageNum)
  }
  React.useEffect(() => {
    if (sort) {
      reset(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort])

  return (
    <>
      <Box minHeight={140 * pageSize}>
        <StockTable stockList={items} isStock={true} showGroupName={showGroupName} showSummary={false} featuredField={featuredField} />
      </Box>
      <Pager
        pageCount={pagerModel.totalNumberOfPages}
        itemCount={items.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={pagerModel.page}
        totalItemCount={pagerModel.totalNumberOfItems}
        showHorizontalDivider={false}
      ></Pager>
    </>
  )
}
export default PagedStockTable
