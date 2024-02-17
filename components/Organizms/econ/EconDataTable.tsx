import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { usePager } from 'hooks/usePager'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const EconDataTable = ({ data, handleItemClicked }: { data: EconomicDataItem[]; handleItemClicked: (item: EconomicDataItem) => void }) => {
  const pageSize = 10
  const pager = usePager(data, 10)
  const displayItems = pager.displayItems as EconomicDataItem[]

  const handlePaged = (pageNum: number) => {
    pager.setPage(pageNum)
  }
  return (
    <>
      {displayItems.map((item) => (
        <Box key={item.InternalId}>
          <ListHeader item={item} text={item.Title} onClicked={handleItemClicked} />
        </Box>
      ))}
      <Pager
        pageCount={pager.pageCount}
        itemCount={displayItems.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={pager.page}
        totalItemCount={data.length}
      ></Pager>
    </>
  )
}

export default EconDataTable
