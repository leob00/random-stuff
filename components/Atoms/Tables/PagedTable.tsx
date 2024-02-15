import { Box } from '@mui/material'
import { usePager } from 'hooks/usePager'
import React, { ReactNode } from 'react'
import Pager from '../Pager'

const PagedTable = ({ data, pageSize = 10, onPaged, table }: { data: any[]; pageSize?: number; onPaged: (pageNum: number) => void; table: ReactNode }) => {
  const { page, setPage, displayItems, pageCount } = usePager(data, pageSize)
  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
    onPaged(pageNum)
  }
  return (
    <>
      {table}
      <Box pt={4}>
        <Pager
          pageCount={pageCount}
          itemCount={displayItems.length}
          itemsPerPage={pageSize}
          onPaged={(pageNum: number) => handlePaged(pageNum)}
          defaultPageIndex={page}
          totalItemCount={data.length}
        ></Pager>
      </Box>
    </>
  )
}

export default PagedTable
