import { Box } from '@mui/material'
import Pager from 'components/Atoms/Pager'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { useClientPager } from 'hooks/useClientPager'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import React from 'react'

const EconDataTable = ({ data, handleItemClicked }: { data: EconomicDataItem[]; handleItemClicked: (item: EconomicDataItem) => void }) => {
  const pageSize = 10
  const pager = useClientPager(data, 10)
  const displayItems = pager.getPagedItems(data)

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
        pageCount={pager.pagerModel.totalNumberOfPages}
        itemCount={displayItems.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={pager.pagerModel.page}
        totalItemCount={pager.pagerModel.totalNumberOfItems}
      ></Pager>
    </>
  )
}

export default EconDataTable
