import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { usePager } from 'hooks/usePager'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const EconDataTable = ({ data, handleItemClicked }: { data: EconomicDataItem[]; handleItemClicked: (item: EconomicDataItem) => void }) => {
  const pageSize = 10
  const { page, setPage, displayItems, pageCount } = usePager(data, pageSize)
  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
  }
  return (
    <>
      {displayItems.map((item) => (
        <Box key={item.InternalId}>
          <ListHeader item={item} text={item.Title} onClicked={handleItemClicked} />
        </Box>
      ))}
      <Pager
        pageCount={pageCount}
        itemCount={displayItems.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={page}
        totalItemCount={data.length}
      ></Pager>
    </>
  )
}

export default EconDataTable
