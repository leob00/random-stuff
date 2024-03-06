import { Box } from '@mui/material'
import { useClientPager } from 'hooks/useClientPager'
import React, { ReactNode } from 'react'
import Pager from '../Pager'

const PagedTable = ({ data, pageSize = 10, onPaged, table }: { data: any[]; pageSize?: number; onPaged: (pageNum: number) => void; table: ReactNode }) => {
  const { setPage, getPagedItems, pagerModel } = useClientPager(data, pageSize)
  const displayItems = getPagedItems(data)
  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    onPaged(pageNum)
  }
  return (
    <>
      {table}
      <Box pt={4}>
        <Pager
          pageCount={pagerModel.totalNumberOfPages}
          itemCount={displayItems.length}
          itemsPerPage={pageSize}
          onPaged={(pageNum: number) => handlePaged(pageNum)}
          defaultPageIndex={pagerModel.page}
          totalItemCount={pagerModel.totalNumberOfItems}
        ></Pager>
      </Box>
    </>
  )
}

export default PagedTable
