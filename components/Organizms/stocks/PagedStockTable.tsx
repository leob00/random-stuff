import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import { useClientPager } from 'hooks/useClientPager'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { orderBy } from 'lodash'
import React from 'react'
import StockTable from './StockTable'

const PagedStockTable = ({
  data,
  showGroupName = false,
  pageSize = 5,
  sort,
}: {
  data: StockQuote[]
  showGroupName?: boolean
  pageSize?: number
  sort?: Sort[]
}) => {
  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(data, pageSize)
  const items = getPagedItems(data)
  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
  }
  React.useEffect(() => {
    if (sort) {
      reset(data)
    }
  }, [sort])

  return (
    <>
      <Box minHeight={140 * pageSize}>
        <StockTable stockList={items} isStock={true} showGroupName={showGroupName} showSummary={false} />
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
